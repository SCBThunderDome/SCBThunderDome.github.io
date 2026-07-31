# SCB Thunderdome — site scoping

Standing up a dynasty site for **SCBThunderDome.github.io**, structured
like `ncaalegends.github.io` but a wholly separate repo, separate
users, and its own set of APIs/Workers. Nothing here shares state,
credentials, or deploy surface with NCAA Legends.

Decisions locked in with Josh, 2026-07-30:

| Question | Answer |
|---|---|
| Dynasties | **One**, with the multi-league scaffold left intact underneath |
| Features at launch | Core site + Discord automation + web admin page/Worker + Twitch live badges |
| Code relationship | **Copy once, then diverge.** No fork, no shared remote |
| Branding | Same layout skin, new name/palette — **blue + green**, from the State College Borough mark |

---

## 1. What's being copied

The NCAA Legends repo is ~10,000 lines of hand-written JS across four
layers. All four come over.

**Shared engine (repo root) — copied verbatim, then renamed**

| File | Lines | Notes |
|---|---|---|
| `script.js` | 2,083 | All page rendering. League-agnostic; reads `<body data-league>` |
| `week-core.js` | 1,453 | Pure matchup/score logic. Shared by browser + Node tools |
| `style.css` | 2,232 | Layout + per-league accent blocks. **Palette edits land here** |
| `people.js` | ~120 | `SITE_LEAGUES`, Twitch endpoint, cross-league identity |

**Per-league data (one folder)**

`index.html`, `league-data.js`, `schedule-data.js`, `top25-data.js`,
`og-image.png`. This is where the roster, season state, schedules and
poll live — all four files are new content, not copies.

**Commissioner tooling (`tools/`)** — 14 scripts: `advance.js`,
`scores.js`, `apply.js`, `nudge.js`, `top25.js`, `h2h.js`,
`make-codes.js`, `serve.js`, `lib/league.js`, plus the `.cmd`
double-click wrappers and `make-og-images.py`.

**Serverless + CI**

- `worker/live-status.js` — Twitch "who's streaming" Worker
- `worker/admin-api.js` — access-code gate + GitHub dispatch
- `admin/` — the browser page commissioners use
- `.github/workflows/league-update.yml` — applies a web submission
- `.github/workflows/daily-nudge.yml` — morning Discord reminder

---

## 2. Structure for a single dynasty

**Recommendation: keep the league in its own folder; make the root a
redirect, not a picker.**

```
/                 index.html  ->  redirects to /scbthunderdome/
/scbthunderdome/  the league page + its four data files
/admin/           commissioner page
/tools/           local scripts
/worker/          two Worker sources
script.js  week-core.js  style.css  people.js
```

Why not flatten the league up to the root: `script.js`, `week-core.js`
and every league `index.html` reference shared assets as `../style.css`,
`../week-core.js`, `../admin/`. Flattening means editing those paths in
four files and the league switcher, for no user-visible gain — the
redirect is instant and the URL bar reads `/dynasty/` either way.

The upside is that a second Thunderdome league later is a folder plus
one line in `SITE_LEAGUES` — exactly the property NCAA Legends was
built around. With one league, `renderLeagueSwitcher()` renders nothing
and the header just looks clean.

**Slug: `scbthunderdome`** — confirmed. Used as the folder name, the URL
segment, the `<body data-league>` value, the `SITE_LEAGUES` `dir`, the
`LEAGUES` key in `tools/lib/league.js`, and the league value inside every
access code.

---

## 3. Everything that must be created new

Nothing below is copyable — each is a fresh credential or account tied
to the Thunderdome repo.

Nothing below is copyable — each is a fresh credential or account tied
to the Thunderdome repo. **Status as of 2026-07-31.**

| # | Thing | Where | Est. | Status |
|---|---|---|---|---|
| 1 | GitHub Pages enabled on the repo | GitHub settings | 2 min | **Done** — live |
| 2 | Twitch application (client ID + secret) | dev.twitch.tv/console | 5 min | **Done** |
| 3 | Worker `scb-thunderdome-live` | Cloudflare | 5 min | **Done** |
| 9 | Coach Discord IDs for the new roster | Discord, Developer Mode | ~15 min | **Done** — 13/13 |
| 4 | Fine-grained GitHub PAT, Contents: R/W, **this repo only** | GitHub | 5 min | **Done** |
| 5 | Worker `scb-thunderdome-admin` | Cloudflare | 5 min | **Done** — endpoint wired |
| 6 | Access codes for commissioners | `tools/make-codes.cmd` | 5 min | **Done** — 3 issued |
| 7 | Discord webhook for the Thunderdome channel | Discord server settings | 3 min | **Done** — in `tools/config.json` |
| 8 | `DISCORD_CONFIG` repo secret | GitHub secrets | 3 min | **To do** — last item |

Rows are ordered done-first; the original numbering is kept so earlier
references still resolve. **One item left**: paste the contents of
`tools/config.json` into a repo secret named `DISCORD_CONFIG`.

Until that secret exists the **daily-nudge workflow fails every
morning** — it `exit 1`s rather than skipping quietly, so it sends a
red-run email at 14:00 UTC. Harmless but noisy, and it stops the
moment the secret is set.

The web admin path is confirmed working end to end: commit
`617a6a0 "SCB Thunderdome: Week 1 scores (via Ryan)"` was written by
the Actions runner from a submission on the admin page — page →
Worker → `repository_dispatch` → `apply.js` → commit → Pages.

`roleMention` is set to `@everyone`, so each advance opens with a
server-wide ping above the per-coach ones.

Access codes were issued to RekenCrew, Ryan and Elton, all scoped to
`scbthunderdome`. Add more by re-running `make-codes.cmd` and pasting
the current `ACCESS_CODES` value when prompted; existing codes carry
over unchanged.

`ALLOWED_ORIGINS` on both Workers must read
`https://scbthunderdome.github.io` — copying the NCAA Legends value
would leave the Workers callable from the wrong origin and, worse,
silently break CORS on the right one. **This is the one setting that
can't be verified from outside**: if live badges never appear on the
deployed site but the Worker URL works when opened directly in a
browser, this is the cause.

**Access codes are league-scoped.** `make-codes.js`'s league menu, the
`SCORE_LEAGUES` / `ADVANCE_LEAGUES` lists in `apply.js`,
`admin/admin.js` and `worker/admin-api.js`, and the `LEAGUES` table in
`tools/lib/league.js` were all rewritten to the single
`scbthunderdome` slug during phase A.

---

## 4. Find-and-replace inventory

Every place the NCAA Legends identity is baked in:

- **`ncaalegends.github.io`** — `og:url`, `og:image`, `twitter:image`,
  `canonical` in each `index.html` (4 spots per file); `SITE_ROOT` in
  `tools/lib/league.js`; the instructions string in `make-codes.js`
- **League slugs** `main` / `3star` / `1star` — 8 files listed above
- **`SITE_LEAGUES`** in `people.js` — one entry, new accent
- **`LEAGUE_INFO.name`** in the league data file
- **Title / hero / footer copy** — "NCAA LEGENDS · THREE ONLINE
  DYNASTIES" and the picker hero
- **Worker names** in both setup docs and in the two endpoint constants
  (`LIVE_STATUS.endpoint` in `people.js`, `ADMIN_API` in `admin/admin.js`)
- **`gateOnTop25`** — decide whether an advance should be blocked until
  that week's poll is transcribed (main does; the others don't)

---

## 5. Branding

Source mark: State College Borough — arched teal sky, green hills,
white borough buildings, black linework.

Palette to derive (exact hex to be sampled from the file Josh sends):

- **Primary blue** — hero stripe, league accent, link/active states
- **Primary green** — secondary accent, win indicators, section rules
- Existing near-black background (`#060b16`) stays; it carries the
  layout and both accents read well on it

Assets to regenerate: `favicon.svg`, `favicon-32.png`,
`apple-touch-icon.png`, root `og-image.png`, league `og-image.png`.
`tools/make-og-images.py` generates the OG cards once the palette is
set, so these are one script run, not five design tasks.

**Needed from Josh:** the logo file itself (PNG/SVG, ideally
transparent), and confirmation of whether the borough mark is used
as-is or as color inspiration only.

---

## 6. Content Josh still owes

**Received and done:**

1. ~~User list~~ — 13 coaches, in `league-data.js`. See §6a.
2. ~~Schedule screenshots~~ — all 26, transcribed and cross-checked.
3. ~~Season state~~ — Week 1, one Week 0 result recorded.
4. ~~Team logos~~ — every team is FBS with an ESPN id, so no local logo
   files are needed at all. (The NCAA Legends 1-star league needed 8;
   this league needs none.)

**Still outstanding:**

5. **The logo file** — for the real favicon, apple-touch-icon and OG
   cards. Generated placeholders in the borough colours are in place,
   so nothing is broken meanwhile.
6. **Twitch URL for Richard** — still blank; a coach with no link is
   never asked about by the live Worker, so this blocks nothing.
   ~~Traven~~ landed 2026-07-31 (`travennn95`), replacing the earlier
   copy-paste that duplicated Tristan's channel. 12 of 13 now.
7. **espnId verification** — 7 of 13 ids are my best guess rather than
   lifted from verified NCAA Legends entries. Open `/logo-check.html`
   and eyeball them; a wrong id silently renders another school's
   logo. Marked `// espnId UNVERIFIED` in `league-data.js`.
8. **An advance deadline** for `SEASON.nextAdvance`, whenever there is
   one. Blank hides the countdown rather than showing a stale date.
9. **Top 25** — optional; the tab shows a clean empty state until a
   poll is transcribed with `node tools/top25.js`.

---

## 6a. Roster as received

13 coaches, from Josh's sign-up sheet (2026-07-30). `espnId` and `color`
marked **reuse** are lifted from verified NCAA Legends entries;
**unverified** ones are my best guess and must be eyeballed in
`logo-check.html` before launch — a wrong id silently renders another
school's logo.

| Coach | Team | espnId | Color | Source |
|---|---|---|---|---|
| Cros | Louisville | 97 | `#CB3B47` | reuse |
| Danny | Tulane | 2655 | — | unverified |
| Trey | Oklahoma State | 197 | — | unverified |
| Andrew | SMU | 2567 | `#5A6FD1` | reuse |
| Craig | Virginia | 258 | — | unverified |
| Elton | Virginia Tech | 259 | `#E8703F` | reuse |
| Jake | Kentucky | 96 | — | unverified |
| John | ASU — **ambiguous** | 9? | — | see below |
| Richard | Houston | 248 | — | unverified |
| Toure | Colorado | 38 | `#CFB87C` | reuse |
| Traven | Missouri | 142 | — | unverified |
| Tristan | Wisconsin | 275 | `#D63B45` | reuse |
| Zach | South Carolina | 2579 | `#A6192E` | reuse |

**All three open questions are now resolved:**

1. ~~**"ASU" is ambiguous**~~ — **Arizona State**, confirmed by Josh and
   corroborated by the schedule screenshot, which spells it in full.
2. ~~**Traven and Tristan share a Twitch URL**~~ — that channel was
   Tristan's. Traven's real one (`travennn95`) landed 2026-07-31.
   Holding his blank in the meantime was the right call: the shared
   URL would have lit both coaches' live badges whenever one streamed.
3. **Richard has no Twitch URL** — also blank, also fine. A coach with
   no link is simply never asked about by the live Worker.

**Conferences** were added to the sheet by Josh: ACC / SEC / XII / B1G
/ AAC. Unlike the NCAA Legends leagues, this is stock real-world
alignment, so nothing custom to preserve.

**The Discord IDs in that sheet are secrets.** They go in
`tools/config.json` (gitignored) and the `DISCORD_CONFIG` repo secret —
**never** in `league-data.js`, which GitHub Pages serves publicly.
That's the same split NCAA Legends uses and the reason `people.js`
carries no IDs.

## 6b. Schedule screenshots as received

26 files — 13 teams × 2 (weeks 0–8 and weeks 8–Conf Champ), overlap at
week 8 deduped by hand. Houston's pair arrived last; nothing is
missing.

**All 12 head-to-head games cross-check.** Each appears on two
coaches' schedules and the two sides agree on week and on home/away in
every case. `auditScheduleSides()` — the engine's own checker, the same
code the site runs — reports clean.

**Two teams have no head-to-head games at all: Wisconsin and Tulane.**
Both play a full CPU slate. That is what the screenshots show, not a
transcription gap, and it's flagged in the header of
`schedule-data.js`. Worth a look in case the schedule was meant to
include them.

**Only one game has been played:** Virginia 33, NC State 14 in Week 0,
against a CPU opponent. Everything else is unplayed, so the site sits
at Week 1 with empty Rankings and Top 25 tabs — both render clean
empty states.

## 7. Proposed sequence

| Phase | Work | Gate | Status |
|---|---|---|---|
| **A. Skeleton** | Copy engine + tooling, rewrite slugs, redirect root, palette swap | Site loads locally | **Done** |
| **B. Content** | Roster into `league-data.js`; all 26 screenshots transcribed; H2H cross-checked | Needs items 1–3 above | **Done** |
| **C. Publish** | Pages on, OG images generated, meta tags/canonical correct | Live at scbthunderdome.github.io | **Assets done; Pages not enabled** |
| **D. Twitch** | New Twitch app + live Worker, endpoint wired | Needs items 2–3 in §3 | **Done** — `scb-thunderdome-live.westfall-105.workers.dev` |
| **E. Admin** | PAT, admin Worker, access codes, both workflows | Needs items 4–6 | Code ready, credentials pending |
| **F. Discord** | Webhook, coach IDs, `DISCORD_CONFIG`, dry-run advance + nudge | Needs items 7–9 | Coach IDs in; webhook pending |

A–C is a working, publishable site on its own. D, E and F are each
independently skippable and independently turn-off-able (blank the
endpoint / blank the webhook), so none of them blocks launch.

Rough effort: **A** is a few hours of mechanical work. **B** is
dominated by schedule transcription — roughly 30–45 min per 8 teams
from clean screenshots. **C–F** are the ~45 minutes of Josh-side
account setup in §3 plus wiring and a verification pass on each.

---

## 7a. Build log — what actually landed

**Structure.** Root `index.html` is a redirect (meta refresh + a
`location.replace`, so Back doesn't bounce). League lives at
`/scbthunderdome/`. `renderLeagueSwitch()` sees one entry in
`SITE_LEAGUES` and degrades to a plain badge on its own — no code
change was needed for that.

**Slug rewrite** touched `tools/lib/league.js`, `apply.js`,
`admin/admin.js`, `worker/admin-api.js`, `make-codes.js`, `people.js`,
`serve.js`, `logo-check.html`, both `.cmd` league pickers (removed —
nothing to pick), the `daily-nudge.yml` loop, and every tool's default
`resolveLeague()`.

**Both Worker endpoints are deliberately blank** (`LIVE_STATUS.endpoint`
in `people.js`, `ADMIN_API` in `admin/admin.js`). The pages say they
aren't connected and send nothing. They must never be pointed at the
NCAA Legends Workers — different repo, different access codes.

**Branding.** `--gold` and friends in `:root` are now borough blue
`#3aa9c9`, with `--borough-green #3fa34d` added as a decorative
secondary. Green is deliberately NOT wired into `--win` (`#3ecf7e`):
that's a status colour, and merging them would make a schedule row
read as a result it isn't. Favicon, apple-touch-icon and both OG cards
are generated placeholders in the borough colours — replace once the
real logo arrives.

**Verification.** `week-core.js` is the same module the browser and the
tools share, so it was exercised directly in Node rather than
rendering the page headlessly:

- `auditScheduleSides()` — clean; no home/away or score disagreement
- All 16 weeks account for exactly 13 teams (`h2h×2 + cpu + notes`)
- `missing = 0` for every week — no team lacks an entry
- `advance.js --dry-run` builds the real Discord message, resolves all
  13 coach IDs to pings, and correctly reports 0 H2H / 12 CPU / 1 bye
  for Week 1
- `make-codes.js` issues a valid `scbthunderdome`-scoped code
- `apply.js` (the web path) applied a test score to both sides of an
  H2H game correctly — **that test score was then reverted**; the only
  score in the file is the real Virginia 33–14

## 8. Known risks

- **Divergence.** Copy-once means a `script.js` bugfix here doesn't
  reach NCAA Legends, and vice versa. Accepted deliberately; worth a
  note in each repo's README pointing at the other.
- **Schedule transcription is the error-prone step.** Every user-vs-user
  game appears on two teams' schedules and both must agree on home/away
  and score. The NCAA Legends files cross-checked these by hand — same
  discipline applies, and a verification pass belongs in Phase B.
- **PAT expiry.** When the token lapses the admin page starts saying
  "Couldn't reach GitHub" with no obvious cause. Set a calendar
  reminder at creation time.
- **`node_modules/` is gitignored** in NCAA Legends and the site has no
  build step by design. Keep it that way — nothing in `tools/` uses
  anything beyond Node built-ins.
