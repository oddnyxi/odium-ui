import { THEMES } from '../constants.js';
import { Icons } from '../icons.js';

/** Window-wide right-click menu: buttons, toggles, checkboxes, radios and (nested) accordions. */
export function buildWindowMenu(ui, { adv }) {
  const wm = ui.createContextMenu();
  wm.addLabel('Quick actions');
  wm.addButton('Say Hello', () => ui.notify('Hello from Odium', 'success'), { icon: Icons.bell, hint: 'F2' });
  wm.addToggle('Advanced Mode', (v) => adv.setValue(v), () => adv.getValue(), { icon: Icons.sliders });
  wm.addCheckbox('Show notifications', (v) => console.log('notifications', v), true);
  wm.addSeparator();

  const theme = wm.addAccordion('Theme', { icon: Icons.palette, open: true });
  theme.addRadioGroup('', Object.keys(THEMES), (v) => ui.setTheme(v), { selected: 'Odium' });

  const more = wm.addAccordion('More');
  more.addCheckbox('Snap window to edges', (v) => { ui._snap = v; }, true);
  more.addToggle('Compact', () => {}, false);
  more.addAccordion('Nested accordion').addButton('Deep button', () => ui.notify('Nested!', 'info'));

  wm.addSeparator();
  wm.addButton('Hide window', () => ui.hide(), { danger: true, hint: 'Insert' });

  ui.setWindowContextMenu(wm);
  return wm;
}
