import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = "assets/data";

const readJSON = (...parts) => JSON.parse(fs.readFileSync(path.join(ROOT, ...parts), "utf8"));

const config = readJSON(DATA_DIR, "config.json");
const { site, person, format, footer: FOOTER, pages: PAGES } = config;

const LANGS = Object.keys(site.languages);
const HOST = new URL(site.url).host;

const fail = (message) => {
  throw new Error(`build: ${message}`);
};

if (LANGS.length !== 2) fail("il selettore di lingua supporta esattamente due lingue");
if (!LANGS.includes(site.defaultLang)) fail(`defaultLang "${site.defaultLang}" non è in languages`);

const otherLang = (lang) => LANGS.find((code) => code !== lang);

const fill = (template, vars) =>
  template.replace(/\{(\w+)\}/g, (_, key) => {
    if (!(key in vars)) fail(`segnaposto {${key}} sconosciuto in "${template}"`);
    return vars[key];
  });

const fileSafe = (value) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/[^\w]+/g, "_")
    .replace(/^_+|_+$/g, "");

const bare = (url) =>
  url
    .replace(/^[a-z][a-z0-9+.-]*:(\/\/)?/i, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

const trimSlash = (value) => value.replace(/\/$/, "");

const escapeText = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const escapeAttr = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

const REQUIRED = {
  meta: ["headline", "description", "jobTitle"],
  ui: ["nav", "tools", "actions", "contacts", "links", "footer"],
};

const loadData = (lang) => {
  const data = readJSON(DATA_DIR, `${lang}.json`);
  for (const [group, keys] of Object.entries(REQUIRED)) {
    for (const key of keys) {
      if (data[group]?.[key] === undefined) fail(`${lang}.json: manca "${group}.${key}"`);
    }
  }
  if (!Array.isArray(data.title)) fail(`${lang}.json: "title" deve essere un array di righe`);
  return data;
};

const resolveContacts = (lang, data) => {
  const contacts = {};

  for (const [key, entry] of Object.entries(config.contacts)) {
    contacts[key] = {
      label: entry.label,
      url: entry.url,
      text: entry.text ?? (entry.url ? bare(entry.url) : undefined),
    };
  }

  const other = otherLang(lang);
  contacts.website = {
    ...contacts.website,
    url: `${site.url}${PAGES.site.url[lang]}`,
    text: HOST,
  };
  contacts.cv = {
    ...contacts.cv,
    url: PAGES.cv.url[lang],
    text: `${HOST}${trimSlash(PAGES.cv.url[site.defaultLang])}`,
  };
  contacts.translate = {
    label: data.ui.actions.translate,
    url: PAGES.site.url[other],
    text: `${HOST}${trimSlash(PAGES.site.url[other])}`,
    hreflang: other,
  };

  for (const [key, entry] of Object.entries(data.contacts ?? {})) {
    contacts[key] = { ...contacts[key], ...entry };
  }
  for (const [key, label] of Object.entries(data.ui.contacts)) {
    contacts[key] = { ...contacts[key], label };
  }
  return contacts;
};

const h = (tag, attrs = {}, ...children) => ({
  tag,
  attrs: Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([name, value]) => [name, value === true ? "" : String(value)]),
  children: children
    .flat(Infinity)
    .filter((child) => child !== undefined && child !== null && child !== false),
});

const toHTML = (node) => {
  if (typeof node === "string") return escapeText(node);
  const attrs = node.attrs.map(([name, value]) => ` ${name}="${escapeAttr(value)}"`).join("");
  if (node.tag === "img") return `<${node.tag}${attrs}>`;
  return `<${node.tag}${attrs}>${node.children.map(toHTML).join("")}</${node.tag}>`;
};

const slug = (key) => key.replaceAll("_", "-");

const icon = (ctx, dir, name, alt = "") =>
  name && ctx.cfg.icons.includes(dir)
    ? h("img", { src: `${site.assets}/icons/${ctx.page}/${dir}/${name}.svg`, alt })
    : null;

const link = (url, attrs, ...children) => {
  const external = /^https?:/.test(url ?? "");
  return h(
    "a",
    {
      href: url,
      target: external && "_blank",
      rel: external && "noopener noreferrer",
      ...attrs,
    },
    ...children,
  );
};

const separator = (value) => h("span", { "data-separator": "", "aria-hidden": "true" }, value);

const joinWith = (items, value) =>
  items.flatMap((item, i) => (i ? [separator(value), item] : [item]));

const ACTIONS = {
  back: (ctx) => ({ icon: "arrow-left", href: PAGES.site.url[ctx.lang] }),
  outline: () => ({ tag: "button", icon: "outline", disabled: true, active: "false" }),
  print: () => ({ tag: "button", icon: "print", disabled: true }),
  translate: (ctx) => {
    const other = otherLang(ctx.lang);
    return {
      icon: "translate",
      href: ctx.cfg.url[other],
      hreflang: other,
      active: String(ctx.lang === LANGS[1]),
    };
  },
};

const renderAction = (ctx, action) => {
  const build = ACTIONS[action] ?? fail(`azione "${action}" sconosciuta`);
  const { tag = "a", icon: name, href, hreflang, active, disabled } = build(ctx);
  const label = ctx.data.ui.actions[action] ?? fail(`${ctx.lang}.json: manca ui.actions.${action}`);
  return h(
    tag,
    {
      type: tag === "button" && "button",
      disabled,
      href,
      hreflang,
      "data-action": action,
      "data-active": active,
    },
    icon(ctx, "ui", name),
    h("span", { lang: action === "translate" ? hreflang : undefined }, label),
  );
};

const renderToolbar = (ctx) =>
  ctx.cfg.actions.length > 0 &&
  h(
    "nav",
    { "aria-label": ctx.data.ui.tools, "data-tools": true },
    ...ctx.cfg.actions.map((action) => renderAction(ctx, action)),
  );

const renderNav = (ctx) => {
  const { nav } = ctx.cfg;
  return (
    nav.length > 0 &&
    h(
      "nav",
      { "aria-label": ctx.data.ui.nav },
      ...nav.map((key, i) => {
        const section = ctx.data[key] ?? fail(`${ctx.lang}.json: manca la sezione "${key}" (nav)`);
        return h(
          "a",
          {
            href: key === "summary" ? "#" : `#${slug(key)}`,
            "aria-current": i === 0 && "true",
          },
          section.title.toUpperCase(),
        );
      }),
    )
  );
};

const renderContact = (ctx, key) => {
  const entry = ctx.contacts[key] ?? fail(`contatto "${key}" non definito (${ctx.page}/${ctx.lang})`);
  const { url, text: value, hreflang, label } = entry;
  if (!label) fail(`contatto "${key}" senza etichetta (${ctx.lang})`);
  if (!value) fail(`contatto "${key}" senza testo (${ctx.lang})`);
  return link(
    url,
    { "data-label": label, hreflang },
    icon(ctx, "links", key),
    h("span", {}, ` ${label}${format.labelSeparator}`, h("span", { "data-value": "" }, value)),
  );
};

const renderContacts = (ctx) =>
  h(
    "address",
    {},
    ...ctx.cfg.contacts.map((row) =>
      h("p", {}, ...joinWith(row.map((key) => renderContact(ctx, key)), format.separator)),
    ),
  );

const renderHeader = (ctx) =>
  h(
    "header",
    {},
    h("h1", {}, site.name),
    h("p", {}, ...ctx.data.title.flatMap((line, i) => [i > 0 && " ", h("span", {}, line)])),
    renderNav(ctx),
    renderContacts(ctx),
  );

const entityText = (name, bold) => {
  const [, main, secondary] = name.match(/^(.*?)(?:\s*\((.*)\))?$/s);
  return [bold ? h("strong", {}, main) : main, secondary && h("small", {}, ` (${secondary})`)];
};

const renderEntities = (ctx, subtitle, icons) => {
  const names = [].concat(subtitle ?? []);
  return h(
    "span",
    { "data-entities": "" },
    ...names.map((name, i) =>
      h(
        "span",
        {},
        icon(ctx, "articles", icons[i]),
        h("span", {}, ...entityText(name, i === 0)),
        i < names.length - 1 && separator(format.listSeparator),
      ),
    ),
  );
};

const linkRank = (type) => {
  const index = format.linkOrder.indexOf(type);
  return index === -1 ? format.linkOrder.length : index;
};

const renderLink = (ctx, item, title) => {
  const { links } = ctx.data.ui;
  const label = links[item.type] ?? item.type;
  const unavailable = `${links.unavailableLabel[item.type] ?? item.type} ${links.unavailableSuffix}`;
  return h(
    "li",
    {},
    link(
      item.url,
      { "data-type": item.type, "aria-label": item.url && `${label} - ${title}` },
      item.url ? label : unavailable,
    ),
  );
};

const renderBullet = (bullet) =>
  h("li", {}, h("span", { "data-bullet": "", "aria-hidden": "true" }, format.bullet), bullet);

const renderSkills = ({ label, text: value }) =>
  h(
    "article",
    { "data-skills": "" },
    h("h3", {}, label, separator(format.labelSeparator)),
    h(
      "p",
      {},
      ...joinWith(
        value
          .split(/,\s*/)
          .filter(Boolean)
          .map((tag) => h("span", {}, tag)),
        format.listSeparator,
      ),
    ),
  );

const renderEntry = (ctx, { id, title, url, date, subtitle, detail, bullets = [], links = [] }) => {
  const icons = [].concat(config.entityIcons[id] ?? []);
  const sortedLinks = [...links].sort((a, b) => linkRank(a.type) - linkRank(b.type));
  const dates = [].concat(date ?? []).map((value) => h("span", {}, value));

  return h(
    "article",
    {},
    h(
      "div",
      {},
      h(
        "h3",
        {},
        url && ctx.cfg.linkTitles ? link(url, {}, title) : title,
        separator(format.separator),
      ),
      h("time", {}, ...joinWith(dates, format.dateSeparator)),
    ),
    h(
      "p",
      {},
      renderEntities(ctx, subtitle, icons),
      ...(detail ? [separator(format.separator), h("span", {}, detail)] : []),
    ),
    h(
      "ul",
      {},
      ...sortedLinks.map((item) => renderLink(ctx, item, title)),
      ...bullets.map(renderBullet),
    ),
  );
};

const renderArticle = (ctx, item) => (item.label ? renderSkills(item) : renderEntry(ctx, item));

const renderSection = (ctx, spec) => {
  const [, key, filter] = spec.match(/^([^[]+)(?:\[(.*)\])?$/);
  const section = ctx.data[key] ?? fail(`${ctx.lang}.json: manca la sezione "${key}"`);

  const { title, text: paragraphs = [], items = [] } = section;
  const allowed = filter ? filter.split(",").map((token) => token.trim()) : [];
  const idOf = (item) => item.id ?? item.label;

  for (const id of allowed) {
    if (!items.some((item) => idOf(item) === id)) {
      fail(`${ctx.lang}.json: "${key}" non contiene l'elemento "${id}"`);
    }
  }

  const isUntitled = ctx.cfg.untitled.includes(key);
  const visibleItems = filter ? items.filter((item) => allowed.includes(idOf(item))) : items;

  return h(
    "section",
    { id: slug(key), "aria-label": isUntitled ? title : undefined },
    !isUntitled && h("h2", {}, icon(ctx, "sections", key), title),
    ...paragraphs.map((paragraph) => h("p", {}, paragraph)),
    ...visibleItems.map((item) => renderArticle(ctx, item)),
  );
};

const renderFooter = (ctx) => {
  const text = ctx.data.ui.footer;
  return h(
    "footer",
    {},
    h(
      "p",
      {},
      text.builtWith,
      ...FOOTER.builtWith.flatMap((name, i, all) => [
        icon(ctx, "footer", name.toLowerCase(), name),
        i < all.length - 1 ? `${name},` : name,
      ]),
    ),
    h(
      "p",
      {},
      text.icons,
      ...FOOTER.iconCredits.map(([name, url], i, all) =>
        i < all.length - 1 ? h("span", {}, link(url, {}, name), ",") : link(url, {}, name),
      ),
    ),
    h("p", {}, text.typography, link(FOOTER.typography.url, {}, FOOTER.typography.name)),
    h("p", {}, text.source, link(site.repository, {}, FOOTER.sourceName)),
    h("p", {}, fill(text.copyright, { name: site.name })),
  );
};

const renderPage = (ctx) => {
  const { cfg } = ctx;
  const columns = cfg.columns.map((keys) => keys.map((key) => renderSection(ctx, key)));

  const contents = columns.map((sections, i) =>
    h(
      "div",
      {},
      i === 0 && renderHeader(ctx),
      sections,
      cfg.footer && i === columns.length - 1 && renderFooter(ctx),
    ),
  );

  return h(
    "main",
    {},
    renderToolbar(ctx),
    cfg.frames ? contents.map((content) => h("div", {}, content)) : contents,
  );
};

const metaFor = (data, lang) => {
  const vars = { name: site.name, lang, ...data.meta };
  return {
    title: fill(site.titleTemplate, vars),
    description: fill(site.descriptionTemplate, vars),
    vars: { ...vars, nameFile: fileSafe(site.name) },
  };
};

const personSchema = (ctx) => {
  const { data, contacts, lang } = ctx;

  const sameAs = person.sameAs.map((key) => {
    const url = contacts[key]?.url;
    if (!/^https?:/.test(url ?? "")) fail(`person.sameAs: "${key}" non ha un URL assoluto`);
    return url;
  });

  const skill = person.knowsAboutSkill
    ? data.skills?.items.find((item) => item.id === person.knowsAboutSkill)
    : null;
  if (person.knowsAboutSkill && !skill) {
    fail(`${lang}.json: skills non contiene "${person.knowsAboutSkill}" (person.knowsAboutSkill)`);
  }

  const university = (entry) => ({ "@type": "CollegeOrUniversity", ...entry });

  return {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    url: `${site.url}${PAGES.site.url[lang]}`,
    jobTitle: data.meta.jobTitle,
    affiliation: person.affiliation && university(person.affiliation),
    alumniOf: person.alumniOf?.map(university),
    knowsAbout: skill?.text.split(/,\s*/).filter(Boolean),
    sameAs,
  };
};

const jsonLd = (ctx, canonical, title, indent) => {
  const personNode = personSchema(ctx);
  const graph =
    ctx.page === "cv"
      ? {
          "@type": "ProfilePage",
          url: canonical,
          name: title,
          inLanguage: ctx.lang,
          mainEntity: personNode,
        }
      : personNode;
  const json = JSON.stringify({ "@context": "https://schema.org", ...graph }, null, 2).replaceAll(
    "<",
    "\\u003c",
  );
  const body = json
    .split("\n")
    .map((line) => `${indent}${line}`)
    .join("\n");
  return `<script type="application/ld+json">\n${body}\n${indent}</script>`;
};

const INDENT = "        ";

const renderDocument = (ctx, main) => {
  const { page, lang, cfg } = ctx;
  const meta = metaFor(ctx.data, lang);
  const canonical = `${site.url}${cfg.url[lang]}`;
  const pageTitle = cfg.title ? fill(cfg.title, meta.vars) : meta.title;
  const favicon = `${site.assets}/icons/favicon`;

  const alternates = [
    ...LANGS.map((code) => [code, cfg.url[code]]),
    ["x-default", cfg.url[site.defaultLang]],
  ]
    .map(([code, url]) => `<link rel="alternate" hreflang="${code}" href="${site.url}${url}" />`)
    .join(`\n${INDENT}`);

  const ogLocales = [
    `<meta property="og:locale" content="${site.languages[lang]}" />`,
    ...LANGS.filter((code) => code !== lang).map(
      (code) => `<meta property="og:locale:alternate" content="${site.languages[code]}" />`,
    ),
  ].join(`\n${INDENT}`);

  const fonts = site.fonts
    .map(
      (file) => `<link
            rel="preload"
            href="${site.assets}/fonts/${file}"
            as="font"
            type="font/woff2"
            crossorigin
        />`,
    )
    .join(`\n${INDENT}`);

  const schema = cfg.jsonld ? `\n${INDENT}${jsonLd(ctx, canonical, meta.title, INDENT)}\n` : "";

  return `<!doctype html>
<html lang="${lang}">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="${cfg.viewport}" />

        <title>${escapeText(pageTitle)}</title>

        <meta
            name="description"
            content="${escapeAttr(meta.description)}"
        />
        <meta name="author" content="${escapeAttr(site.name)}" />

        <link
            rel="icon"
            type="image/png"
            href="${favicon}/favicon-96x96.png"
            sizes="96x96"
        />
        <link
            rel="icon"
            type="image/svg+xml"
            href="${favicon}/favicon.svg"
        />
        <link rel="shortcut icon" href="${favicon}/favicon.ico" />
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="${favicon}/apple-touch-icon.png"
        />
        <link rel="manifest" href="${favicon}/site.webmanifest" />
        <meta
            name="apple-mobile-web-app-title"
            content="${escapeAttr(site.appTitle)}"
        />

        <link rel="canonical" href="${canonical}" />
        ${alternates}

        <meta
            property="og:title"
            content="${escapeAttr(meta.title)}"
        />
        <meta
            property="og:description"
            content="${escapeAttr(meta.description)}"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${canonical}" />
        ${ogLocales}

        <meta
            name="google-site-verification"
            content="${escapeAttr(site.verification)}"
        />
${schema}
        ${fonts}

        <link rel="stylesheet" href="${site.assets}/css/base.css" />
        <link rel="stylesheet" href="${site.assets}/css/${page}.css" />

        <script src="${site.assets}/js/${page}.js" defer></script>
    </head>
    <body>
        ${toHTML(main)}
    </body>
</html>
`;
};

const dataByLang = Object.fromEntries(LANGS.map((lang) => [lang, loadData(lang)]));

for (const [page, cfg] of Object.entries(PAGES)) {
  for (const lang of LANGS) {
    const url = cfg.url[lang] ?? fail(`pages.${page}.url.${lang} mancante`);
    const data = dataByLang[lang];
    const ctx = { page, lang, cfg, data, contacts: resolveContacts(lang, data) };

    const file = `${url.replace(/^\//, "")}index.html`;
    const target = path.join(ROOT, ...file.split("/"));

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, renderDocument(ctx, renderPage(ctx)), "utf8");
    console.log(`built ${file}`);
  }
}
