const CONFIG = {
  site: {
    footer: true,
    toolbar: "footer",
    pageFrame: false,
    actions: ["translate", "outline"],
    untitled: ["summary"],
    header: ["name", "title", "typing", "nav", "contacts"],
    nav: ["summary", "education", "experience", "publications", "projects", "awards", "skills"],
    pages: [
      [
        "summary",
        "education",
        "experience",
        "side_experience",
        "publications",
        "projects",
        "side_projects",
        "awards",
        "skills",
      ],
    ],
    contacts: [
      ["cv", "email", "linkedin", "scholar", "orcid", "github"],
    ],
    contactLabels: false,
    titleLines: true,
    sectionIcons: true,
    articleIcons: true,
    articleLinks: true,
    skillTags: true,
    separator: "",
    articleHead: ["time", "h3"],
  },
  cv: {
    footer: false,
    toolbar: "top",
    pageFrame: true,
    actions: ["back", "translate", "outline", "print"],
    untitled: [],
    header: ["name", "title", "contacts"],
    nav: [],
    pages: [
      ["summary", "education", "experience", "publications"],
      ["projects", "awards", "skills"],
    ],
    contacts: [
      ["phone", "email", "linkedin"],
      ["website", "github"],
      ["scholar", "orcid"],
    ],
    contactLabels: true,
    titleLines: false,
    sectionIcons: false,
    articleIcons: false,
    articleLinks: false,
    skillTags: false,
    separator: " | ",
    articleHead: ["h3", "time"],
  },
};

const TEXT = {
  en: {
    nav: "Navigation",
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
      repository: "View repository",
      model: "View model",
      paper: "Read paper",
      website: "Visit website",
      unavailable: "Not yet available",
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
      website: "Visita il sito",
      unavailable: "Non ancora disponibile",
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
  paradisi: "school",
  "unimore-tutor": "unimore",
  "unimore-master": "unimore",
  "unimore-bachelor": "unimore",
  "cbi-attract": "unibo",
  "explainable-governance": "uninsubria",
  "privacy-fidelity": "uninsubria",
  "categorical-prior-lock-in": "uninsubria",
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
  pages,
  contacts,
  contactLabels,
  titleLines,
  sectionIcons,
  articleIcons,
  articleLinks,
  skillTags,
  separator,
  articleHead,
} = CONFIG[page];
const FLAGS = ["translate", "outline"];
const params = new URLSearchParams(location.search);
const flags = Object.fromEntries(FLAGS.map((flag) => [flag, params.has(flag)]));
const lang = flags.translate ? "it" : "en";
const text = TEXT[lang];

const localized = (path, next = {}) => {
  const query = FLAGS.filter((flag) => next[flag] ?? flags[flag]).join("&");
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
  const [icon, onClick, active] = ACTIONS[action];
  const el = h(
    "button",
    { type: "button", "data-action": action },
    h("img", { src: `/assets/icons/${page}/ui/${icon}.svg`, alt: "" }),
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
      h("a", { href: key === "summary" ? "#" : `#${slug(key)}` }, data[key].title.toUpperCase()),
    ),
  );

const renderContacts = (data) =>
  h(
    "address",
    {},
    ...contacts.map((row) =>
      h(
        "p",
        {},
        ...row.flatMap((key, i) => {
          const gap = i && separator;
          const label = text.contacts[key];
          const { url, text: value } = data.contacts[key];
          const attrs = contactLabels ? {} : { "aria-label": label };
          const internal = url?.startsWith("/");
          return [
            gap,
            link(
              internal ? localized(url) : url,
              internal ? { ...attrs, "data-path": url } : attrs,
              h("img", { src: `/assets/icons/${page}/links/${key}.svg`, alt: "" }),
              contactLabels && [h("span", {}, label), ": ", value],
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
        ...data.title.flatMap((line, i) => [
          i && " ",
          titleLines ? h("span", {}, line) : line,
        ]),
      ),
    typing: () => h("p", {}, h("span"), h("span", {}, "|")),
    nav: () => renderNav(data),
    contacts: () => renderContacts(data),
  };
  return h("header", { role: "banner" }, ...header.map((part) => parts[part]()));
};

const renderArticle = ({ id, title, date, subtitle, detail, bullets, status, links = [] }) => {
  const head = { time: h("time", {}, date), h3: h("h3", {}, title) };
  return h(
    "article",
    status && { "data-status": status },
    h("div", {}, ...articleHead.flatMap((part, i) => [i && separator, head[part]])),
    h(
      "p",
      {},
      articleIcons && h("img", { src: `/assets/icons/${page}/articles/${ICONS[id] ?? id}.svg`, alt: "" }),
      h("span", {}, subtitle),
      ...(detail ? [separator, h("span", {}, detail)] : []),
    ),
    h(
      "ul",
      {},
      ...bullets.map((bullet) => h("li", {}, bullet)),
      ...(articleLinks ? links : []).map(({ type, url }) =>
        h("li", {}, link(url, { "data-type": type }, url ? text.links[type] : text.links.unavailable)),
      ),
    ),
  );
};

const renderSkills = (items) =>
  skillTags
    ? h(
        "dl",
        {},
        ...items.map(({ label, text: value }) => {
          const tokens = value.split(/,\s*|\s+-\s+/).map((t) => t.trim()).filter(Boolean);
          return h(
            "div",
            {},
            h("dt", {}, label),
            h("dd", {}, ...tokens.map((t) => h("span", {}, t))),
          );
        }),
      )
    : h(
        "div",
        {},
        ...items.map(({ label, text: value }) => h("p", {}, h("strong", {}, label), ": ", value)),
      );

const renderSection = (key, { title, text: paragraphs = [], items = [] }) => {
  const hasSkills = items.length > 0 && items[0].label;
  const renderedItems =
    hasSkills
      ? [renderSkills(items)]
      : items.map((item) => renderArticle(item));
  return h(
    "section",
    { id: slug(key), ...(untitled.includes(key) && { "aria-label": title }) },
    !untitled.includes(key) &&
      h(
        "h2",
        {},
        sectionIcons && h("img", { src: `/assets/icons/${page}/sections/${key}.svg`, alt: "" }),
        title,
      ),
    ...paragraphs.map((paragraph) => h("p", {}, paragraph)),
    ...renderedItems,
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
        h("img", { src: `/assets/icons/${page}/footer/${name.toLowerCase()}.svg`, alt: name }),
        i < 2 ? `${name},` : name,
      ]),
    ),
    h(
      "p",
      {},
      text.footer.typography,
      link("https://fonts.google.com/specimen/Roboto", {}, "Roboto"),
      `- ${text.footer.icons}`,
      link("https://github.com/PapirusDevelopmentTeam/papirus-icon-theme/", {}, "Papirus"),
      `- ${text.footer.source}`,
      link("https://github.com/antoniopelusi/antoniopelusi.github.io", {}, "GitHub"),
    ),
    h("p", {}, text.footer.copyright),
  );

const render = (data) => {
  document.documentElement.lang = lang;
  document.body.toggleAttribute("data-outline", flags.outline);

  const main = document.querySelector("main");
  const contents = pages.map((keys) => h("div", {}, ...keys.map((key) => renderSection(key, data[key]))));

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
  const sections = links.slice(1).map((a) => document.querySelector(a.hash));
  let pinned = location.hash ? links.find((a) => a.hash === location.hash) : null;

  const update = () => {
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
    render(data);
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    if (header.includes("typing")) initTyping(text.phrases);
    initStickyTitles();
    const printButton = document.querySelector('[data-action="print"]');
    if (printButton) initPrintGuard(printButton);
    const links = [...document.querySelectorAll("header nav a")];
    if (links.length) initNav(links);
  });
