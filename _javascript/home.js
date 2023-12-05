import { basic, initSidebar, initTopbar } from './modules/layouts';
import { initLocaleDatetime, loadImg } from './modules/plugins';

window.addEventListener("load", (event) => {
    new cursoreffects.ghostCursor();
  });

basic();
initSidebar();
initTopbar();
initLocaleDatetime();
loadImg();
