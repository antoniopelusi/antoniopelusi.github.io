const TOP_ZONE = "15vh";

const links = [...document.querySelectorAll("header nav a")];
const first = document.querySelector("main section");

const targetOf = (link) =>
  link.getAttribute("href") === "#" ? first : document.querySelector(link.hash);

const targets = links.map(targetOf);
const inZone = new Set();
const edge = { top: true, bottom: false };
let shown = -1;

const current = () => {
  if (edge.bottom) return links.length - 1;
  if (edge.top) return 0;
  let index = Math.max(shown, 0);
  targets.forEach((target, i) => {
    if (target && inZone.has(target)) index = i;
  });
  return index;
};

const render = () => {
  const index = current();
  if (index === shown) return;
  shown = index;
  links.forEach((link, i) => {
    if (i === index) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
};

const sentinel = (side, size) => {
  const node = document.createElement("div");
  node.setAttribute("aria-hidden", "true");
  node.style.cssText = `position:absolute;${side}:0;left:0;width:1px;height:${size};pointer-events:none`;
  document.body.append(node);
  return node;
};

const topMark = sentinel("top", TOP_ZONE);
const bottomMark = sentinel("bottom", "2px");

const edges = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    edge[target === topMark ? "top" : "bottom"] = isIntersecting;
  });
  render();
});

const zone = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) inZone.add(target);
      else inZone.delete(target);
    });
    render();
  },
  { rootMargin: "0px 0px -70% 0px" },
);

edges.observe(topMark);
edges.observe(bottomMark);
targets.forEach((target) => target && zone.observe(target));

links.forEach((link) => {
  if (link.getAttribute("href") !== "#") return;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0 });
    history.replaceState(null, "", location.pathname + location.search);
  });
});

render();