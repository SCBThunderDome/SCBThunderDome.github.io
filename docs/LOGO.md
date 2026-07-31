# The mark

SCB Thunderdome's logo is the **State College Borough** mark with the
wordmark replaced. Everything else — the arch, the hill, the trees, the
buildings, the bands — is the original composition.

## Files

| File | What it is |
|---|---|
| `logo.svg` | The full mark. Vector, scales to any size. For white backgrounds. |
| `logo-reverse.svg` | Knocked-out lockup for **dark** backgrounds: dome + white wordmark, transparent behind, no bands. |
| `logo.png` | 996px raster of the above, for anything that can't take SVG. |
| `favicon.svg` | Browser icon: the arch only, rounded white tile. |
| `favicon-32.png` | Rendered from `favicon.svg`. |
| `apple-touch-icon.svg` | Home-screen icon: arch **plus** wordmark, square. |
| `apple-touch-icon.png` | Rendered from `apple-touch-icon.svg`. |
| `og-image.png`, `scbthunderdome/og-image.png` | Link-preview cards. Built by `tools/make-og-images.py`, which reads `logo-reverse.svg`. |
| `assets/source-borough-mark.png` | The borough logo as supplied, 332×232. |
| `assets/traced-artwork.svg` | That PNG auto-traced to vector. |

**All of the generated files come from `tools/make-logo-assets.py`.**
Don't hand-edit them — the next run overwrites your changes, and the
files will silently disagree with each other in the meantime.

```
python3 tools/make-logo-assets.py
python3 tools/make-og-images.py      # the cards read logo-reverse.svg
```

Needs `fonttools` and `cairosvg` (`pip install fonttools cairosvg`).

## Changing the words

```
python3 tools/make-logo-assets.py --text "SOME OTHER NAME"
```

The wordmark is stored as **outlines, not live text**. URW Gothic isn't
on visitors' machines, and shipping a webfont for fifteen characters
isn't worth the request. The cost is that the script is the only way to
change the words — you can't edit the SVG by hand.

### The type metrics, and why they matter

Measured off the original mark:

- cap height **17px**
- baseline at **y=192**
- the string tracked to span **x=20 → x=307**

That last one is the reason it still looks like the same logo. "STATE
COLLEGE BOROUGH" is 21 characters and filled that box; "SCB
THUNDERDOME" is 15. The script keeps the cap height and *loosens the
tracking* to fill the same box, rather than scaling the type up. Set
the type bigger instead and it stops reading as the borough mark.

A name long enough to overflow the box gets a warning and negative
tracking — that's your cue to shorten it, not to ignore it.

## Font

**URW Gothic Book** (`fonts-urw-base35`), the metric clone of ITC Avant
Garde Gothic. It was picked over Poppins Light by rendering both against
the original and comparing: URW Gothic matches on the straight-legged
**R** and the fully circular **C**, **O** and **G**. Poppins' R has a
curved leg and reads noticeably differently at this size.

Falls back to Poppins Light if URW Gothic isn't installed — usable, but
not a match. Install the real thing:

```
apt-get install fonts-urw-base35
```

## Re-tracing the artwork

Only necessary if the artwork itself has to change. The trace is checked
in because it isn't deterministic across vtracer versions, and the
committed one was eyeballed against the original.

```
pip install vtracer
```

Then: snap the source PNG to its five flat colours (white, black,
`#45b9ca` teal, `#259a3a` green, `#6c534c` brown), blank rows 165–203
(the wordmark band — live type replaces it), upscale 6× nearest, and:

```python
vtracer.convert_image_to_svg_py(
    src, dst, colormode='color', hierarchical='stacked', mode='spline',
    filter_speckle=8, color_precision=8, layer_difference=0,
    corner_threshold=60, length_threshold=3.5, splice_threshold=45,
    max_iterations=10, path_precision=3)
```

**The output paths are stacked and painted in order.** Each one paints
over those before it. Don't reorder them, and don't drop any — including
the background. Dropping the "unused" white background is exactly what
broke the first attempt: the render came out as a green field with the
artwork smeared across one corner.

`potrace`/`potracer` was tried first and is **not** usable here — the
Python port returns only the first curve of a multi-part trace, so a
three-shape test bitmap came back as one shape.

## Two things that will bite

**XML comments can't contain `--`.** The first version of `logo.svg` had
`----` divider lines in its header comment and wouldn't parse at all.
The comments in the generated files use `.` where a dash would read
naturally.

**`clip-path` + `transform` on the same element** is ambiguous about
which coordinate space the clip lives in, and renderers disagree. Both
the favicon and an early OG attempt came out mangled because of it. The
generated files use a **nested `<svg>`** instead, which sets the
destination box and the source `viewBox` in one step and clips
naturally.

## Light vs dark: two lockups

The full mark is drawn for a **white page**. Its white backing, its
black rules and its banded footer all assume one. Put it on the dark
site chrome and the backing renders as a white box around the arch.

So there are two:

- `logo.svg` — the full mark, for white backgrounds
- `logo-reverse.svg` — dome + **white** wordmark, transparent behind,
  no bands or rules. This is what the OG cards use.

The reversed one is built by clipping the artwork to the dome, which
also fixes the green-fringe problem below.

**An earlier version did this at card-build time** by flood-filling the
white backing away in Pillow. It worked, but only if the crop stopped
above the white ground band — that band runs edge to edge, so including
it connected the interior whites to the border and the fill ate the
windows. Doing the knockout once, in the logo pipeline, removed that
trap entirely.

## The green fringe

The traced artwork's **first path is a full-canvas green rectangle**.
vtracer emits it as the background layer, and it's only ever hidden by
the paths drawn on top. Anywhere the artwork doesn't quite reach a
viewport edge — a sub-pixel rounding gap, a different antialiasing
policy in another renderer — green shows through as a hairline.

That's what produced a green line along the top edge of the
apple-touch-icon.

The fix is not to nudge the crop. Both `favicon.svg` and
`logo-reverse.svg` **clip the artwork to the dome**:

```
M15.8,131 A149.7,131.4 0 0 1 315.2,131 Z
```

That's the dome fitted off the original: an ellipse centred at
(165.5, 131) with radii 149.7 × 131.4, upper half only. It lands exactly
on the rule ends at x=16 and x=315, which is a good sign the original
was drawn that way too. Clipped to it, the green background is
unreachable no matter how a renderer rounds.

## Why the two icons are different files

They have opposite constraints, so one file can't serve both.

**`favicon.svg` → 16 and 32px.** The words are unreadable at that size,
so it crops them and shows the arch alone. It's rounded, because
browsers don't mask favicons.

**`apple-touch-icon.svg` → 180px.** There's room for the name here, and
an icon with no name is hard to pick out of a home screen. It's
**square with no rounded corners** — iOS applies its own mask, and
rounding it here too would round it twice and leave the tile's corners
showing through as artefacts.

### The icon type is sized by solving, not guessing

The wordmark on the icon does *not* use the logo's metrics. The logo
sets 17px cap on a 300px span — about 6% — which at 180px is a 10px cap.
Too small. Splitting onto two lines buys roughly double the cap height
for the same width.

`fit_cap()` then solves for the cap height that fills the box at 4px
tracking, rather than taking a hand-picked size. The first attempt used
"34px, looks about right" and overflowed by 35px — the overflow warning
caught it, but only after the fact. Solving means a name change can't
reintroduce the problem.

The long line is sized to the box and the short line is set to match its
cap height and centred, so both always fit whatever the name is.

## Provenance

Derived from the State College Borough logo. It's the borough's artwork;
this is a fan dynasty using it as the basis for a league mark. If that's
ever a problem, `tools/make-logo-assets.py` and the two files in
`assets/` are the whole dependency — replace `traced-artwork.svg` with
different art and everything downstream regenerates.
