"""Create a self-contained review preview without changing the application files."""
import argparse
import html
import re
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('output', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
app = (root / 'index.html').read_text()
app = re.sub(r'<link rel="stylesheet" href="style\.css(?:\?[^\"]*)?">', lambda _: '<style>' + (root / 'style.css').read_text() + '</style>', app)
app = re.sub(r'\s*<script src="[^"]+" defer></script>', '', app)
app = app.replace('href="./"', 'href="#"')
scripts = '\n'.join('<script>' + (root / name).read_text() + '</script>' for name in ('plants.js', 'translations.js', 'score.js', 'search.js', 'script.js'))
app = app.replace('</body>', scripts + '\n</body>')
preview = '''<!doctype html>
<html lang="fr">
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Greeny · Aperçu interactif</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#111a15;color:#f2efe5;font:16px system-ui,sans-serif}
.toolbar{padding:16px;max-width:1100px;margin:auto}.toolbar p{font-size:14px;color:#bdc9be;line-height:1.5}
button{font:inherit;min-height:44px;padding:10px 18px;border:1px solid #46594c;border-radius:12px;background:#24322b;color:#f2efe5;cursor:pointer;margin:4px}
button[aria-pressed=true]{background:#c5dfb0;color:#19231f}button:focus-visible{outline:3px solid #efc3a3}
.viewport{box-sizing:content-box;margin:auto;width:calc(100% - 2px);max-width:1100px;border:1px solid #46594c;border-radius:18px;overflow:hidden}
iframe{display:block;border:0;width:100%;height:85vh;min-height:560px}.mobile{max-width:390px}.mobile.small{max-width:320px}
</style>
<div class="toolbar"><strong>Greeny · Aperçu de la nouvelle version</strong>
<div role="group" aria-label="Format de l’aperçu">
<button id="desktop" aria-pressed="true">Ordinateur</button>
<button id="mobile" aria-pressed="false">Mobile · 390 px</button>
<button id="small" aria-pressed="false">Petit mobile · 320 px</button></div>
<p>Choisis une plante, affronte la vérité, puis change de langue ou de format : tes réponses restent en place.
Le partage natif et la copie automatique dépendent des permissions du navigateur et peuvent nécessiter HTTPS. La copie manuelle reste disponible.</p></div>
<div id="viewport" class="viewport"><iframe title="Greeny : version interactive" srcdoc="APP_DOCUMENT"></iframe></div>
<script>
for(const id of ['desktop','mobile','small'])document.getElementById(id).addEventListener('click',()=>{
  document.getElementById('viewport').className='viewport'+(id==='desktop'?'':' mobile')+(id==='small'?' small':'');
  for(const other of ['desktop','mobile','small'])document.getElementById(other).setAttribute('aria-pressed',String(other===id));
});
</script></html>'''
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(preview.replace('APP_DOCUMENT', html.escape(app, quote=True)))
print(args.output)
