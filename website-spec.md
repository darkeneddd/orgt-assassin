# ORGT Assassin Website: Build Spec

Hand this file to Claude Code. Build exactly what is listed. Do not add features that are not listed. Ask before changing anything under "Hard constraints".

## What this is
A small themed website for ORGT Assassin, a month-long campus game run by ORGT (Georgia Tech). Players are ORGT members. The site holds the rules, the sign-up form, the kill-report form, a graveyard of eliminated players, and weekly update posts. The organizer updates it by hand every Friday.

## Hard constraints
1. **Never show target assignments**, current or past. Never show who is hunting whom.
2. **Never show kill locations, times, or kill photos.** The graveyard shows only the victim's own headshot, name, and the date of elimination (date only, no time).
3. **Do not name killers** on any public page until the finale. Tombstones say "eliminated" only.
4. **Names are first name + last initial** (e.g. "Maya R.") everywhere on the site.
5. Every page has `<meta name="robots" content="noindex, nofollow">`. Add a `robots.txt` that disallows all.
6. No backend, no database, no login, no user accounts, no file uploads handled by this site. All forms are Microsoft Forms hosted by Microsoft and opened through links (new tab). Do not embed them by default, because GT-only forms with file upload do not render reliably in iframes (especially Safari on iPhone). Data for the graveyard and dispatches lives in JSON files edited by hand.
7. No build step, no framework. Plain HTML, CSS, and a little vanilla JS. Must work when opened by simply serving the folder.
8. Mobile first. Most visitors are on phones. Test at 375px width.
9. No third-party trackers or analytics.

## Hosting
Static site on GitHub Pages or Netlify. Link-only access (not password protected). Provide deploy instructions in README.md.

## Theme (default: noir case file with an outdoors twist)
The organizer has not made a final theme pick. Build this one by default. Keep all theme values in CSS variables in `css/theme.css` so the look can be swapped by editing that one file.

- **Look:** manila folder and dossier. Off-white paper cards on a dark background, typewriter headings, red rubber-stamp accents, redaction bars.
- **Outdoors twist:** faint topographic contour lines in the page background (SVG or CSS), a carabiner icon as the logo and favicon. Copy tone: "Agent, your carabiner is your only tool."
- **Colors (variables):** `--bg: #15130f`, `--paper: #e9e1cf`, `--ink: #1d1a14`, `--stamp-red: #b3261e`, `--accent: #c9a24b`
- **Fonts:** a typewriter-style heading font (e.g. Special Elite) and a clean readable body font (e.g. Inter or system sans). Load from Google Fonts or self-host.
- **Components:** `.card` (paper with slight rotation and shadow), `.stamp` (red bordered rotated text), `.redacted` (black bar over text).
- **Alternates (only if the organizer asks):** wanted-poster Western (sepia, slab serif, torn-paper edges) or Halloween horror (near-black, blood red, distressed serif). These change `theme.css` and the copy tone only.

## Config
Create `config.js` with one object the pages read:

```js
window.GAME = {
  phase: "pre",              // "pre" | "live" | "ended"
  startISO: "2026-11-01T00:00:00-04:00",   // confirmed: Nov 1 at 12:00 am
  endISO:   "2026-12-03T00:00:00-05:00",   // game ends at the end of Dec 2; this is also the kill-report cutoff
  signupDeadlineISO: "2026-10-27T23:59:00-04:00",
  pickupStartISO: "2026-10-27",            // weapon pickup Oct 27 to Oct 30
  pickupEndISO: "2026-10-30",
  crowningDates: "Dec 5",                  // winner crowned at ORGT Prom
  signupFormUrl: "TODO",     // Microsoft Form link (GT sign-in required, has headshot upload)
  reportFormUrl: "TODO",     // Microsoft Form link (GT sign-in required, has proof upload)
  formMode: "link",          // "link" (default, button opens new tab) or "embed" (iframe, only if it is tested to work)
  finaleUnlocked: false,
  contactEmail: "TODO"
};
```

## Site structure (header menu, 4 items)
Header: logo (links Home) + menu: **Home, Rules, Graveyard, Dispatches**. Collapses to a hamburger under 700px. Sticky header.

### 1. Home (`index.html`)
Top to bottom:
1. Hero: game title, tagline, countdown.
   - `phase: "pre"` counts down to `startISO`.
   - `phase: "live"` counts down to `endISO`.
   - `phase: "ended"` shows "Game over".
2. "How it works": three short steps with icons: get your target (by email), clip the carabiner, submit proof.
2b. **Timeline strip** (compact, horizontal on desktop, vertical on mobile), read from `config.js`:
   - Oct 27: signups close
   - Oct 27 to Oct 30: weapon pickup at ORGT
   - Nov 1 at 12:00 am: game starts
   - Fridays 9 pm (Nov 6, 13, 20, 27, Dec 4): weekly dispatch
   - Dec 2 at midnight: game ends, and the Report a Kill form closes
   - Dec 5: winner crowned at ORGT Prom
   Past items get a stamped "DONE" look; the current item is highlighted.
3. **Action card** (the main thing on the page, directly under the how-it-works):
   - `phase: "pre"`: show a large "Sign Up" button linking to `signupFormUrl` (opens in a new tab, `rel="noopener"`). Show the signup deadline next to it.
   - `phase: "live"`: show a large "Report a Kill" button linking to `reportFormUrl`. Hide the sign-up button. Under it, a short line: "Not signed up? Contact the organizer."
   - `phase: "ended"`: hide both, show a thank-you message.
   - Under each button, one line of copy: "Opens in a new tab. Sign in with your GT account."
   - The button is large, full width on mobile, and styled as a red stamp.
   - If `formMode` is `"embed"`, render a responsive iframe instead (with a `title` attribute) and keep a visible "Open in a new tab" link as a fallback. Do not use this mode unless it has been tested in Safari on iPhone.
4. Small "Latest dispatch" teaser pulling the newest entry from `data/dispatches.json`.
5. Footer: "Unofficial event, not affiliated with the CRC", contact email.

### 2. Rules (`rules.html`)
Content comes from `content/rules.md` (below). Layout: sections as accordions (`<details>`): Goal, General Rules, Safe Zones, How to Assassinate, How to Win, Prize, Clarifications, FAQ. Safe zones shown as a scannable list of cards, not a paragraph.

### 3. Graveyard (`graveyard.html`)
- Grid of tombstone cards from `data/graveyard.json`: greyed-out headshot (CSS `grayscale(1)` plus darken), red "X" stamp overlay, name, "Eliminated {date}".
- If an entry has no photo, use a silhouette placeholder.
- Empty state: "No casualties yet."
- Sort: newest first. Show a count of fallen, but **never** a count of players remaining and **never** a leaderboard.
- Bottom section "Case File (Classified)": a redacted, blacked-out mock of the kill chain tree with "Classified until the finale." Controlled by `finaleUnlocked`. When `true`, show a slot for `case-file.html` content (the tree is built later by hand and is NOT part of this task).

### 4. Dispatches (`dispatches.html`)
Archive of weekly updates from `data/dispatches.json`, newest first. Each entry: title, date, short body (HTML allowed). Empty state: "First dispatch drops Friday at 9 pm."

## Data files
`data/graveyard.json`
```json
[
  { "name": "Maya R.", "photo": "assets/graveyard/maya-r.jpg", "date": "2026-11-06" }
]
```
`data/dispatches.json`
```json
[
  { "title": "Dispatch #1", "date": "2026-11-06", "body": "<p>Three assassinations this week.</p>" }
]
```
Start both with example entries clearly marked as samples that the organizer deletes, plus the empty-state behavior tested.

## Rules content (`content/rules.md`)
Use the organizer's rules, trimmed. Dates are TODO.

- **Goal:** Assassinate your target by clipping a provided carabiner on them. When you eliminate someone, you receive their target. Eliminate as many as you can.
- **General rules:** no breaking and entering; no disrupting tests or lectures; use only game-provided weapons; no excessive physical contact (don't hurt anyone).
- **Safe zones:** ORGT classroom; ORGT cages (inside only); sport-wide meetings; classroom sessions for IP participants and IP trips (including gear cleaning after); inside an ORGT van or SUV; quiet places on campus (e.g. Crossland 6 and 7); in class (before and after class are fair game); at work (including labs). Everything else is fair game, including GT campus, the ORGT parking lot, and home park.
- **How to assassinate:** clip the carabiner for real (placing it on someone doesn't count; a backpack they are carrying counts); take a photo or video with target and weapon in frame; submit it through the Report a Kill form with your name, your target's name, and the location; make sure the eliminated person forwards you their target.
- **Clarifications:** you may not steal or break others' carabiners (you may grab and toss one away if someone is attacking you); lost carabiner: get another at ORGT; personal trips and training trips are not IP trips and are fair game; no assassinating someone who is driving; no clocking in or out of work just to assassinate; the organizer has the final call.
- **How to win:** the game ends when one assassin remains. If no one remains alone when the game ends (Dec 2 at midnight, end of day), the assassin with the most kills wins. Kills must be submitted through the Report a Kill form before the game ends; reports after that do not count.
- **Prize:** the winner is crowned at ORGT Prom on Dec 5. Prize itself TODO (previous year: a sash made of carabiners, plus a possible highlight reel).
- **Weapon pickup:** Oct 27 to Oct 30 at ORGT during open Outpost hours. Only grab one.
- **FAQ:** lost carabiner, disputes, who has the final call, what if I'm eliminated (forward your target to your killer).

## Photo prep script
`scripts/prep_photo.py`: input image path and output name, then square-crop to center, resize to 400x400, **strip all EXIF/metadata**, save as JPEG to `assets/graveyard/`. Use Pillow. Include usage in README.md.

## Accessibility and quality
- Semantic HTML, visible focus states, alt text on all images, color contrast at least WCAG AA.
- Respect `prefers-reduced-motion` (no animations if set).
- Lighthouse performance and accessibility scores of 90 or above on mobile.

## README.md must include
1. How to run locally.
2. How to deploy (GitHub Pages or Netlify).
3. **Weekly Friday checklist:** download new headshots, run `prep_photo.py`, add entries to `graveyard.json`, add a dispatch to `dispatches.json`, commit and push.
4. **How to change phase** in `config.js` (pre to live to ended).
5. Reminder of the hard constraints above.

## Todos
- [ ] Scaffold the folder structure: `index.html`, `rules.html`, `graveyard.html`, `dispatches.html`, `css/`, `js/`, `data/`, `content/`, `assets/`, `scripts/`, `robots.txt`, `config.js`, `README.md`
- [ ] Build `css/theme.css` (variables) and `css/style.css` (layout and components)
- [ ] Build the shared header with a hamburger menu under 700px, and the footer
- [ ] Build the Home hero and countdown with all three phases
- [ ] Build the Home "How it works" section and the phase-aware Action card with the Sign Up and Report a Kill link buttons (iframe only if `formMode` is "embed")
- [ ] Build the "Latest dispatch" teaser on Home
- [ ] Build the Rules page with accordions and the safe zone cards
- [ ] Build the Graveyard grid from JSON with the empty state and the silhouette fallback
- [ ] Build the redacted Case File section controlled by `finaleUnlocked`
- [ ] Build the Dispatches archive from JSON with the empty state
- [ ] Add the carabiner logo and favicon (simple SVG) and the contour-line background
- [ ] Add `noindex` meta on every page and `robots.txt`
- [ ] Write `scripts/prep_photo.py`
- [ ] Add sample data and verify the empty states by deleting it
- [ ] Test at 375px and 1280px, test all three phases by editing `config.js`
- [ ] Run Lighthouse and fix anything under 90
- [ ] Verify none of the hard constraints is violated: grep the site for "target", "killed by", "remaining", and time strings
- [ ] Write README.md

## Out of scope (do not build)
Kill chain tree, auto awards, leaderboard, player-remaining counter, login, backend, form handling, live updating.
