// Home page: countdown, action card, timeline strip, latest dispatch teaser.
(function () {
  var G = window.GAME || {};
  var S = window.Site;
  var el = S.el;
  var TZ = "America/New_York";
  var FRIDAYS = ["2026-11-06", "2026-11-13", "2026-11-20", "2026-11-27", "2026-12-04"]; // weekly dispatch dates, 9 pm

  function fmtET(date, withTime) {
    var s = date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ });
    if (!withTime) return s;
    var t = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ }).replace(" AM", " am").replace(" PM", " pm");
    return s + " at " + t;
  }
  function localDate(iso, h, m) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2], h || 0, m || 0);
  }

  /* ---------- Countdown ---------- */
  function initHero() {
    var box = document.getElementById("countdown");
    if (G.phase === "ended") {
      var over = el("p", "game-over stamp stamp--dark", "Game over");
      box.replaceWith(over);
      return;
    }
    var target = new Date(G.phase === "live" ? G.endISO : G.startISO);
    var label = el("p", "countdown-label", G.phase === "live" ? "Game ends in" : "Game starts in");
    box.parentNode.insertBefore(label, box);
    var when = el("p", "countdown-when", (G.phase === "live" ? "Ends " : "Starts ") + fmtET(target, true) + " ET");
    box.parentNode.insertBefore(when, box.nextSibling);
    var nums = {};
    [["days", "Days"], ["hours", "Hours"], ["minutes", "Min"], ["seconds", "Sec"]].forEach(function (u) {
      var unit = el("div", "unit");
      nums[u[0]] = el("span", "num", "00");
      unit.appendChild(nums[u[0]]);
      unit.appendChild(el("span", "lbl", u[1]));
      box.appendChild(unit);
    });
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function tick() {
      var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      nums.days.textContent = pad(Math.floor(s / 86400));
      nums.hours.textContent = pad(Math.floor(s / 3600) % 24);
      nums.minutes.textContent = pad(Math.floor(s / 60) % 60);
      nums.seconds.textContent = pad(s % 60);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Action card ---------- */
  function formButton(text, url) {
    if (S.isUnset(url)) {
      var b = el("button", "btn", text);
      b.type = "button";
      b.disabled = true;
      return b;
    }
    var a = el("a", "btn", text);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }

  function initAction() {
    var card = document.getElementById("action");
    var url, title, btnText;

    if (G.phase === "ended") {
      card.appendChild(el("h2", null, "Thank you for playing"));
      card.appendChild(el("p", null, "The game is over. The winner is crowned at ORGT Prom on " + G.crowningDates + "."));
      return;
    }

    if (G.phase === "live") {
      url = G.reportFormUrl; title = "Report a Kill form"; btnText = "Report a Kill";
    } else {
      url = G.signupFormUrl; title = "Sign up form"; btnText = "Sign Up";
    }
    card.appendChild(el("h2", null, G.phase === "live" ? "Got one?" : "Join the game"));

    if (G.phase !== "live") {
      card.appendChild(el("p", "deadline", "Signups close " + fmtET(new Date(G.signupDeadlineISO), true) + "."));
    }

    var embed = G.formMode === "embed" && !S.isUnset(url);
    if (embed) {
      var f = el("iframe");
      f.src = url;
      f.title = title;
      f.loading = "lazy";
      card.appendChild(f);
      var fb = el("a", "fallback", "Open in a new tab");
      fb.href = url; fb.target = "_blank"; fb.rel = "noopener";
      card.appendChild(fb);
    } else {
      card.appendChild(formButton(btnText, url));
      card.appendChild(el("p", "note", S.isUnset(url) ? "Form link coming soon." : "Opens in a new tab. Sign in with your GT account."));
    }

    if (G.phase === "live") {
      var p = el("p", "note");
      if (S.isUnset(G.contactEmail)) {
        p.textContent = "Not signed up? Contact the organizer.";
      } else {
        p.appendChild(document.createTextNode("Not signed up? "));
        var a = el("a", null, "Contact the organizer");
        a.href = "mailto:" + G.contactEmail;
        p.appendChild(a);
        p.appendChild(document.createTextNode("."));
      }
      card.appendChild(p);
    }
  }

  /* ---------- Timeline ---------- */
  function fridayLabel() {
    var prevMonth = null;
    var parts = FRIDAYS.map(function (iso) {
      var d = localDate(iso);
      var mon = d.toLocaleDateString("en-US", { month: "short" });
      var s = (mon !== prevMonth ? mon + " " : "") + d.getDate();
      prevMonth = mon;
      return s;
    });
    return "Fridays 9 pm (" + parts.join(", ") + ")";
  }

  function initTimeline() {
    var list = document.getElementById("timeline");
    var signup = new Date(G.signupDeadlineISO);
    var start = new Date(G.startISO);
    var end = new Date(G.endISO);
    var pickStart = localDate(G.pickupStartISO);
    var pickEnd = localDate(G.pickupEndISO, 23, 59);
    var lastFriday = localDate(FRIDAYS[FRIDAYS.length - 1], 21);
    var year = start.getFullYear();
    var crown = new Date(G.crowningDates + ", " + year);
    var crownEnd = isNaN(crown) ? null : new Date(crown.getFullYear(), crown.getMonth(), crown.getDate(), 23, 59);

    var items = [
      { when: fmtET(signup), what: "Signups close", done: signup },
      { when: fmtET(pickStart) + " to " + fmtET(pickEnd), what: "Weapon pickup at ORGT", done: pickEnd },
      { when: fmtET(start, true), what: "Game starts", done: start },
      { when: fridayLabel(), what: "Weekly dispatch", href: "dispatches.html", done: lastFriday },
      { when: fmtET(end, true), what: "Game ends. The Report a Kill form closes.", done: end },
      { when: G.crowningDates, what: "Winner crowned at ORGT Prom", done: crownEnd }
    ];

    var now = new Date();
    var currentSet = false;
    items.forEach(function (it) {
      var li = el("li");
      var isDone = it.done && now > it.done;
      var when = el("span", "when", it.when);
      if (isDone) {
        li.className = "done";
      } else if (!currentSet) {
        li.className = "current";
        li.setAttribute("aria-current", "step");
        when.appendChild(el("span", "now", "Now"));
        currentSet = true;
      }
      li.appendChild(when);
      var what = el("span", "what");
      if (it.href) {
        var link = el("a", null, it.what);
        link.href = it.href;
        what.appendChild(link);
      } else {
        what.textContent = it.what;
      }
      li.appendChild(what);
      li.appendChild(el("span", "stamp stamp--dark", "Done"));
      list.appendChild(li);
    });
  }

  /* ---------- Latest dispatch ---------- */
  function initTeaser() {
    var box = document.getElementById("teaser");
    S.loadJSON("data/dispatches.json").then(function (rows) {
      rows = (rows || []).slice().sort(S.byDateDesc);
      if (!rows.length) {
        box.appendChild(el("p", null, "First dispatch drops Friday at 9 pm."));
        return;
      }
      var d = rows[0];
      box.appendChild(el("h3", null, d.title));
      box.appendChild(el("span", "date", S.fmtDate(d.date)));
      var body = el("div", "body");
      body.innerHTML = d.body || "";
      box.appendChild(body);
      var more = el("p", null);
      more.style.marginTop = "0.9rem";
      var a = el("a", null, "All dispatches");
      a.href = "dispatches.html";
      more.appendChild(a);
      box.appendChild(more);
    }).catch(function () {
      box.appendChild(el("p", null, "First dispatch drops Friday at 9 pm."));
    });
  }

  initHero();
  initAction();
  initTimeline();
  initTeaser();
})();
