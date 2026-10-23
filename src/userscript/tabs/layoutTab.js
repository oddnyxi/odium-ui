import { Icons } from '../../icons.js';

export function buildLayoutTab(ui) {
  const layout = ui.addTab('Layout', { group: 'Data', icon: Icons.layout });

  const g1 = layout.createGroup('Collapsible Group');
  g1.createLabel('Content inside a group.');
  g1.createToggle('Nested Toggle', () => {});

  const [c1, c2] = layout.createColumns(2);
  c1.createButton('Left', () => ui.notify('Left'));
  c2.createButton('Right', () => ui.notify('Right'));

  layout.createDivider();
  const acc = layout.createAccordion();
  acc.addSection('Accordion One').createLabel('Only one section open at a time.');
  acc.addSection('Accordion Two').createLabel('Second section.');
  acc.addSection('Accordion Three').createLabel('Third section.');

  layout.createDivider();
  const st = layout.createSubTabs();
  st.addTab('Sub A').createLabel('Sub-tab A content');
  st.addTab('Sub B').createToggle('Sub-tab toggle', () => {});

  const dis = layout.createButton('Disabled Button', () => {}).setEnabled(false);
  layout.createButton('Enable It', () => dis.setEnabled(true));

  return layout;
}
