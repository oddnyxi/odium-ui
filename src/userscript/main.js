// Userscript entry. This is the file you edit: build your own tabs/controls here.
// `npm run build` bundles it (plus the whole UI library) into dist/odium-ui.user.js.
import { UI } from '../index.js';
import { buildMainTab } from './tabs/mainTab.js';
import { buildInputsTab } from './tabs/inputsTab.js';
import { buildDisplayTab } from './tabs/displayTab.js';
import { buildLayoutTab } from './tabs/layoutTab.js';
import { buildWindowMenu } from './windowMenu.js';

const ui = new UI();
window.__odium = ui; // handy in the console (and used by scripts/screenshots.js)
ui.createWindow('ODIUM', { subtitle: 'template', width: 620, height: 460 });

const { adv } = buildMainTab(ui);
buildInputsTab(ui);
buildDisplayTab(ui);
buildLayoutTab(ui);
buildWindowMenu(ui, { adv });
ui.addSettingsTab('Settings', { group: 'System' });
