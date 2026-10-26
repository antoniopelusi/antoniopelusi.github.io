import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://antoniopelusi.github.io";

const COMMON = {
  appTitle: "antoniopelusi.github.io",
  verification: "xBmNs4D8oAAYOdxcLWPzvRMdKA3VqGQzPYwk9zuvREc",
};

const PAGES = {
  site: {
    url: { en: "/", it: "/it/" },
    title: () => "Antonio Pelusi",
    viewport: "width=device-width, initial-scale=1",
    frames: false,
    footer: true,
    linkTitles: false,
    actions: [],
    untitled: ["summary"],
    nav: ["summary", "education", "experience", "publications", "projects", "awards", "skills", "other_experience", "other_projects"],
    icons: ["links", "sections", "articles", "footer"],
  },
  cv: {
    url: { en: "/cv/", it: "/cv/it/" },
    title: (lang) => `CV_Antonio_Pelusi_${lang}`,
    viewport: "width=device-width",
    frames: true,
    footer: false,
    linkTitles: true,
    actions: ["back", "outline", "print", "translate"],
    untitled: [],
    nav: [],
    icons: ["links", "ui"],
  },
};

const SEPARATOR = " | ";
const DATE_SEPARATOR = " - ";
const LIST_SEPARATOR = ", ";
const LABEL_SEPARATOR = ": ";
const BULLET = "• ";

const LINK_ORDER = ["paper", "thesis", "model", "repository", "website"];

const BUILT_WITH = ["HTML", "CSS", "JS"];

const ICON_CREDITS = [
  ["Papirus", "https://github.com/PapirusDevelopmentTeam/papirus-icon-theme/"],
  ["Iconoir", "https://iconoir.com/"],
  ["Font Awesome", "https://fontawesome.com/icons"],
];

const CONTACTS = {
  cv: "CV",
  email: "Email",
  linkedin: "LinkedIn",
  scholar: "Scholar",
  orcid: "ORCID",
  github: "GitHub",
  website: "Web",
};

const TEXT = {
  en: {
    description:
      "Antonio Pelusi - PhD student in Computer Science and software developer. Portfolio showcasing research projects, education and open-source contributions.",
    ogTitle: "Antonio Pelusi - PhD Computer Science",
    nav: "Navigation",
    tools: "Tools",
    actions: {
      back: "Go back",
      outline: "Outline",
      print: "Print",
      translate: "Translate",
    },
    contacts: { ...CONTACTS, translate: "Traduci", location: "Location", phone: "Phone" },
    links: {
      model: "View model",
      repository: "View repository",
      paper: "Read paper",
      thesis: "Read thesis",
      website: "Visit website",
      unavailableSuffix: "not yet available",
      unavailableLabel: {
        model: "Model",
        repository: "Repository",
        paper: "Paper",
        thesis: "Thesis",
        website: "Website",
      },
    },
    footer: {
      builtWith: "Built with",
      typography: "Typography:",
      icons: "Icons:",
      source: "Source:",
      copyright: "© Antonio Pelusi. All rights reserved.",
    },
  },
  it: {
    description:
      "Antonio Pelusi - Dottorando in Informatica e sviluppatore software. Portfolio con progetti di ricerca, formazione e contributi open-source.",
    ogTitle: "Antonio Pelusi - Dottorato in Informatica",
    nav: "Navigazione",
    tools: "Strumenti",
    actions: {
      back: "Torna indietro",
      outline: "Contorni",
      print: "Stampa",
      translate: "Translate",
    },
    contacts: { ...CONTACTS, translate: "Translate", location: "Luogo", phone: "Telefono" },
    links: {
      repository: "Vedi repository",
      model: "Vedi modello",
      paper: "Leggi il paper",
      thesis: "Leggi la tesi",
      website: "Visita il sito",
      unavailableSuffix: "non ancora disponibile",
      unavailableLabel: {
        model: "Modello",
        repository: "Repository",
        paper: "Paper",
        thesis: "Tesi",
        website: "Sito",
      },
    },
    footer: {
      builtWith: "Realizzato con",
      typography: "Tipografia:",
      icons: "Icone:",
      source: "Sorgente:",
      copyright: "© Antonio Pelusi. Tutti i diritti riservati.",
    },
  },
};

const ICONS = {
  ibm: "ibm",
  randompower: "randompower",
  liferay: "liferay",
  paradisi: "school",
  "unimore-tutor": "unimore",
  "unimore-master": "unimore",
  "unimore-bachelor": ["unimore", "liferay"],
  uninsubria: ["uninsubria", "randompower", "ibm"],
  "cbi-attract": ["unibo", "cern", "agh"],
  "explainable-governance": ["uninsubria", "uninsubria", "cnr", "ibm"],
  "privacy-fidelity": ["uninsubria", "ibm", "uninsubria"],
  "categorical-prior-lock-in": ["uninsubria", "ibm", "uninsubria"],
  hackathon: "unimore",
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

const escapeText = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const escapeAttr = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

const toHTML = (node) => {
  if (typeof node === "string") return escapeText(node);
  const attrs = node.attrs.map(([name, value]) => ` ${name}="${escapeAttr(value)}"`).join("");
  if (node.tag === "img") return `<${node.tag}${attrs}>`;
  return `<${node.tag}${attrs}>${node.children.map(toHTML).join("")}</${node.tag}>`;
};

const slug = (key) => key.replaceAll("_", "-");

const icon = (ctx, dir, name, alt = "") =>
  name && ctx.cfg.icons.includes(dir)
    ? h("img", { src: `/assets/icons/${ctx.page}/${dir}/${name}.svg`, alt })
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
  back: (ctx) => ({
    icon: "arrow-left",
    href: PAGES.site.url[ctx.lang],
  }),
  outline: () => ({
    tag: "button",
    icon: "outline",
    disabled: true,
    active: "false",
  }),
  print: () => ({
    tag: "button",
    icon: "print",
    disabled: true,
  }),
  translate: (ctx) => {
    const other = ctx.lang === "en" ? "it" : "en";
    return {
      icon: "translate",
      href: ctx.cfg.url[other],
      hreflang: other,
      active: String(ctx.lang === "it"),
    };
  },
};

const renderAction = (ctx, action) => {
  const { tag = "a", icon: name, href, hreflang, active, disabled } = ACTIONS[action](ctx);
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
    h("span", {}, ctx.text.actions[action]),
  );
};

const renderToolbar = (ctx) =>
  ctx.cfg.actions.length > 0 &&
  h(
    "nav",
    { "aria-label": ctx.text.tools, "data-tools": true },
    ...ctx.cfg.actions.map((action) => renderAction(ctx, action)),
  );

const renderNav = (ctx) => {
  const keys = ctx.cfg.nav.filter((key) => ctx.data[key]);
  return (
    keys.length > 0 &&
    h(
      "nav",
      { "aria-label": ctx.text.nav },
      ...keys.map((key) =>
        h(
          "a",
          { href: key === "summary" ? "#" : `#${slug(key)}` },
          ctx.data[key].title.toUpperCase(),
        ),
      ),
    )
  );
};

const renderContact = (ctx, key) => {
  const entry = ctx.data.contacts[key];
  if (!entry) return null;
  const { url, text: value, hreflang } = entry;
  const label = ctx.text.contacts[key];
  return link(
    url,
    { "data-label": label, hreflang },
    icon(ctx, "links", key),
    h("span", {}, ` ${label}${LABEL_SEPARATOR}`, h("span", { "data-value": "" }, value)),
  );
};

const renderContacts = (ctx, rows) =>
  h(
    "address",
    {},
    ...rows.map((row) =>
      h(
        "p",
        {},
        ...joinWith(row.map((key) => renderContact(ctx, key)).filter(Boolean), SEPARATOR),
      ),
    ),
  );

const renderHeader = (ctx) => {
  const { data } = ctx;
  return h(
    "header",
    {},
    h("h1", {}, data.name),
    h("p", {}, ...data.title.flatMap((line, i) => [i > 0 && " ", h("span", {}, line)])),
    renderNav(ctx),
    renderContacts(ctx, data.layout.contacts[ctx.page]),
  );
};

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
        i < names.length - 1 && separator(LIST_SEPARATOR),
      ),
    ),
  );
};

const linkRank = (type) => {
  const index = LINK_ORDER.indexOf(type);
  return index === -1 ? LINK_ORDER.length : index;
};

const renderLink = (ctx, item, title) => {
  const { links } = ctx.text;
  const label = links[item.type] ?? item.type;
  const unavailable = `${links.unavailableLabel[item.type] ?? item.type} ${links.unavailableSuffix}`;
  return h(
    "li",
    {},
    link(
      item.url,
      {
        "data-type": item.type,
        "aria-label": item.url && `${label} - ${title}`,
      },
      item.url ? label : unavailable,
    ),
  );
};

const renderBullet = (bullet) =>
  h("li", {}, h("span", { "data-bullet": "", "aria-hidden": "true" }, BULLET), bullet);

const renderSkills = ({ label, text: value }) =>
  h(
    "article",
    { "data-skills": "" },
    h("h3", {}, label, separator(LABEL_SEPARATOR)),
    h(
      "p",
      {},
      ...joinWith(
        value
          .split(/,\s*/)
          .filter(Boolean)
          .map((tag) => h("span", {}, tag)),
        LIST_SEPARATOR,
      ),
    ),
  );

const renderEntry = (ctx, { id, title, url, date, subtitle, detail, bullets = [], links = [] }) => {
  const icons = [].concat(ICONS[id] ?? []);
  const sortedLinks = [...links].sort((a, b) => linkRank(a.type) - linkRank(b.type));
  const dates = [].concat(date ?? []).map((value) => h("span", {}, value));

  return h(
    "article",
    {},
    h(
      "div",
      {},
      h("h3", {}, url && ctx.cfg.linkTitles ? link(url, {}, title) : title, separator(SEPARATOR)),
      h("time", {}, ...joinWith(dates, DATE_SEPARATOR)),
    ),
    h(
      "p",
      {},
      renderEntities(ctx, subtitle, icons),
      ...(detail ? [separator(SEPARATOR), h("span", {}, detail)] : []),
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
  const section = ctx.data[key];
  if (!section) return null;

  const { title, text: paragraphs = [], items = [] } = section;
  const allowed = filter ? filter.split(",").map((token) => token.trim()) : [];
  const isUntitled = ctx.cfg.untitled.includes(key);
  const visibleItems = filter
    ? items.filter((item) => allowed.includes(item.id ?? item.label))
    : items;

  return h(
    "section",
    { id: slug(key), "aria-label": isUntitled ? title : undefined },
    !isUntitled && h("h2", {}, icon(ctx, "sections", key), title),
    ...paragraphs.map((paragraph) => h("p", {}, paragraph)),
    ...visibleItems.map((item) => renderArticle(ctx, item)),
  );
};

const renderFooter = (ctx) => {
  const { footer } = ctx.text;
  return h(
    "footer",
    {},
    h(
      "p",
      {},
      footer.builtWith,
      ...BUILT_WITH.flatMap((name, i, all) => [
        icon(ctx, "footer", name.toLowerCase(), name),
        i < all.length - 1 ? `${name},` : name,
      ]),
    ),
    h(
      "p",
      {},
      footer.icons,
      ...ICON_CREDITS.map(([name, url], i, all) =>
        i < all.length - 1 ? h("span", {}, link(url, {}, name), ",") : link(url, {}, name),
      ),
    ),
    h("p", {}, footer.typography, link("https://fonts.google.com/specimen/Roboto", {}, "Roboto")),
    h(
      "p",
      {},
      footer.source,
      link("https://github.com/antoniopelusi/antoniopelusi.github.io", {}, "GitHub"),
    ),
    h("p", {}, footer.copyright),
  );
};

const renderPage = ({ page, lang, data }) => {
  const cfg = PAGES[page];
  const ctx = { page, lang, data, cfg, text: TEXT[lang] };

  const columns = data.layout.pages[page].map((keys) => keys.map((key) => renderSection(ctx, key)));

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

const INDENT = "        ";

const renderDocument = ({ page, lang, main }) => {
  const cfg = PAGES[page];
  const text = TEXT[lang];
  const canonical = `${SITE_URL}${cfg.url[lang]}`;

  const alternates = [
    ["en", cfg.url.en],
    ["it", cfg.url.it],
    ["x-default", cfg.url.en],
  ]
    .map(([code, url]) => `<link rel="alternate" hreflang="${code}" href="${SITE_URL}${url}" />`)
    .join(`\n${INDENT}`);

  return `<!doctype html>
<html lang="${lang}">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="${cfg.viewport}" />

        <title>${cfg.title(lang)}</title>

        <meta
            name="description"
            content="${text.description}"
        />
        <meta name="author" content="Antonio Pelusi" />

        <link
            rel="icon"
            type="image/png"
            href="/assets/icons/favicon/favicon-96x96.png"
            sizes="96x96"
        />
        <link
            rel="icon"
            type="image/svg+xml"
            href="/assets/icons/favicon/favicon.svg"
        />
        <link rel="shortcut icon" href="/assets/icons/favicon/favicon.ico" />
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/assets/icons/favicon/apple-touch-icon.png"
        />
        <link rel="manifest" href="/assets/icons/favicon/site.webmanifest" />
        <meta
            name="apple-mobile-web-app-title"
            content="${COMMON.appTitle}"
        />

        <link rel="canonical" href="${canonical}" />
        ${alternates}

        <meta
            property="og:title"
            content="${text.ogTitle}"
        />
        <meta
            property="og:description"
            content="${text.description}"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${canonical}" />

        <meta
            name="google-site-verification"
            content="${COMMON.verification}"
        />

        <link
            rel="preload"
            href="/assets/fonts/Roboto-Regular.woff2"
            as="font"
            type="font/woff2"
            crossorigin
        />
        <link
            rel="preload"
            href="/assets/fonts/Roboto-Bold.woff2"
            as="font"
            type="font/woff2"
            crossorigin
        />

        <link rel="stylesheet" href="/assets/css/base.css" />
        <link rel="stylesheet" href="/assets/css/${page}.css" />

        <script src="/assets/js/${page}.js" defer></script>
    </head>
    <body>
        ${toHTML(main)}
    </body>
</html>
`;
};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const OUTPUTS = [
  { page: "site", lang: "en", file: "index.html" },
  { page: "site", lang: "it", file: "it/index.html" },
  { page: "cv", lang: "en", file: "cv/index.html" },
  { page: "cv", lang: "it", file: "cv/it/index.html" },
];

for (const { page, lang, file } of OUTPUTS) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "data", `${lang}.json`), "utf8"));
  const main = renderPage({ page, lang, data });
  const target = path.join(ROOT, ...file.split("/"));

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, renderDocument({ page, lang, main }), "utf8");
  console.log(`built ${file}`);
}
