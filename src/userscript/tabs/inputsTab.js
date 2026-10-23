import { Icons } from '../../icons.js';

export function buildInputsTab(ui) {
  const inputs = ui.addTab('Inputs', { group: 'General', icon: Icons.edit });

  inputs.createSearchBox('Filter controls…');

  inputs.createSection('Text');
  inputs.createTextInput('Text Input', (v) => console.log(v), { placeholder: 'Type something…' });
  inputs.createNumberInput('Number', (v) => console.log(v), { min: 0, max: 10, step: 0.5, value: 2 });
  inputs.createRichTextbox('Notes', (h, t) => console.log(t), { placeholder: 'Rich text…' });

  inputs.createSection('Pickers');
  inputs.createColorPicker('Color', (v) => console.log(v), { value: '#ff3d4d' });
  inputs.createKeybind('Keybind', (k) => console.log(k), { value: 'F4', onPress: () => ui.notify('Keybind pressed') });

  inputs.createSection('Choices');
  inputs.createDropdown(['Option A', 'Option B', 'Option C'], (v) => ui.notify(`Picked ${v}`), { label: 'Dropdown', selected: 0 });
  inputs.createMultiSelect(['Alpha', 'Beta', 'Gamma', 'Delta'], (v) => console.log(v), { label: 'Multi Select', selected: [0] });
  inputs.createRadioGroup('Radio Group', ['Low', 'Medium', 'High'], (v) => console.log(v), { selected: 1 });
  inputs.createCheckboxGroup('Checkbox Group', ['One', 'Two', 'Three'], (v) => console.log(v), { selected: ['Two'] });

  inputs.createSection('Lists');
  const lb = inputs.createListBox(
    'List Box',
    ['Alpha', { text: 'Beta', icon: Icons.star, hint: 'icon' }, 'Gamma', 'Delta', 'Epsilon'],
    (v) => console.log('list', v),
    { height: 120, search: true, selected: 0, onActivate: (v) => ui.notify('Open ' + v, 'info') }
  );
  const rowMenu = lb.itemCtx(); // right-click a row
  rowMenu.addButton('Notify', () => ui.notify('Item: ' + rowMenu.target.value));
  rowMenu.addButton('Remove', () => lb.removeItem(rowMenu.target.index), { danger: true });
  inputs.createButton('Add Item', () => lb.addItem('Item ' + (lb.getItems().length + 1)));
  inputs.createListBox('Multi List Box', ['Red', 'Green', 'Blue', 'Cyan'], (v) => console.log('multi', v), {
    multi: true, height: 100, selected: [0, 2],
  });

  return inputs;
}
