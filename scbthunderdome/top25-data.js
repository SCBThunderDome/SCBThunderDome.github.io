/* ============================================================
   TOP 25 — the in-game AP poll, transcribed from screenshots
   ------------------------------------------------------------
   SCB Thunderdome's copy of the EA College Football 27 Top 25,
   one entry per week. It is NOT the site's own computed Power
   Rankings (that's the Rankings tab, built from head-to-head
   results). This poll is mostly CPU teams with a handful of
   coaches mixed in, and it drives two things on the site:

     1. The Top 25 tab.
     2. The "#N" rank badges on schedules. A game played in week N
        shows each team's rank from THAT week's poll, so a schedule
        always shows what a team was ranked WHEN the game was
        played, even after they rise or fall later.

   Because of (2), each week's poll is frozen history: once a week
   is entered, never edit it to reflect a later poll — add a new
   week instead.

   WHAT THE SITE SHOWS, AND WHEN (the reveal rule)
   The site shows the poll for SEASON.currentWeek — the week the
   season has actually advanced to — NOT simply the newest block in
   this file. So a poll added here for a week the site hasn't
   advanced to yet sits in the repo INVISIBLE, and reveals the
   moment someone advances to that week.

   EMPTY AT LAUNCH. Nothing has been transcribed yet, so the Top 25
   tab renders its empty state and no rank badges appear on
   schedules. That is a clean, deliberate state — not an error.
   Use `node tools/top25.js` to add a week from a screenshot.

   Note the preseason ranks visible in the Week 0-13 schedule
   screenshots (SMU 22, Louisville 24, Houston 21) come from the
   in-game poll and are NOT recorded here; enter a real week block
   rather than reconstructing ranks from schedule rows.

   Shape, once there's data:
     { week: 0, teams: [{ rank: 1, team: "Georgia", record: "0-0" }, ...] }
   ------------------------------------------------------------ */
const TOP25 = [];
