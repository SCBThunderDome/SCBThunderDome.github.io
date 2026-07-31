#!/usr/bin/env python3
"""
============================================================
MAKE-LOGO-ASSETS - rebuild the mark and everything cut from it
------------------------------------------------------------
The SCB Thunderdome mark is the State College Borough logo with the
wordmark replaced. This script owns every derived file, so none of
them drift apart:

    logo.svg              the full mark, for white backgrounds
    logo-reverse.svg      dome + white wordmark, for dark ones
    favicon.svg           icon form, arch only, white tile
    favicon-32.png        rendered from favicon.svg
    apple-touch-icon.svg  home screen icon, arch + wordmark, square
    apple-touch-icon.png  rendered from apple-touch-icon.svg
    logo.png              raster of logo.svg, for anything that
                          cannot take an SVG

    python3 tools/make-logo-assets.py
    python3 tools/make-logo-assets.py --text "SCB THUNDERDOME"

WHERE THE ARTWORK COMES FROM
    assets/source-borough-mark.png   the borough logo, 332x232
    assets/traced-artwork.svg        that PNG auto traced to vector

The trace is checked in rather than re-run, because tracing is
non-deterministic across vtracer versions and the current output was
eyeballed against the original. Only redo it if the artwork itself
must change - the recipe is in docs/LOGO.md.

WHY THE WORDMARK IS OUTLINES
    URW Gothic is not on visitors' machines, and a webfont for
    fifteen characters is not worth the request. The glyphs are
    converted to paths here, so the file renders identically
    everywhere and this script is the only way to change the words.

TYPE METRICS, MEASURED OFF THE ORIGINAL
    cap height 17px, baseline y=192, letters tracked so the string
    spans x=20 to x=307 - exactly the box "STATE COLLEGE BOROUGH"
    occupied. Fewer characters therefore means looser tracking, not
    bigger type, which is what keeps it looking like the same logo.

Requires: fonttools, cairosvg.  pip install fonttools cairosvg
============================================================
"""

import argparse
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
TRACED = os.path.join(ROOT, "assets", "traced-artwork.svg")

FONT = "/usr/share/fonts/opentype/urw-base35/URWGothic-Book.otf"
FONT_FALLBACKS = [
    FONT,
    "/usr/share/fonts/opentype/urw-base35/URWGothic-Book.otf",
    "/usr/share/fonts/truetype/google-fonts/Poppins-Light.ttf",
]

# Measured off assets/source-borough-mark.png. See the header.
LEFT, RIGHT, BASELINE, CAP_H = 20, 307, 192, 17


def find_font():
    for p in FONT_FALLBACKS:
        if os.path.exists(p):
            return p
    sys.exit(
        "No suitable font found. URW Gothic is the match for this mark;\n"
        "install it with:  apt-get install fonts-urw-base35"
    )


def artwork_paths():
    """The traced borough artwork, as a list of <path> elements.

    Order matters and nothing may be dropped: vtracer emits STACKED
    paths, each painting over the ones before it. Removing even the
    background changes what shows through everywhere else.
    """
    if not os.path.exists(TRACED):
        sys.exit(f"Missing {TRACED} - see docs/LOGO.md")
    return re.findall(r"<path[^>]*/>", open(TRACED).read())


def wordmark(text, baseline=None, left=None, right=None, cap_h=None):
    """The text as SVG path data, tracked to span left..right.

    Defaults reproduce the logo's own metrics. The apple touch icon
    overrides them: it needs type far larger relative to the artwork
    than the logo uses, or it is unreadable on a home screen.
    """
    baseline = BASELINE if baseline is None else baseline
    left = LEFT if left is None else left
    right = RIGHT if right is None else right
    cap_h = CAP_H if cap_h is None else cap_h
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.misc.transform import Transform

    f = TTFont(find_font())
    gs = f.getGlyphSet()
    upm = f["head"].unitsPerEm
    cmap = f.getBestCmap()
    cap = getattr(f["OS/2"], "sCapHeight", 700)
    scale = cap_h / (cap / upm) / upm

    missing = [c for c in text if ord(c) not in cmap]
    if missing:
        sys.exit(f"Font has no glyph for: {missing!r}")

    widths = [gs[cmap[ord(c)]].width * scale for c in text]
    if len(text) < 2:
        sys.exit("Need at least two characters to track.")
    track = ((right - left) - sum(widths)) / (len(text) - 1)
    if track < 0:
        print(
            f"  WARNING: {text!r} is too wide for the box at cap height "
            f"{cap_h}px; letters will overlap (tracking {track:.2f})."
        )

    out, x = [], left
    for c in text:
        pen = SVGPathPen(gs)
        # flip y (font space is y-up, SVG is y-down) and set the baseline
        gs[cmap[ord(c)]].draw(
            TransformPen(pen, Transform(scale, 0, 0, -scale, x, baseline))
        )
        d = pen.getCommands()
        if d:
            out.append(d)
        x += gs[cmap[ord(c)]].width * scale + track
    print(f"  wordmark {text!r}  tracking {track:.2f}px")
    return " ".join(out)


def _advance_per_cap(text):
    """Natural width of `text` (no tracking) at cap height 1."""
    from fontTools.ttLib import TTFont
    fnt = TTFont(find_font())
    gs = fnt.getGlyphSet()
    upm = fnt["head"].unitsPerEm
    cmap = fnt.getBestCmap()
    cap = getattr(fnt["OS/2"], "sCapHeight", 700)
    unit = 1 / (cap / upm) / upm
    return sum(gs[cmap[ord(c)]].width * unit for c in text)


def fit_cap(text, span, track=4.0):
    """Cap height that makes `text` fill `span` at the given tracking.

    Solved rather than guessed. Hand-picking a size means every name
    change is a new round of trial and error, and the first attempt at
    this icon overflowed by 35px because 34px "looked about right".
    """
    return (span - (len(text) - 1) * track) / _advance_per_cap(text)


# The dome, fitted to the original artwork: an ellipse centred at
# (165.5, 131) with radii 149.7 x 131.4, upper half only. Clipping to
# this is what keeps the traced GREEN BACKGROUND PATH from showing.
# vtracer emits that path first, full canvas, and every later path
# paints over it - so anywhere the artwork does not reach, green does.
# That is the hairline that appeared along the icon's top edge.
DOME = "M15.8,131 A149.7,131.4 0 0 1 315.2,131 Z"


def write_logo_reverse(text):
    """Knocked-out lockup for dark backgrounds: dome + white wordmark.

    No white backing and no bands, because both are drawn for a white
    page and read as debris on a dark card. The OG cards use this.
    """
    art = "\n".join(artwork_paths())
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="16 -4 300 190" width="300" height="190" role="img" aria-label="{text.title()}">
<title>{text.title()}</title>
<!--
  GENERATED by tools/make-logo-assets.py . do not hand edit.

  Reversed lockup, for dark backgrounds only. Transparent behind the
  dome, wordmark in white. The bands and rules from the full mark are
  deliberately absent: they are drawn for a white page.

  The artwork is clipped to the dome so the traced green background
  path cannot show at the edges.
-->
<defs><clipPath id="dome"><path d="{DOME}"/></clipPath></defs>
<g clip-path="url(#dome)">
  <g transform="scale(0.1666667)">
{art}
  </g>
</g>
<path fill="#ffffff" d="{wordmark(text, baseline=170)}"/>
</svg>
"""
    open(os.path.join(ROOT, "logo-reverse.svg"), "w").write(svg)
    print("  logo-reverse.svg")


def write_logo(text):
    art = "\n".join(artwork_paths())
    # No "--" anywhere in the comment: XML forbids it inside comments.
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 332 232" width="332" height="232" role="img" aria-label="{text.title()}">
<title>{text.title()}</title>
<!--
  {text} . primary mark

  GENERATED by tools/make-logo-assets.py . do not hand edit.

  The State College Borough logo with the wordmark replaced. The
  artwork is auto traced from assets/source-borough-mark.png, so
  everything except the words is the original composition.

  The traced paths are STACKED and painted in order. Do not reorder
  or drop any of them.

  The wordmark is OUTLINES, not live text, so it renders identically
  without URW Gothic installed. Change the words by re running this
  script with .text, never by editing here.
-->
<g transform="scale(0.1666667)">
{art}
</g>
<path fill="#111111" d="{wordmark(text)}"/>
</svg>
"""
    open(os.path.join(ROOT, "logo.svg"), "w").write(svg)
    print("  logo.svg")


def write_apple_icon(text):
    """Home screen icon: arch plus the wordmark, set BIG.

    Deliberately not the same file as favicon.svg. The two have
    opposite constraints: at 16 and 32px the words are unreadable mud,
    so the favicon crops them; at 180px there is room, and an icon with
    no name on it is hard to pick out of a home screen.

    SQUARE, no rounded corners. iOS applies its own mask to
    apple-touch-icon, so rounding it here would round it twice and
    leave the tile's own corners showing through as artefacts.

    The type is set to its own metrics rather than the logo's. The
    logo's wordmark is 17px cap on a 300px span, about 6 percent; at
    180px that is a 10px cap, which is too small. Splitting onto two
    lines buys roughly double the cap height for the same width.
    """
    art = "\n".join(artwork_paths())
    head, _, tail = text.partition(" ")
    if not tail:                       # single word: one line, full width
        head, tail = "", text

    # Size the LONG line to the box, then set the short one to the same
    # cap height and centre it. Both lines therefore always fit, whatever
    # the name is.
    BOX_L, BOX_R = 26, 334
    cap = fit_cap(tail, BOX_R - BOX_L, track=4.0)
    lines = []
    if head:
        w = _advance_per_cap(head) * cap + (len(head) - 1) * 4.0
        mid = (BOX_L + BOX_R) / 2
        lines.append(wordmark(head, baseline=286,
                              left=mid - w / 2, right=mid + w / 2, cap_h=cap))
    lines.append(wordmark(tail, baseline=338,
                          left=BOX_L, right=BOX_R, cap_h=cap))
    print(f"  icon cap height {cap:.1f}px")
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="360" height="360" role="img" aria-label="{text.title()}">
<title>{text.title()}</title>
<!--
  GENERATED by tools/make-logo-assets.py . do not hand edit.

  Home screen icon: arch plus wordmark. Separate from favicon.svg on
  purpose, because the words are unreadable at 16 and 32px and the
  favicon crops them.

  SQUARE by design. iOS masks apple touch icons itself; rounding here
  too would round it twice.

  The artwork is clipped to the dome so the traced green background
  path cannot show along an edge.
-->
<rect width="360" height="360" fill="#ffffff"/>
<svg x="16" y="26" width="328" height="186" viewBox="14 -2 304 137" preserveAspectRatio="xMidYMid meet">
  <defs><clipPath id="adome"><path d="{DOME}"/></clipPath></defs>
  <g clip-path="url(#adome)">
    <g transform="scale(0.1666667)">
{art}
    </g>
  </g>
</svg>
{chr(10).join(f'<path fill="#111111" d="{d}"/>' for d in lines)}
</svg>
"""
    open(os.path.join(ROOT, "apple-touch-icon.svg"), "w").write(svg)
    print("  apple-touch-icon.svg")


def write_favicon():
    art = "\n".join(artwork_paths())
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="360" height="360" role="img" aria-label="SCB Thunderdome">
<title>SCB Thunderdome</title>
<!--
  GENERATED by tools/make-logo-assets.py . do not hand edit.

  Icon form: the arch only. The words are unreadable below about
  100px, so cropping them beats shrinking them into mud.

  The artwork is CLIPPED TO THE DOME. Without that, the traced green
  background path shows as a hairline along the tile edges, because
  vtracer emits it first at full canvas size and it is only ever
  hidden by the paths drawn over it.

  A nested svg places and crops in one step. The clip lives on a g
  with no transform of its own, since clip path combined with
  transform on the same element is ambiguous about which coordinate
  space the clip is in and renderers disagree.
-->
<rect width="360" height="360" rx="68" fill="#ffffff"/>
<svg x="18" y="88" width="324" height="184" viewBox="14 -2 304 137" preserveAspectRatio="xMidYMid meet">
  <defs><clipPath id="fdome"><path d="{DOME}"/></clipPath></defs>
  <g clip-path="url(#fdome)">
    <g transform="scale(0.1666667)">
{art}
    </g>
  </g>
</svg>
</svg>
"""
    open(os.path.join(ROOT, "favicon.svg"), "w").write(svg)
    print("  favicon.svg")


def rasterise():
    try:
        import cairosvg
    except ImportError:
        print("  (cairosvg not installed - skipped the PNGs)")
        return
    jobs = [
        ("favicon.svg", "favicon-32.png", 32, 32),
        ("apple-touch-icon.svg", "apple-touch-icon.png", 180, 180),
        ("logo.svg", "logo.png", 996, None),
    ]
    for src, dst, w, h in jobs:
        kw = {"output_width": w}
        if h:
            kw["output_height"] = h
        cairosvg.svg2png(url=os.path.join(ROOT, src),
                         write_to=os.path.join(ROOT, dst), **kw)
        size = os.path.getsize(os.path.join(ROOT, dst)) / 1024
        print(f"  {dst:22} {size:6.1f} KB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", default="SCB THUNDERDOME",
                    help="wordmark, in caps")
    args = ap.parse_args()
    write_logo(args.text.upper())
    write_logo_reverse(args.text.upper())
    write_favicon()
    write_apple_icon(args.text.upper())
    rasterise()
    print("\n  Done. The OG cards read logo-reverse.svg, so re-run"
          " tools/make-og-images.py too.")


if __name__ == "__main__":
    main()
