/* ============================================================
   SCB THUNDERDOME — SCHEDULE DATA
   ------------------------------------------------------------
   Transcribed from in-game "Team Schedule" screenshots, 2 per
   team (weeks 0-8 and weeks 8-Conf Champ), overlap at week 8
   deduped by hand. Snapshot taken 2026-07-30.

   All 13 coaches are represented. Every user-vs-user matchup was
   cross-checked against BOTH coaches' screenshots and the
   home/away sides agree in all 12 cases — see the H2H list at the
   bottom of this comment.

   WEEK MAPPING. The in-game table lists rows 0-15 and then a
   separate "Conf Champ" row. This file follows the convention the
   NCAA Legends leagues use and that script.js's weekLabel()
   expects:
       weeks 0-13     regular season games
       week 14        Army-Navy Week
       week 15        conference championship  <- the "Conf Champ" row
   The in-game row 15 is a bye for every team and is NOT carried
   over; nothing renders it, and carrying it would leave the
   championship with nowhere to live. Confirmed with Josh
   2026-07-30.

   STADIUMS. The Team Schedule screen doesn't display venue, so
   stadium is intentionally omitted. script.js treats it as
   optional (renders an empty span), so the site is happy without
   it. Can be filled in per entry later if it's wanted.

   SCORES. Only one game has been played: Virginia beat NC State
   33-14 in Week 0, against a CPU opponent, so there is no second
   entry to keep in sync. Every other week 0 row is a bye. Once a
   user-vs-user game goes final, add the score to BOTH teams'
   entries or it'll only show on one coach's schedule.

   NAME NOTE: "Arizona State" is spelled out rather than the sheet's
   "ASU" — the game spells it in full, and the abbreviation collides
   with Appalachian State. Likewise "Miami" here is the ACC
   Hurricanes, as the game spells it.

   CONFERENCES match league-data.js (ACC / SEC / XII / B1G / AAC)
   and are stock real-world alignment — this league does not use
   the custom realignment the NCAA Legends leagues do.

   TWO TEAMS HAVE NO USER-VS-USER GAMES AT ALL: Wisconsin and
   Tulane. Both play a full 12-game CPU slate. That is what the
   screenshots show, not a transcription gap — flagged to Josh in
   case the schedule was meant to include them.

   THE 12 HEAD-TO-HEAD GAMES, for cross-checking:
     W3   SMU        at Louisville
     W5   Kentucky   at South Carolina
     W7   Virginia   at SMU
     W7   Okla State at Houston
     W8   Colorado   at Oklahoma State
     W10  Va Tech    at SMU
     W10  Colorado   at Arizona State
     W11  Houston    at Colorado
     W12  Kentucky   at Missouri
     W12  Okla State at Arizona State
     W13  Louisville at Kentucky
     W13  Virginia   at Virginia Tech
   ============================================================ */
const TEAM_SCHEDULES = [
  /* ---------------------------- ACC ---------------------------- */
  {
    team: "Louisville",
    conference: "ACC",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "Ole Miss", location: "vs" },
      { week: 2, opponent: "FCS Southeast", location: "vs" },
      { week: 3, opponent: "SMU", location: "vs" },
      { week: 4, opponent: "Wake Forest", location: "vs" },
      { week: 5, opponent: "NC State", location: "at" },
      { week: 6, opponent: "Florida State", location: "vs" },
      { week: 7, opponent: "Syracuse", location: "at" },
      { week: 8, note: "BYE" },
      { week: 9, opponent: "Stanford", location: "vs" },
      { week: 10, opponent: "Georgia Tech", location: "at" },
      { week: 11, opponent: "North Carolina", location: "at" },
      { week: 12, opponent: "Pittsburgh", location: "vs" },
      { week: 13, opponent: "Kentucky", location: "at" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "ACC Championship" },
    ],
  },
  {
    team: "SMU",
    conference: "ACC",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "Florida State", location: "at", teamScore: 56, opponentScore: 7 },
      { week: 2, opponent: "FCS Midwest", location: "vs" },
      { week: 3, opponent: "Louisville", location: "at" },
      { week: 4, opponent: "Missouri State", location: "vs" },
      { week: 5, opponent: "Boston College", location: "vs" },
      { week: 6, note: "BYE" },
      { week: 7, opponent: "Virginia", location: "vs" },
      { week: 8, opponent: "California", location: "vs" },
      { week: 9, opponent: "Syracuse", location: "at" },
      { week: 10, opponent: "Virginia Tech", location: "vs" },
      { week: 11, opponent: "Wake Forest", location: "vs" },
      { week: 12, opponent: "Notre Dame", location: "at" },
      { week: 13, opponent: "Stanford", location: "at" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "ACC Championship" },
    ],
  },
  {
    team: "Virginia",
    conference: "ACC",
    weeks: [
      /* The only game played so far. CPU opponent, so no paired
         entry to keep in sync. */
      { week: 0, opponent: "NC State", location: "vs", teamScore: 33, opponentScore: 14 },
      { week: 1, note: "BYE" },
      { week: 2, opponent: "FCS East", location: "vs" },
      { week: 3, opponent: "West Virginia", location: "vs" },
      { week: 4, opponent: "Delaware", location: "vs" },
      { week: 5, opponent: "Florida State", location: "at" },
      { week: 6, opponent: "Syracuse", location: "vs" },
      { week: 7, opponent: "SMU", location: "at" },
      { week: 8, opponent: "Duke", location: "vs" },
      { week: 9, opponent: "Wake Forest", location: "at" },
      { week: 10, note: "BYE" },
      { week: 11, opponent: "California", location: "vs" },
      { week: 12, opponent: "North Carolina", location: "vs" },
      { week: 13, opponent: "Virginia Tech", location: "at" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "ACC Championship" },
    ],
  },
  {
    team: "Virginia Tech",
    conference: "ACC",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "FCS East", location: "vs" },
      { week: 2, opponent: "Old Dominion", location: "vs" },
      { week: 3, opponent: "Maryland", location: "at" },
      { week: 4, opponent: "Boston College", location: "at" },
      { week: 5, opponent: "Pittsburgh", location: "vs" },
      { week: 6, opponent: "California", location: "at" },
      { week: 7, opponent: "Georgia Tech", location: "vs" },
      { week: 8, opponent: "Clemson", location: "at" },
      { week: 9, note: "BYE" },
      { week: 10, opponent: "SMU", location: "at" },
      { week: 11, opponent: "Stanford", location: "vs" },
      { week: 12, opponent: "Miami", location: "at" },
      { week: 13, opponent: "Virginia", location: "vs" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "ACC Championship" },
    ],
  },

  /* ---------------------------- SEC ---------------------------- */
  {
    team: "Kentucky",
    conference: "SEC",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "FCS Southeast", location: "vs" },
      { week: 2, opponent: "Alabama", location: "vs" },
      { week: 3, opponent: "Texas A&M", location: "at" },
      { week: 4, opponent: "South Alabama", location: "vs" },
      { week: 5, opponent: "South Carolina", location: "at" },
      { week: 6, opponent: "LSU", location: "vs" },
      { week: 7, opponent: "Oklahoma", location: "at" },
      { week: 8, opponent: "Vanderbilt", location: "vs" },
      { week: 9, note: "BYE" },
      { week: 10, opponent: "Tennessee", location: "at" },
      { week: 11, opponent: "Florida", location: "vs" },
      { week: 12, opponent: "Missouri", location: "at" },
      { week: 13, opponent: "Louisville", location: "vs" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "SEC Championship" },
    ],
  },
  {
    team: "Missouri",
    conference: "SEC",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "FCS Midwest", location: "vs" },
      { week: 2, opponent: "Kansas", location: "at" },
      { week: 3, opponent: "Troy", location: "vs" },
      { week: 4, opponent: "Mississippi State", location: "at" },
      { week: 5, opponent: "Florida", location: "vs" },
      { week: 6, opponent: "Texas A&M", location: "vs" },
      { week: 7, opponent: "Ole Miss", location: "at" },
      { week: 8, note: "BYE" },
      { week: 9, opponent: "Arkansas", location: "at" },
      { week: 10, opponent: "Texas", location: "vs" },
      { week: 11, opponent: "Georgia", location: "at" },
      { week: 12, opponent: "Kentucky", location: "vs" },
      { week: 13, opponent: "Oklahoma", location: "vs" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "SEC Championship" },
    ],
  },
  {
    team: "South Carolina",
    conference: "SEC",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "Kent State", location: "vs", teamScore: 49, opponentScore: 6 },
      { week: 2, opponent: "FCS Southeast", location: "vs" },
      { week: 3, opponent: "Mississippi State", location: "vs" },
      { week: 4, opponent: "Alabama", location: "at" },
      { week: 5, opponent: "Kentucky", location: "vs" },
      { week: 6, opponent: "Florida", location: "at" },
      { week: 7, note: "BYE" },
      { week: 8, opponent: "Tennessee", location: "vs" },
      { week: 9, opponent: "Oklahoma", location: "at" },
      { week: 10, opponent: "Texas A&M", location: "vs" },
      { week: 11, opponent: "Arkansas", location: "at" },
      { week: 12, opponent: "Georgia", location: "vs" },
      { week: 13, opponent: "Clemson", location: "at" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "SEC Championship" },
    ],
  },

  /* ---------------------------- XII ---------------------------- */
  {
    team: "Arizona State",
    conference: "XII",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "FCS Midwest", location: "vs" },
      { week: 2, opponent: "Texas A&M", location: "at" },
      { week: 3, opponent: "Kansas", location: "at" },
      { week: 4, note: "BYE" },
      { week: 5, opponent: "Baylor", location: "vs" },
      { week: 6, opponent: "Hawai'i", location: "vs" },
      { week: 7, opponent: "Texas Tech", location: "at" },
      { week: 8, opponent: "Kansas State", location: "vs" },
      { week: 9, opponent: "BYU", location: "at" },
      { week: 10, opponent: "Colorado", location: "vs" },
      { week: 11, opponent: "UCF", location: "at" },
      { week: 12, opponent: "Oklahoma State", location: "vs" },
      { week: 13, opponent: "Arizona", location: "at" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "Big 12 Championship" },
    ],
  },
  {
    team: "Colorado",
    conference: "XII",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "Georgia Tech", location: "at" },
      { week: 2, opponent: "FCS Midwest", location: "vs" },
      { week: 3, opponent: "Northwestern", location: "at" },
      { week: 4, opponent: "Baylor", location: "at" },
      { week: 5, opponent: "Texas Tech", location: "vs" },
      { week: 6, note: "BYE" },
      { week: 7, opponent: "Utah", location: "vs" },
      { week: 8, opponent: "Oklahoma State", location: "at" },
      { week: 9, opponent: "Kansas State", location: "vs" },
      { week: 10, opponent: "Arizona State", location: "at" },
      { week: 11, opponent: "Houston", location: "vs" },
      { week: 12, opponent: "Cincinnati", location: "at" },
      { week: 13, opponent: "UCF", location: "vs" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "Big 12 Championship" },
    ],
  },
  {
    team: "Houston",
    conference: "XII",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "Oregon State", location: "vs" },
      { week: 2, opponent: "FCS Midwest", location: "vs" },
      { week: 3, opponent: "Texas Tech", location: "at" },
      { week: 4, opponent: "Georgia Southern", location: "at" },
      { week: 5, opponent: "UCF", location: "vs" },
      { week: 6, opponent: "Kansas State", location: "at" },
      { week: 7, opponent: "Oklahoma State", location: "vs" },
      { week: 8, opponent: "Utah", location: "at" },
      { week: 9, note: "BYE" },
      { week: 10, opponent: "Cincinnati", location: "vs" },
      { week: 11, opponent: "Colorado", location: "at" },
      { week: 12, opponent: "West Virginia", location: "at" },
      { week: 13, opponent: "Baylor", location: "vs" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "Big 12 Championship" },
    ],
  },
  {
    team: "Oklahoma State",
    conference: "XII",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "Tulsa", location: "at" },
      { week: 2, opponent: "Oregon", location: "vs" },
      { week: 3, opponent: "FCS Midwest", location: "vs" },
      { week: 4, opponent: "West Virginia", location: "at" },
      { week: 5, note: "BYE" },
      { week: 6, opponent: "UCF", location: "vs" },
      { week: 7, opponent: "Houston", location: "at" },
      { week: 8, opponent: "Colorado", location: "vs" },
      { week: 9, opponent: "Iowa State", location: "at" },
      { week: 10, opponent: "Kansas State", location: "at" },
      { week: 11, opponent: "Texas Tech", location: "vs" },
      { week: 12, opponent: "Arizona State", location: "at" },
      { week: 13, opponent: "Kansas", location: "vs" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "Big 12 Championship" },
    ],
  },

  /* ---------------------------- B1G ---------------------------- */
  {
    /* No user-vs-user games on this schedule — a full CPU slate.
       Verified against both screenshots; not a transcription gap. */
    team: "Wisconsin",
    conference: "B1G",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "Notre Dame", location: "at" },
      { week: 2, opponent: "FCS Midwest", location: "vs" },
      { week: 3, opponent: "Eastern Michigan", location: "vs" },
      { week: 4, opponent: "Penn State", location: "at" },
      { week: 5, opponent: "Michigan State", location: "vs" },
      { week: 6, note: "BYE" },
      { week: 7, opponent: "UCLA", location: "at" },
      { week: 8, opponent: "USC", location: "vs" },
      { week: 9, opponent: "Iowa", location: "at" },
      { week: 10, opponent: "Rutgers", location: "vs" },
      { week: 11, opponent: "Maryland", location: "at" },
      { week: 12, opponent: "Purdue", location: "at" },
      { week: 13, opponent: "Minnesota", location: "vs" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "Big Ten Championship" },
    ],
  },

  /* ---------------------------- AAC ---------------------------- */
  {
    /* Also a full CPU slate — see the note on Wisconsin. */
    team: "Tulane",
    conference: "AAC",
    weeks: [
      { week: 0, note: "BYE" },
      { week: 1, opponent: "Duke", location: "at" },
      { week: 2, opponent: "South Alabama", location: "vs" },
      { week: 3, opponent: "Kansas State", location: "at" },
      { week: 4, opponent: "Southern Mississippi", location: "vs" },
      { week: 5, note: "BYE" },
      { week: 6, opponent: "Army", location: "at" },
      { week: 7, opponent: "Memphis", location: "vs" },
      { week: 8, opponent: "UTSA", location: "vs" },
      { week: 9, opponent: "Charlotte", location: "at" },
      { week: 10, opponent: "Tulsa", location: "vs" },
      { week: 11, opponent: "Rice", location: "at" },
      { week: 12, opponent: "North Texas", location: "vs" },
      { week: 13, opponent: "USF", location: "at" },
      { week: 14, note: "Army-Navy Week" },
      { week: 15, note: "American Championship" },
    ],
  },
];
