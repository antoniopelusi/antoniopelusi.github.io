const tool = (action) => document.querySelector(`nav[data-tools] [data-action="${action}"]`);

const outline = tool("outline");
const print = tool("print");
const frames = [...document.querySelectorAll("main > div > div")];

let overflowing = false;

const check = () => {
  const extras = frames.map((frame) => frame.scrollHeight - frame.clientHeight);

  frames.forEach((frame, i) => {
    frame.toggleAttribute("data-overflow", extras[i] > 0);
    if (extras[i] > 0) frame.style.setProperty("--overflow-h", `${extras[i]}px`);
    else frame.style.removeProperty("--overflow-h");
  });

  overflowing = extras.some((extra) => extra > 0);
  if (print) print.disabled = overflowing;
};

const observer = new ResizeObserver(check);
frames.forEach((frame) => {
  observer.observe(frame);
  [...frame.children].forEach((child) => observer.observe(child));
});

if (outline) {
  outline.disabled = false;
  outline.addEventListener("click", () => {
    const on = document.body.toggleAttribute("data-outline");
    outline.dataset.active = String(on);
  });
}

if (print) print.addEventListener("click", () => window.print());

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p" && overflowing) {
    event.preventDefault();
  }
});