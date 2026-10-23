import { Icons } from '../../icons.js';

const BANNER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="90">' +
      '<defs><linearGradient id="g"><stop offset="0" stop-color="#8c0b17"/><stop offset="1" stop-color="#ff3d4d"/></linearGradient></defs>' +
      '<rect width="400" height="90" fill="url(#g)"/></svg>'
  );

export function buildDisplayTab(ui) {
  const data = ui.addTab('Display', { group: 'Data', icon: Icons.chart });

  data.createSection('Status');
  const fps = data.createStat('FPS', '60');
  data.createBadge('Online', 'success');
  data.createIcon(Icons.star, 'Icon Row', { sub: 'Glyph tile with subtitle' });
  data.createImage(BANNER, { height: 60 });

  data.createSection('Charts');
  const line = data.createChart('Line Chart', { points: 30, min: 0, max: 100, suffix: '%' });
  const bars = data.createChart('Bar Chart', { type: 'bar', points: 20, min: 0, max: 100, height: 50 });

  data.createSection('Console');
  const log = data.createLog('Log');
  log.log('Ready');
  log.log('Something happened', 'warn');
  log.log('All good', 'success');
  data.createTable(
    ['Name', 'Value', 'State'],
    [['alpha', '12', 'ok'], ['beta', '7', 'warn'], ['gamma', '31', 'ok']],
    { onRowClick: (r) => log.log('Row: ' + r.join(', ')) }
  );
  data.createCodeBlock('const ui = new UI();\nui.createWindow();', { title: 'Snippet' });

  // fake live data
  setInterval(() => {
    const v = Math.round(40 + Math.random() * 55);
    line.push(v);
    bars.push(v);
    fps.setValue(v);
  }, 800);

  return data;
}
