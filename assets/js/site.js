const links = [...document.querySelectorAll("header nav a")];
const first = document.querySelector("main section");

const targetOf = (link) =>
  link.getAttribute("href") === "#" ? first : document.querySelector(link.hash);

const targets = links.map(targetOf);

const update = () => {
  const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let current = 0;
  targets.forEach((target, i) => {
    if (target && target.getBoundingClientRect().top <= window.innerHeight * 0.3) current = i;
  });
  if (window.scrollY <= 2) current = 0;
  if (bottom) current = links.length - 1;
  links.forEach((link, i) => {
    if (i === current) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
};

let queued = false;
const schedule = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    update();
  });
};

links.forEach((link) => {
  if (link.getAttribute("href") !== "#") return;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0 });
    history.replaceState(null, "", location.pathname + location.search);
  });
});

window.addEventListener("scroll", schedule, { passive: true });
window.addEventListener("resize", schedule);
update();