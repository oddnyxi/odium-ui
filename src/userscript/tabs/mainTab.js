import { Icons } from '../../icons.js';

export function buildMainTab(ui) {
  const main = ui.addTab('Main', { group: 'General', icon: Icons.home });

  main.createSection('Actions');
  main.createButton('Say Hello', () => ui.notify('Hello from Odium', 'success'), { icon: Icons.bell })
    .setHotkey('F2')
    .setTooltip('Hotkey: F2');
  main.createButton('Async Action', () => new Promise((r) => setTimeout(r, 1500)))
    .setTooltip('Shows a spinner until done');
  main.createButton('Confirm Dialog', async () => {
    if (await ui.confirm('Proceed with the action?')) ui.notify('Confirmed', 'success');
  });

  main.createSection('Controls');
  const adv = main.createToggle('Advanced Mode', (on) => console.log('advanced', on));
  main.createSlider('Speed', (v) => console.log('speed', v), { min: 0, max: 100, value: 50, suffix: '%' })
    .showWhen(adv)
    .setTooltip('Only visible in Advanced Mode');
  main.createRangeSlider('Range', (r) => console.log('range', r), { min: 0, max: 100, low: 20, high: 70 });
  main.createToggle('Locked', () => {}, true)
    .setContextMenu([
      { text: 'Reset', action: () => ui.notify('Reset', 'info') },
      '-',
      { text: 'Delete', danger: true, action: () => ui.notify('Deleted', 'error') },
    ])
    .setTooltip('Right-click me');

  const pb = main.createProgressbar('Progress', 35);
  main.createButton('Add 10%', () => pb.setValue(pb.getValue() + 10))
    .ctx()
    .addButton('Reset to 0', () => pb.setValue(0))
    .setIcon(Icons.refresh);
  main.createSpinner('Working…');

  return { tab: main, adv };
}
