/* ============================================================
   SCB THUNDERDOME — roster, season state, and power rankings
   ------------------------------------------------------------
   Same shape as the league-data.js in the NCAA Legends repo, which
   this site's engine was copied from. script.js and style.css are
   shared from the repo root and need no changes.

   Split of duties:
     league-data.js    who's in the league, what week it is, the poll
     schedule-data.js  each team's schedule + scores
   ============================================================ */

/* ------------------------------------------------------------
   SEASON STATE — manually advanced, never date-driven.

   currentWeek is "PRESEASON" until Week 0 kicks off in-game, then
   the week number (0-15) currently being played.

   Week 1, confirmed by Josh 2026-07-30. Week 0 had exactly one
   game — Virginia 33, NC State 14 — and the rest of the league was
   on a bye. The schedule screenshots were taken before that result
   posted, which is why every team header in them still reads
   0-0 (0-0); the score is recorded in schedule-data.js regardless.

   nextAdvance is the only real-world date on the site. Blank hides
   the countdown line entirely rather than showing a stale deadline
   — better than a guess until the commissioner sets one.
   ------------------------------------------------------------ */
const SEASON = {
  // In-game year for this season's data. Governs the seasons/<year>/
  // archive if that's ever turned on here.
  year: 2026,

  currentWeek: 1,
  statusLine: "WEEK 1",
  nextAdvance: "Monday, August 3 — 11:00 PM EDT",
};

/* ------------------------------------------------------------
   LEAGUE IDENTITY
   ------------------------------------------------------------ */
const LEAGUE_INFO = {
  name: "SCB Thunderdome",
  tag: "Dynasty",

  /* Footer links. Each renders only when it has a real URL, so a
     blank one is simply absent rather than a dead link. */
  links: {
    discord: "",
    rules: "",
    vacation: "",
  },

  useEspnLogos: true,
};

/* ------------------------------------------------------------
   COACHES — from the sign-up sheet, snapshot 2026-07-30.

   NAMES are the first names used on the sign-up sheet. If coaches
   would rather appear as their gamertags, change `name` here — it
   is also the key `tools/config.json` matches Discord IDs on, so
   the two must agree (matching is case-insensitive).

   DISCORD IDs ARE DELIBERATELY NOT IN THIS FILE. GitHub Pages
   serves it publicly. They live only in tools/config.json, which is
   gitignored, and reach GitHub Actions through the DISCORD_CONFIG
   secret. Same split the NCAA Legends repo uses.

   CONFERENCES are as given on the sign-up sheet (ACC / SEC / XII /
   B1G / AAC) and match real-world alignment — unlike the NCAA
   Legends leagues, this one appears not to use custom realignment.

   espnId values marked UNVERIFIED below are best-guess and have not
   been eyeballed yet. Open /logo-check.html to check them all at
   once: a wrong id silently renders another school's logo, while a
   missing one falls back harmlessly to the monogram chip.

   COLORS are the primary school colour, lifted from the verified
   NCAA Legends entries where the same school appears there.
   ------------------------------------------------------------ */
const COACHES = [
  { name: "Cros",    team: "Louisville",     conference: "ACC", color: "#CB3B47", twitch: "https://www.twitch.tv/rycr0sby",       espnId: "97" },
  { name: "Danny",   team: "Tulane",         conference: "AAC", color: "#3AA9C9", twitch: "https://www.twitch.tv/sconebone06",    espnId: "2655" },  // espnId UNVERIFIED
  { name: "Trey",    team: "Oklahoma State", conference: "XII", color: "#E8703F", twitch: "https://www.twitch.tv/boogiewoogie_dude", espnId: "197" },  // espnId UNVERIFIED
  { name: "Andrew",  team: "SMU",            conference: "ACC", color: "#5A6FD1", twitch: "https://www.twitch.tv/ape8119",        espnId: "2567" },
  { name: "Craig",   team: "Virginia",       conference: "ACC", color: "#E8703F", twitch: "https://www.twitch.tv/planetbouncy",   espnId: "258" },  // espnId UNVERIFIED
  { name: "Elton",   team: "Virginia Tech",  conference: "ACC", color: "#E8703F", twitch: "https://www.twitch.tv/dcgqmanoftheyear7", espnId: "259" },
  { name: "Jake",    team: "Kentucky",       conference: "SEC", color: "#4B7BD6", twitch: "https://www.twitch.tv/jakefols",       espnId: "96" },  // espnId UNVERIFIED
  { name: "John",    team: "Arizona State",  conference: "XII", color: "#B5486B", twitch: "https://www.twitch.tv/backeru369",     espnId: "9" },  // "ASU" on the sheet; Arizona State confirmed by Josh. espnId UNVERIFIED
  { name: "Richard", team: "Houston",        conference: "XII", color: "#CB3B47", twitch: "",                                     espnId: "248" },  // No Twitch on file yet — Josh to supply. espnId UNVERIFIED
  { name: "Toure",   team: "Colorado",       conference: "XII", color: "#CFB87C", twitch: "https://www.twitch.tv/psualum10",      espnId: "38" },
  { name: "Traven",  team: "Missouri",       conference: "SEC", color: "#F5C542", twitch: "https://www.twitch.tv/travennn95",     espnId: "142" },  // espnId UNVERIFIED
  { name: "Tristan", team: "Wisconsin",      conference: "B1G", color: "#D63B45", twitch: "https://www.twitch.tv/tristanklinefelter", espnId: "275" },
  { name: "Zach",    team: "South Carolina", conference: "SEC", color: "#A6192E", twitch: "https://www.twitch.tv/coachlawless",   espnId: "2579" },
];

/* ------------------------------------------------------------
   POWER RANKINGS

   Empty until enough H2H (user vs. user) games are on the board.
   The Rankings tab shows an explanatory empty state until this
   array has rows. Shape:
     { week: 3, rank: 1, team: "Wisconsin", record: "3-0", score: 97.5 }
   ------------------------------------------------------------ */
const RANKINGS = [];
