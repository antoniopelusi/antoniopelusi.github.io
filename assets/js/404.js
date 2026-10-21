const from = new URLSearchParams(window.location.search).get("from");
const missing = from || window.location.href;
document.querySelector("main p").textContent = missing;

const parent = new URL(missing, location.origin).pathname.replace(/\/[^/]*$/, "") || "/";
document.querySelector("main a").href = parent;
