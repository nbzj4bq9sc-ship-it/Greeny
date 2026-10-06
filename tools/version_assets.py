"""Update CSS/JS URLs in index.html when their contents change."""
import argparse
import hashlib
import re
from pathlib import Path


def version_html(document, root):
    def version(match):
        prefix, path, suffix = match.groups()
        digest = hashlib.sha256((root / path).read_bytes()).hexdigest()[:16]
        return f'{prefix}{path}?v={digest}{suffix}'

    return re.sub(r'((?:href|src)=")([\w./-]+\.(?:css|js))(?:\?[^\"]*)?(\")', version, document)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if asset versions need updating')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    index = root / 'index.html'
    document = index.read_text()
    updated = version_html(document, root)
    if args.check:
        if document != updated:
            parser.exit(1, 'Asset versions are stale. Run python3 tools/version_assets.py\n')
        print('Asset versions are up to date.')
    elif document != updated:
        index.write_text(updated)
        print('Updated asset versions in index.html.')


if __name__ == '__main__':
    main()
