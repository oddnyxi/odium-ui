# Regenerates every icon size from assets/icon.png (needs Pillow):
#   assets/icon-48.png   userscript @icon (embedded by scripts/finalize.js)
#   src/assets/logo.js   default window logo (data URI)
#   docs/images/icon.png README logo
import base64, io
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
icon = Image.open(root / 'assets/icon.png').convert('RGBA')
sized = lambda n: icon.resize((n, n), Image.LANCZOS)

sized(48).save(root / 'assets/icon-48.png', optimize=True)
sized(256).save(root / 'docs/images/icon.png', optimize=True)
buf = io.BytesIO()
sized(64).save(buf, 'PNG', optimize=True)
uri = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
(root / 'src/assets/logo.js').write_text(
    '// Default window logo, generated from assets/icon.png by scripts/make-icons.py.\n'
    f"export const DEFAULT_LOGO = '{uri}';\n")
print('icons updated')
