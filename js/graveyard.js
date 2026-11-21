// Graveyard page: tombstones from data/graveyard.json and the Case File section.
(function () {
  var G = window.GAME || {};
  var S = window.Site;
  var el = S.el;
  var SILHOUETTE = "assets/silhouette.svg";

  // An agent with a "date" is out of the game. No "date" means still in play.
  // "inactive": true means they left the game rather than being killed, so they get a dash instead of an X.
  function tomb(p) {
    var out = !!p.date;
    var left = out && !!p.inactive;
    var li = el("li", "card tomb" + (out ? " tomb--out" : "") + (left ? " tomb--left" : ""));
    var photo = el("div", "photo");
    var img = el("img");
    img.alt = "Headshot of " + p.name;
    img.width = 400;
    img.height = 400;
    img.loading = "lazy";
    img.src = p.photo || SILHOUETTE;
    img.onerror = function () { img.onerror = null; img.src = SILHOUETTE; };
    photo.appendChild(img);
    if (out) {
      var x = el("span", "x", left ? "—" : "X");
      x.setAttribute("aria-hidden", "true");
      photo.appendChild(x);
    }
    li.appendChild(photo);
    li.appendChild(el("p", "name", p.name));
    li.appendChild(el("p", "when", out ? (left ? "Left the game " : "Eliminated ") + S.fmtDate(p.date) : "Active"));
    if (p.sample) li.appendChild(el("span", "sample-tag", "SAMPLE - DELETE ME"));
    return li;
  }

  function initGrid() {
    var box = document.getElementById("tombs");
    var count = document.getElementById("fallen-count");
    S.loadJSON("data/graveyard.json").catch(function () { return []; }).then(function (rows) {
      // Alphabetical, so a card stays put when its agent is eliminated.
      rows = (rows || []).slice().sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });
      if (!rows.length) {
        var e = el("div", "card card--flat empty-state");
        e.appendChild(el("p", null, "No agents yet."));
        box.replaceWith(e);
        return;
      }
      var left = rows.filter(function (p) { return p.date && p.inactive; }).length;
      var fallen = rows.filter(function (p) { return p.date && !p.inactive; }).length;
      count.textContent = (rows.length - fallen - left) + " active, " + fallen + " fallen" + (left ? ", " + left + " left the game" : "");
      rows.forEach(function (p) { box.appendChild(tomb(p)); });
    });
  }

  function initCaseFile() {
    var box = document.getElementById("casefile-body");
    if (G.finaleUnlocked) {
      // case-file.html is built by hand later; its <main> (or <body>) is dropped in here.
      fetch("case-file.html", { cache: "no-cache" })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, "text/html");
          var src = doc.querySelector("main") || doc.body;
          box.innerHTML = src.innerHTML;
        })
        .catch(function () {
          box.appendChild(el("p", null, "The case file is being assembled."));
        });
      return;
    }
    // Decorative mock only. The bars are fixed widths and say nothing about the real chain.
    var mock = el("div", "card card--flat chain-mock");
    var rows = [[7], [5, 6], [4, 5, 4, 5], [4, 4, 5, 4, 4]];
    var wrap = el("div");
    wrap.setAttribute("aria-hidden", "true");
    rows.forEach(function (widths) {
      var row = el("div", "row");
      widths.forEach(function (w) {
        var n = el("span", "node");
        n.style.width = w * 1.2 + "rem";
        row.appendChild(n);
      });
      wrap.appendChild(row);
    });
    mock.appendChild(wrap);
    box.appendChild(mock);
    // Big stamp laid across the top of the case file.
    box.appendChild(el("span", "stamp stamp--dark stamp--big", "Classified"));
  }

  initGrid();
  initCaseFile();
})();
