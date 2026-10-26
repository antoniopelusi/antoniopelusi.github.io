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

const BUILT_WITH = ["HTML", "CSS", "JS"];

const ICON_CREDITS = [
  ["Papirus", "https://github.com/PapirusDevelopmentTeam/papirus-icon-theme/"],
  ["Iconoir", "https://iconoir.com/"],
  ["Font Awesome", "https://fontawesome.com/icons"],
];

const TEXT = {
  en: {
    nav: "Navigation",
    navOther: "Others",
    tools: "Tools",
    error: "Content unavailable.",
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
      "Merging conflicts",
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
    error: "Contenuto non disponibile.",
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
      "Mergiando conflitti",
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

const FLAGS = actions.filter((action) => ["translate", "outline"].includes(action));
const params = new URLSearchParams(location.search);
const flags = Object.fromEntries(FLAGS.map((flag) => [flag, params.has(flag)]));
const lang = flags.translate ? "it" : "en";
const text = TEXT[lang];

document.documentElement.lang = lang;
document.body.toggleAttribute("data-outline", Boolean(flags.outline));

const rafThrottle = (fn) => {
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  };
};

const localized = (path) => {
  const activeFlags = path === location.pathname ? FLAGS : ["translate"];
  const query = activeFlags.filter((flag) => flags[flag]).join("&");
  return query ? `${path}?${query}` : path;
};

const syncLinks = () =>
  document.querySelectorAll("a[data-path]").forEach((a) => {
    a.href = localized(a.dataset.path);
  });

const setActive = (button, value) => {
  button.dataset.active = value;
  button.setAttribute("aria-pressed", value);
};

const toggle = (iconName, flag, apply) => [
  iconName,
  (button) => {
    flags[flag] = !flags[flag];
    setActive(button, flags[flag]);
    history.replaceState(null, "", localized(location.pathname) + location.hash);
    syncLinks();
    apply();
  },
  flags[flag],
];

const ACTIONS = {
  back: ["arrow-left", () => location.assign(localized("/"))],
  print: ["printing-page", () => window.print()],
  translate: toggle("translate", "translate", () => location.reload()),
  outline: toggle("outline", "outline", () =>
    document.body.toggleAttribute("data-outline", flags.outline),
  ),
};

const canonicalUrl = localized(location.pathname);
if (location.pathname + location.search !== canonicalUrl) {
  history.replaceState(null, "", canonicalUrl + location.hash);
}

const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null && value !== false) {
      el.setAttribute(name, value === true ? "" : value);
    }
  }
  el.append(...children.flat().filter((child) => child !== undefined && child !== null && child !== false));
  return el;
};

const slug = (key) => key.replaceAll("_", "-");

const icon = (dir, name, alt = "") =>
  name && iconSets.includes(dir)
    ? h("img", { src: `/assets/icons/${page}/${dir}/${name}.svg`, alt })
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

const renderButton = (action) => {
  const [name, onClick, active] = ACTIONS[action];
  const el = h(
    "button",
    { type: "button", "data-action": action },
    icon("ui", name),
    h("span", {}, text.actions[action]),
  );
  if (active !== undefined) setActive(el, active);
  el.addEventListener("click", () => onClick(el));
  return el;
};

const renderToolbar = () =>
  h("nav", { "aria-label": text.tools }, ...actions.map((action) => renderButton(action)));

const renderNav = (data) =>
  h(
    "nav",
    { "aria-label": text.nav },
    ...nav
      .filter((key) => data[key])
      .map((key) =>
        h(
          "a",
          { href: key === "summary" ? "#" : `#${slug(key)}` },
          (key === "other_experience" ? text.navOther : data[key].title).toUpperCase(),
        ),
      ),
  );

const renderContact = (data, key) => {
  const entry = data.contacts[key];
  if (!entry) return null;
  const { url, text: value } = entry;
  const label = text.contacts[key];
  const internal = url?.startsWith("/");
  return link(
    internal ? localized(url) : url,
    { "data-label": label, "data-path": internal && url },
    icon("links", key),
    h("span", {}, ` ${label}${LABEL_SEPARATOR}`, h("span", { "data-value": "" }, value)),
  );
};

const renderContacts = (data, rows) =>
  h(
    "address",
    {},
    ...rows.map((row) =>
      h("p", {}, ...joinWith(row.map((key) => renderContact(data, key)).filter(Boolean), SEPARATOR)),
    ),
  );

const renderHeader = (data) => {
  const parts = {
    name: () => h("h1", {}, data.name),
    title: () =>
      h("p", {}, ...data.title.flatMap((line, i) => [i > 0 && " ", h("span", {}, line)])),
    typing: () =>
      h("p", { "data-typing": "" }, h("span"), h("span", { "aria-hidden": "true" }, "|")),
    nav: () => renderNav(data),
    contacts: () => renderContacts(data, data.layout.contacts[page]),
  };
  return h("header", {}, ...header.map((part) => parts[part]()));
};

const entityText = (name, bold) => {
  const [, main, secondary] = name.match(/^(.*?)(?:\s*\((.*)\))?$/s);
  return [bold ? h("strong", {}, main) : main, secondary && h("small", {}, ` (${secondary})`)];
};

const renderEntities = (subtitle, icons) => {
  const names = [].concat(subtitle ?? []);
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

const linkRank = (type) => {
  const index = LAYOUT.linkOrder.indexOf(type);
  return index === -1 ? LAYOUT.linkOrder.length : index;
};

const renderLink = (item, title) => {
  const label = text.links[item.type] ?? item.type;
  const unavailable = `${text.links.unavailableLabel[item.type] ?? item.type} ${text.links.unavailableSuffix}`;
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

const renderEntry = ({ id, title, url, date, subtitle, detail, bullets = [], links = [] }) => {
  const icons = [].concat(ICONS[id] ?? []);
  const sortedLinks = [...links].sort((a, b) => linkRank(a.type) - linkRank(b.type));
  const dates = [].concat(date ?? []).map((value) => h("span", {}, value));

  return h(
    "article",
    {},
    h(
      "div",
      {},
      h("h3", {}, url && page === "cv" ? link(url, {}, title) : title, separator(SEPARATOR)),
      h("time", {}, ...joinWith(dates, DATE_SEPARATOR)),
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
      ...sortedLinks.map((item) => renderLink(item, title)),
      ...bullets.map(renderBullet),
    ),
  );
};

const renderArticle = (item) => (item.label ? renderSkills(item) : renderEntry(item));

const usedIds = new Set();

const renderSection = (spec, data) => {
  const [, key, filter] = spec.match(/^([^[]+)(?:\[(.*)\])?$/);
  const section = data[key];
  if (!section) return null;

  const { title, text: paragraphs = [], items = [] } = section;
  const tokens = filter ? filter.split(",").map((token) => token.trim()) : [];
  const isUntitled = untitled.includes(key);
  const showTitle = !isUntitled && !tokens.includes("notitle");
  const allowed = tokens.filter((token) => token !== "notitle");
  const visibleItems = allowed.length
    ? items.filter((item) => allowed.includes(item.id ?? item.label))
    : items;

  const id = slug(key);
  const duplicate = usedIds.has(id);
  usedIds.add(id);

  return h(
    "section",
    { id: duplicate ? undefined : id, "aria-label": isUntitled ? title : undefined },
    showTitle && h("h2", {}, icon("sections", key), title),
    ...paragraphs.map((paragraph) => h("p", {}, paragraph)),
    ...visibleItems.map((item) => renderArticle(item)),
  );
};

const renderFooter = () =>
  h(
    "footer",
    {},
    toolbar === "footer" && renderToolbar(),
    h(
      "p",
      {},
      text.footer.builtWith,
      ...BUILT_WITH.flatMap((name, i, all) => [
        icon("footer", name.toLowerCase(), name),
        i < all.length - 1 ? `${name},` : name,
      ]),
    ),
    h(
      "p",
      {},
      text.footer.icons,
      ...ICON_CREDITS.map(([name, url], i, all) =>
        i < all.length - 1 ? h("span", {}, link(url, {}, name), ",") : link(url, {}, name),
      ),
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
  const main = document.querySelector("main");
  const contents = data.layout.pages[page].map((keys) =>
    h("div", {}, ...keys.map((key) => renderSection(key, data))),
  );

  contents[0].prepend(renderHeader(data));
  if (footer) contents.at(-1).append(renderFooter());
  main.append(...(pageFrame ? contents.map((content) => h("div", {}, content)) : contents));
  if (toolbar === "top") main.prepend(renderToolbar());
};

const renderError = () => {
  document.querySelector("main").replaceChildren(h("p", { role: "alert" }, text.error));
};

const initTyping = (phrases) => {
  const root = document.querySelector("[data-typing]");
  const target = root?.firstElementChild;
  if (!target) return;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.textContent = phrases[0];
    return;
  }

  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(root);

  let phrase = 0;
  let chars = 0;
  let deleting = false;

  const schedule = (delay) => setTimeout(tick, delay);

  const tick = () => {
    if (!visible || document.hidden) return schedule(500);

    const current = phrases[phrase];

    if (!deleting && chars === current.length) {
      deleting = true;
      return schedule(2000);
    }
    if (deleting && chars === 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      return schedule(500);
    }

    chars += deleting ? -1 : 1;
    target.textContent = current.slice(0, chars);
    return schedule(deleting ? 25 : 50);
  };

  schedule(1000);
};

const initPrintGuard = (button) => {
  const frames = [...document.querySelectorAll("main > div > div")];
  const label = button.lastElementChild;
  let blocked = false;

  const sync = () => {
    const excess = frames.map((frame) => frame.scrollHeight - frame.clientHeight);
    blocked = excess.some((value) => value > 1);
    button.disabled = blocked;
    label.textContent = blocked ? text.actions.overflow : text.actions.print;

    frames.forEach((frame, i) => {
      const over = excess[i] > 1;
      frame.toggleAttribute("data-overflow", over);
      frame.style.setProperty("--overflow-h", over ? `${excess[i]}px` : "0px");
    });
  };

  const observer = new ResizeObserver(rafThrottle(sync));
  frames.forEach((frame) => [...frame.children].forEach((child) => observer.observe(child)));

  addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key?.toLowerCase() === "p") {
      sync();
      if (blocked) event.preventDefault();
    }
  });
  addEventListener("beforeprint", sync);
  document.fonts.ready.then(sync);
  sync();
};

const initStickyTitles = () => {
  const titles = [...document.querySelectorAll("h2")];
  if (!titles.length) return;

  let sticky = [];

  const update = () => {
    const tops = titles.map((title) => title.getBoundingClientRect().top);
    titles.forEach((title, i) => {
      title.toggleAttribute("data-stuck", sticky[i] && tops[i] <= 0);
    });
  };

  const measure = () => {
    sticky = titles.map((title) => getComputedStyle(title).position === "sticky");
    update();
  };

  addEventListener("scroll", rafThrottle(update), { passive: true });
  addEventListener("resize", rafThrottle(measure), { passive: true });
  measure();
};

const initNav = (links) => {
  const headerEl = document.querySelector("header");
  const navEl = headerEl.querySelector("nav");
  const sections = links.slice(1).map((a) => document.querySelector(a.hash));
  const desktop = matchMedia("(min-width: 1024px)");

  const fromHash = () =>
    location.hash ? (links.find((a) => a.hash === location.hash) ?? null) : null;

  let pinned = fromHash();
  let active = null;
  let navHeight = 0;

  const syncCompact = (remeasure) => {
    if (!desktop.matches || !links[0].checkVisibility()) return;

    if (!navHeight || (remeasure && !headerEl.hasAttribute("data-compact"))) {
      navHeight = navEl.scrollHeight;
    }

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

  const updateActive = () => {
    if (!links[0].checkVisibility()) return;

    let index;
    if (scrollY < 10) {
      index = -1;
    } else if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) {
      index = sections.length - 1;
    } else {
      const threshold = innerHeight * 0.5;
      index = sections.findLastIndex((el) => el && el.getBoundingClientRect().top <= threshold);
    }

    const current = pinned ?? links[index + 1];
    if (current === active) return;

    active?.removeAttribute("aria-current");
    current.setAttribute("aria-current", "location");
    active = current;
  };

  const refresh = (remeasure = false) => {
    syncCompact(remeasure);
    updateActive();
  };

  links.forEach((a) =>
    a.addEventListener("click", () => {
      pinned = a;
      updateActive();
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

  addEventListener("scroll", rafThrottle(updateActive), { passive: true });
  addEventListener("resize", rafThrottle(() => refresh(true)), { passive: true });
  addEventListener("hashchange", () => {
    pinned = fromHash();
    updateActive();
  });

  refresh();
  document.fonts.ready.then(() => refresh(true));
};

const init = () => {
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  if (header.includes("typing")) initTyping(text.phrases);
  initStickyTitles();

  const printButton = document.querySelector('[data-action="print"]');
  if (printButton) initPrintGuard(printButton);

  const links = [...document.querySelectorAll("header nav a")];
  if (links.length) initNav(links);
};

try {
  if (pageFrame) document.title += `_${lang}`;
  render(window.DATA[lang]);
  init();
} catch (error) {
  console.error(error);
  renderError();
}