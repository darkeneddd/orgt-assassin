// Dispatches page: weekly updates from data/dispatches.json, newest first.
(function () {
  var S = window.Site;
  var el = S.el;
  var list = document.getElementById("dispatches");

  function empty() {
    var e = el("div", "card card--flat empty-state");
    e.appendChild(el("p", null, "First dispatch drops Friday at 9 pm."));
    list.replaceWith(e);
  }

  S.loadJSON("data/dispatches.json").then(function (rows) {
    rows = (rows || []).slice().sort(S.byDateDesc);
    if (!rows.length) return empty();
    rows.forEach(function (d) {
      var art = el("article", "card card--flat dispatch");
      art.appendChild(el("h2", null, d.title));
      art.appendChild(el("span", "date", S.fmtDate(d.date)));
      var body = el("div", "body");
      body.innerHTML = d.body || ""; // organizer-authored HTML
      art.appendChild(body);
      if (d.sample) art.appendChild(el("p", "sample-tag", "SAMPLE - DELETE ME"));
      list.appendChild(art);
    });
  }).catch(empty);
})();
