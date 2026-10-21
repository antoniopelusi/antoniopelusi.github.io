const CONFIG = {
  site: {
    footer: true,
    toolbar: "footer",
    pageFrame: false,
    actions: ["translate"],
    untitled: ["summary"],
    header: ["name", "title", "typing", "nav", "contacts"],
    nav: ["summary", "education", "experience", "publications", "projects", "awards", "skills", "other_experience"],
    icons: ["links", "ui", "sections", "articles", "footer"],
  },
  cv: {
    footer: false,
    toolbar: "top",
    pageFrame: true,
    actions: ["back", "translate", "outline", "print"],
    untitled: [],
    header: ["name", "title", "contacts"],
    nav: [],
    icons: ["links", "ui"],
  },
};

const SEPARATOR = " | ";
const DATE_SEPARATOR = " - ";
const LIST_SEPARATOR = ", ";
const LABEL_SEPARATOR = ": ";
const BULLET = "• ";

const LAYOUT = {
  linkOrder: ["paper", "thesis", "model", "repository", "website"],
};

const TEXT = {
  en: {
    nav: "Navigation",
    navOther: "Other",
    tools: "Tools",
    actions: {
      back: "Go back",
      print: "Print this CV",
      overflow: "Overflow detected",
      translate: "Translate",
      outline: "Outline",
    },
    contacts: {
      cv: "CV",
      location: "Location",
      phone: "Phone",
      email: "Email",
      linkedin: "LinkedIn",
      scholar: "Scholar",
      orcid: "ORCID",
      github: "GitHub",
      website: "Web",
    },
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
    phrases: [
      "Debugging ideas",
      "Dodging merge conflicts",
      "Branching hypotheses",
      "Refactoring bugs",
      "Collecting knowledge",
      "Dereferencing pointers",
    ],
  },
  it: {
    nav: "Navigazione",
    navOther: "Altro",
    tools: "Strumenti",
    actions: {
      back: "Torna indietro",
      print: "Stampa il CV",
      overflow: "Overflow rilevato",
      translate: "Translate",
      outline: "Outline",
    },
    contacts: {
      cv: "CV",
      location: "Luogo",
      phone: "Telefono",
      email: "Email",
      linkedin: "LinkedIn",
      scholar: "Scholar",
      orcid: "ORCID",
      github: "GitHub",
      website: "Web",
    },
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
    phrases: [
      "Debuggando idee",
      "Schivando merge conflict",
      "Ramificando ipotesi",
      "Rifattorizzando bug",
      "Raccogliendo conoscenza",
      "Dereferenziando puntatori",
    ],
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

const page = document.body.dataset.page;
const {
  footer,
  toolbar,
  pageFrame,
  actions,
  untitled,
  header,
  nav,
  icons: iconSets,
} = CONFIG[page];
const FLAGS = CONFIG[page].actions.filter((a) => ["translate", "outline"].includes(a));
const params = new URLSearchParams(location.search);
const flags = Object.fromEntries(FLAGS.map((flag) => [flag, params.has(flag)]));
const lang = flags.translate ? "it" : "en";
const text = TEXT[lang];

const localized = (path, next = {}) => {
  const activeFlags = path === location.pathname ? FLAGS : ["translate"];
  const query = activeFlags.filter((flag) => next[flag] ?? flags[flag]).join("&");
  return query ? `${path}?${query}` : path;
};

const syncLinks = () =>
  document.querySelectorAll("a[data-path]").forEach((a) => {
    a.href = localized(a.dataset.path);
  });

const toggle = (icon, flag, apply) => [
  icon,
  (btn) => {
    flags[flag] = !flags[flag];
    btn.dataset.active = flags[flag];
    history.replaceState(null, "", localized(location.pathname) + location.hash);
    syncLinks();
    apply();
  },
  flags[flag],
];

const ACTIONS = {
  back: ["arrow-left", () => location.assign(localized("/"))],
  print: ["printing-page", () => print()],
  translate: toggle("translate", "translate", () => location.reload()),
  outline: toggle("outline", "outline", () =>
    document.body.toggleAttribute("data-outline", flags.outline),
  ),
};

if (location.pathname + location.search !== localized(location.pathname)) {
  history.replaceState(null, "", localized(location.pathname) + location.hash);
}

const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
  el.append(...children.flat().filter(Boolean));
  return el;
};

const slug = (key) => key.replaceAll("_", "-");

const icon = (dir, name, alt = "") =>
  name && iconSets.includes(dir) && h("img", { src: `/assets/icons/${page}/${dir}/${name}.svg`, alt });

const link = (url, attrs, ...children) =>
  h(
    "a",
    {
      ...(url && { href: url }),
      ...(/^https?:/.test(url) && { target: "_blank", rel: "noopener noreferrer" }),
      ...attrs,
    },
    ...children,
  );

const renderButton = (action) => {
  const [name, onClick, active] = ACTIONS[action];
  const el = h(
    "button",
    { type: "button", "data-action": action },
    icon("ui", name),
    h("span", {}, text.actions[action]),
  );
  if (active !== undefined) el.dataset.active = active;
  el.addEventListener("click", () => onClick(el));
  return el;
};

const renderToolbar = () =>
  h(
    "nav",
    { role: "navigation", "aria-label": text.tools },
    ...actions.map((action) => renderButton(action)),
  );

const renderNav = (data) =>
  h(
    "nav",
    { role: "navigation", "aria-label": text.nav },
    ...nav.map((key) =>
      h(
        "a",
        { href: key === "summary" ? "#" : `#${slug(key)}` },
        (key === "other_experience" ? text.navOther : data[key].title).toUpperCase(),
      ),
    ),
  );

const separator = (value) => h("span", { "data-separator": "" }, value);

const renderContacts = (data, contacts) =>
  h(
    "address",
    {},
    ...contacts.map((row) =>
      h(
        "p",
        {},
        ...row.flatMap((key, i) => {
          const label = text.contacts[key];
          const { url, text: value } = data.contacts[key];
          const internal = url?.startsWith("/");
          const attrs = { "data-label": label, ...(internal && { "data-path": url }) };
          return [
            i && separator(SEPARATOR),
            link(
              internal ? localized(url) : url,
              attrs,
              icon("links", key),
              h("span", {}, ` ${label}: `, h("span", { "data-value": "" }, value)),
            ),
          ];
        }),
      ),
    ),
  );

const renderHeader = (data) => {
  const parts = {
    name: () => h("h1", {}, data.name),
    title: () =>
      h(
        "p",
        {},
        ...data.title.flatMap((line, i) => [i && " ", h("span", {}, line)]),
      ),
    typing: () => h("p", {}, h("span"), h("span", {}, "|")),
    nav: () => renderNav(data),
    contacts: () => renderContacts(data, data.layout.contacts[page]),
  };
  return h("header", { role: "banner" }, ...header.map((part) => parts[part]()));
};

const entityText = (name, bold) => {
  const [, main, secondary] = name.match(/^(.*?)(?:\s*\((.*)\))?$/);
  return [bold ? h("strong", {}, main) : main, secondary && h("small", {}, ` (${secondary})`)];
};

const renderEntities = (subtitle, icons) => {
  const names = [].concat(subtitle);
  return h(
    "span",
    { "data-entities": "" },
    ...names.map((name, i) =>
      h(
        "span",
        {},
        icon("articles", icons[i]),
        h("span", {}, ...entityText(name, i === 0)),
        i < names.length - 1 && separator(LIST_SEPARATOR),
      ),
    ),
  );
};

const renderArticle = (item) => {
  if (item.label) {
    const { label, text: value } = item;
    return h(
      "article",
      { "data-skills": "" },
      h("h3", {}, label, separator(LABEL_SEPARATOR)),
      h(
        "p",
        {},
        ...value
          .split(/,\s*/)
          .filter(Boolean)
          .flatMap((tag, i) => [i && separator(LIST_SEPARATOR), h("span", {}, tag)]),
      ),
    );
  }
  const { id, title, date, subtitle, detail, bullets = [], links = [] } = item;
  const icons = [].concat(ICONS[id] ?? []);
  const sortedLinks = [...links].sort(
    (a, b) => LAYOUT.linkOrder.indexOf(a.type) - LAYOUT.linkOrder.indexOf(b.type),
  );
  return h(
    "article",
    {},
    h(
      "div",
      {},
      h("h3", {}, title, separator(SEPARATOR)),
      h(
        "time",
        {},
        ...[].concat(date).flatMap((d, i) => [i && separator(DATE_SEPARATOR), h("span", {}, d)]),
      ),
    ),
    h(
      "p",
      {},
      renderEntities(subtitle, icons),
      ...(detail ? [separator(SEPARATOR), h("span", {}, detail)] : []),
    ),
    h(
      "ul",
      {},
      ...sortedLinks.map(({ type, url }) =>
        h(
          "li",
          {},
          link(
            url,
            { "data-type": type },
            url
              ? text.links[type]
              : `${text.links.unavailableLabel[type]} ${text.links.unavailableSuffix}`,
          ),
        ),
      ),
      ...bullets.map((bullet) => h("li", {}, h("span", { "data-bullet": "" }, BULLET), bullet)),
    ),
  );
};

const renderSection = (spec, data) => {
  const [, key, filter] = spec.match(/^([^[]+)(?:\[(.*)\])?$/);
  const { title, text: paragraphs = [], items = [] } = data[key];
  const tokens = filter ? filter.split(",").map((s) => s.trim()) : null;
  const notitle = tokens?.includes("notitle");
  const allowed = tokens ? tokens.filter((t) => t !== "notitle") : null;
  const filteredItems = allowed?.length ? items.filter((it) => allowed.includes(it.id ?? it.label)) : items;

  return h(
    "section",
    { id: slug(key), ...(untitled.includes(key) && { "aria-label": title }) },
    !untitled.includes(key) && !notitle &&
      h(
        "h2",
        {},
        icon("sections", key),
        title,
      ),
    ...paragraphs.map((paragraph) => h("p", {}, paragraph)),
    ...filteredItems.map(renderArticle),
  );
};

const renderFooter = () =>
  h(
    "footer",
    { role: "contentinfo" },
    toolbar === "footer" && renderToolbar(),
    h(
      "p",
      {},
      text.footer.builtWith,
      ...["HTML", "CSS", "JS"].flatMap((name, i) => [
        icon("footer", name.toLowerCase(), name),
        i < 2 ? `${name},` : name,
      ]),
    ),
    h(
      "p",
      {},
      text.footer.icons,
      h("span", {}, link("https://github.com/PapirusDevelopmentTeam/papirus-icon-theme/", {}, "Papirus"), ","),
      h("span", {}, link("https://iconoir.com/", {}, "Iconoir"), ","),
      link("https://fontawesome.com/icons", {}, "Font Awesome"),
    ),
    h(
      "p",
      {},
      text.footer.typography,
      link("https://fonts.google.com/specimen/Roboto", {}, "Roboto"),
    ),
    h(
      "p",
      {},
      text.footer.source,
      link("https://github.com/antoniopelusi/antoniopelusi.github.io", {}, "GitHub"),
    ),
    h("p", {}, text.footer.copyright),
  );

const render = (data) => {
  document.documentElement.lang = lang;
  document.body.toggleAttribute("data-outline", flags.outline);

  const main = document.querySelector("main");
  const contents = data.layout.pages[page].map((keys) => h("div", {}, ...keys.map((key) => renderSection(key, data))));

  contents[0].prepend(renderHeader(data));
  if (footer) contents.at(-1).append(renderFooter());
  if (toolbar === "top") main.prepend(renderToolbar());
  main.append(...(pageFrame ? contents.map((content) => h("div", {}, content)) : contents));
};

const initTyping = (phrases) => {
  const target = document.querySelector("header > p:nth-of-type(2) span");
  let phrase = 0,
    chars = 0,
    deleting = false;

  const type = () => {
    chars += deleting ? -1 : 1;

    if (!deleting && chars > phrases[phrase].length) {
      setTimeout(() => {
        deleting = true;
        type();
      }, 2000);
      return;
    }
    if (deleting && chars < 0) {
      chars = 0;
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      setTimeout(type, 500);
      return;
    }

    target.textContent = phrases[phrase].substring(0, chars);
    setTimeout(type, deleting ? 25 : 50);
  };

  setTimeout(type, 1000);
};

const initPrintGuard = (button) => {
  const frames = [...document.querySelectorAll("main > div > div")];
  const blocked = () => frames.some((frame) => frame.scrollHeight - frame.clientHeight > 1);

  const sync = () => {
    const overflow = blocked();
    button.disabled = overflow;
    button.lastElementChild.textContent = overflow ? text.actions.overflow : text.actions.print;
    frames.forEach((frame) => {
      const excess = frame.scrollHeight - frame.clientHeight;
      frame.toggleAttribute("data-overflow", excess > 1);
      frame.style.setProperty("--overflow-h", excess > 1 ? `${excess}px` : "0px");
    });
  };

  addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p" && blocked()) {
      event.preventDefault();
    }
  });
  document.fonts.ready.then(sync);
  sync();
};

const initStickyTitles = () => {
  const titles = [...document.querySelectorAll("h2")];

  const update = () =>
    titles.forEach((title) =>
      title.toggleAttribute(
        "data-stuck",
        getComputedStyle(title).position === "sticky" && title.getBoundingClientRect().top <= 0,
      ),
    );

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
};

const initNav = (links) => {
  const headerEl = document.querySelector("header");
  const navEl = headerEl.querySelector("nav");
  const sections = links.slice(1).map((a) => document.querySelector(a.hash));
  let pinned = location.hash ? links.find((a) => a.hash === location.hash) : null;
  let navHeight = 0;

  const checkSpace = () => {
    if (!matchMedia("(min-width: 1024px)").matches) return;
    if (!navHeight) navHeight = navEl.scrollHeight;

    let required = 0;
    for (const child of headerEl.children) {
      if (child === navEl) {
        required += navHeight;
      } else {
        const style = getComputedStyle(child);
        required += child.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }
    }

    headerEl.toggleAttribute("data-compact", headerEl.clientHeight < required);
  };

  const update = () => {
    checkSpace();
    if (!links[0].offsetParent) return;
    const threshold = innerHeight * 0.5;
    const index =
      scrollY < 10
        ? -1
        : sections.findLastIndex((el) => el.getBoundingClientRect().top <= threshold);
    const current = pinned ?? links[index + 1];

    links.forEach((a) => {
      if (a === current) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  };

  links.forEach((a) =>
    a.addEventListener("click", () => {
      pinned = a;
      update();
    }),
  );
  links[0].addEventListener("click", (event) => {
    event.preventDefault();
    history.replaceState(null, "", location.pathname + location.search);
    scrollTo({ top: 0, behavior: "smooth" });
  });
  ["wheel", "touchmove", "keydown", "pointerdown"].forEach((type) =>
    addEventListener(
      type,
      () => {
        pinned = null;
      },
      { passive: true },
    ),
  );
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
};

fetch(`/assets/data/${lang}.json`)
  .then((response) => response.json())
  .then((data) => {
    if (pageFrame) document.title += `_${lang}`;
    render(data);
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    if (header.includes("typing")) initTyping(text.phrases);
    initStickyTitles();
    const printButton = document.querySelector('[data-action="print"]');
    if (printButton) initPrintGuard(printButton);
    const links = [...document.querySelectorAll("header nav a")];
    if (links.length) initNav(links);
  });
