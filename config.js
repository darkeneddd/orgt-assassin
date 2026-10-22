// Edit this file to run the game. See README.md for what to change each phase.
window.GAME = {
  phase: "pre",              // "pre" | "live" | "ended"
  startISO: "2026-10-31T00:00:00-04:00",   // confirmed: Oct 31 at 12:00 am
  endISO:   "2026-12-02T23:59:00-05:00",   // game ends Dec 2 at 11:59 pm; this is also the kill-report cutoff
  signupDeadlineISO: "2026-10-26T23:59:00-04:00",
  pickupStartISO: "2026-10-26",            // weapon pickup Oct 26 to Oct 30
  pickupEndISO: "2026-10-30",
  crowningDates: "Dec 5",                  // winner crowned at ORGT Prom
  signupFormUrl: "https://forms.cloud.microsoft/r/iY3Apj4f2n",         // Microsoft Form link (GT sign-in required, has headshot upload). Blank = "coming soon"
  reportFormUrl: "",         // Microsoft Form link (GT sign-in required, has proof upload). Blank = "coming soon"
  formMode: "link",          // "link" (default, button opens new tab) or "embed" (iframe, only if it is tested to work)
  finaleUnlocked: false,
  contactEmail: ""           // Blank = "coming soon"
};
