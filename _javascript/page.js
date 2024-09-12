import { basic, initSidebar, initTopbar } from './modules/layouts';
import { loadImg, imgPopup, initClipboard, getClapCounts } from './modules/plugins';

loadImg();
imgPopup();
initSidebar();
initTopbar();
initClipboard();
basic();
getClapCounts();
