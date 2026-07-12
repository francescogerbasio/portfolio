#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
HTML_FILES = list(DIST.glob("*.html"))

SRC_RE = re.compile(r'(?:src|href)="([^"]+)"')
IMG_RE = re.compile(r'<img\b[^>]*>', re.IGNORECASE)
ALT_RE = re.compile(r'\balt="([^"]*)"', re.IGNORECASE)


def is_external(url: str) -> bool:
    return url.startswith(("http://", "https://", "mailto:", "tel:", "#", "//", "javascript:"))


def resolve_target(html_dir: Path, path: str) -> Path:
    if path.startswith("/"):
        normalized = path.lstrip("/")
        direct = DIST / normalized
        if direct.exists():
            return direct
        parts = normalized.split("/", 1)
        if len(parts) == 2:
            rebased = DIST / parts[1]
            if rebased.exists():
                return rebased
            if path.endswith("/"):
                rebased_index = rebased / "index.html"
                if rebased_index.exists():
                    return rebased_index
        if path.endswith("/"):
            direct_index = direct / "index.html"
            if direct_index.exists():
                return direct_index
        return direct
    return (html_dir / path).resolve()


def check_links():
    errors = []
    for html in HTML_FILES:
        content = html.read_text(encoding="utf-8")
        html_dir = html.parent
        for match in SRC_RE.finditer(content):
            raw = match.group(1)
            path = raw.split("?", 1)[0].split("#", 1)[0]
            if not path or is_external(path):
                continue
            target = resolve_target(html_dir, path)
            try:
                if not target.exists():
                    errors.append(f"Missing file referenced in {html.name}: {raw}")
            except OSError:
                errors.append(f"Invalid path referenced in {html.name}: {raw}")
    return errors


def check_alt_text():
    warnings = []
    for html in DIST.glob("cs-*.html"):
        content = html.read_text(encoding="utf-8")
        for img in IMG_RE.findall(content):
            alt = ALT_RE.search(img)
            if not alt or not alt.group(1).strip():
                warnings.append(f"Empty/missing alt in {html.name}: {img[:90]}...")
    return warnings


def main() -> int:
    link_errors = check_links()
    alt_warnings = check_alt_text()

    if link_errors:
        print("Link check failed:")
        for err in link_errors:
            print(f"- {err}")
    else:
        print("Link check passed")

    if alt_warnings:
        print("\nAccessibility warnings:")
        for warn in alt_warnings:
            print(f"- {warn}")
    else:
        print("Accessibility image alt check passed")

    return 1 if link_errors else 0


if __name__ == "__main__":
    sys.exit(main())
