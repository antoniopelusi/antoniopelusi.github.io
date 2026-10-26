const tool = (action) => document.querySelector(`nav[data-tools] [data-action="${action}"]`);

const outline = tool("outline");
const print = tool("print");
const frames = [...document.querySelectorAll("main > div > div")];

const check = () => {
  let overflowing = false;
  frames.forEach((frame) => {
    const extra = frame.scrollHeight - frame.clientHeight;
    frame.toggleAttribute("data-overflow", extra > 0);
    if (extra > 0) {
      frame.style.setProperty("--overflow-h", `${extra}px`);
      overflowing = true;
    } else {
      frame.style.removeProperty("--overflow-h");
    }
  });
  if (print) print.disabled = overflowing;
  return overflowing;
};

if (outline) {
  outline.disabled = false;
  outline.addEventListener("click", () => {
    const on = document.body.toggleAttribute("data-outline");
    outline.dataset.active = String(on);
  });
}

if (print) print.addEventListener("click", () => window.print());

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p" && check()) {
    event.preventDefault();
  }
});

window.addEventListener("resize", check);
document.fonts.ready.then(check);
check();