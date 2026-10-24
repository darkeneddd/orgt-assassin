// Edit this file to run the game. See README.md for what to change each phase.
window.GAME = {
  phase: "pre",              // "pre" | "live" | "ended"
  startISO: "2026-11-01T00:00:00-04:00",   // confirmed: Nov 1 at 12:00 am
  endISO:   "2026-12-02T23:59:00-05:00",   // game ends Dec 2 at 11:59 pm; this is also the kill-report cutoff
  signupDeadlineISO: "2026-10-27T23:59:00-04:00",
  pickupStartISO: "2026-10-26",            // weapon pickup Oct 26 to Oct 30
  pickupEndISO: "2026-10-30",
  crowningDates: "Dec 5",                  // winner crowned at ORGT Prom
  signupFormUrl: "https://forms.cloud.microsoft/r/iY3Apj4f2n",         // Microsoft Form link (GT sign-in required, has headshot upload). Blank = "coming soon"
  reportFormUrl: "",         // Microsoft Form link (GT sign-in required, has proof upload). Blank = "coming soon"
  formMode: "link",          // "link" (default, button opens new tab) or "embed" (iframe, only if it is tested to work)
  groupmeUrl: "https://groupme.com/join_group/118349541/2qW5KJn7",          // GroupMe invite link for announcements. Blank = "coming soon"
  finaleUnlocked: false,
  contactEmail: "avadhera7@gatech.edu",          // Blank = "coming soon"
  contactPhone: "470-907-6921"           // Optional, e.g. "(404) 555-0123". Shown in the footer next to the email
};
