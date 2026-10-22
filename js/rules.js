// Rules page: reads content/rules.md and renders each "## Heading" as an accordion.
// Supported markdown: "## " sections, "- " bullets, paragraphs, **bold**. Nothing else.
(function () {
  var el = window.Site.el;
  var root = document.getElementById("rules");
  var G = window.GAME || {};

  // Callout at the top: where the Report a Kill form is and when it opens.
  function initReport() {
    var box = document.getElementById("report");
    box.appendChild(el("h2", null, "Report a Kill form"));
    if (G.phase === "ended") {
      box.appendChild(el("p", null, "The game is over. The Report a Kill form is closed."));
      return;
    }
    var live = G.phase === "live";
    var opens = new Date(G.startISO);
    var when = opens.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" });
    box.appendChild(el("p", null, live
      ? "Submit every kill here with your photo or video. It closes Dec 2 at 11:59 pm."
      : "Every kill is submitted through this form. It opens when the game starts on " + when + " at 12:00 am."));
    if (live && !window.Site.isUnset(G.reportFormUrl)) {
      var a = el("a", "btn", "Report a Kill");
      a.href = G.reportFormUrl;
      a.target = "_blank";
      a.rel = "noopener";
      box.appendChild(a);
    } else {
      var b = el("button", "btn", "Report a Kill");
      b.type = "button";
      b.disabled = true;
      box.appendChild(b);
      box.appendChild(el("p", "note", live ? "Form link coming soon." : "Not open yet."));
    }
  }
  initReport();

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inline(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function parse(md) {
    var sections = [];
    var cur = null;
    md.split(/\r?\n/).forEach(function (line) {
      var h = /^##\s+(.*)$/.exec(line);
      if (h) {
        cur = { title: h[1].trim(), blocks: [] };
        sections.push(cur);
        return;
      }
      if (!cur) return;
      var last = cur.blocks[cur.blocks.length - 1];
      var b = /^-\s+(.*)$/.exec(line);
      if (b) {
        if (!last || last.type !== "list") { last = { type: "list", items: [] }; cur.blocks.push(last); }
        last.items.push(b[1]);
      } else if (line.trim() === "") {
        if (last) last.closed = true;
      } else if (last && last.type === "p" && !last.closed) {
        last.text += " " + line.trim();
      } else {
        cur.blocks.push({ type: "p", text: line.trim() });
      }
    });
    return sections;
  }

  function render(sections) {
    sections.forEach(function (sec, i) {
      var d = el("details");
      if (i === 0) d.open = true;
      d.appendChild(el("summary", null, sec.title));
      var body = el("div", "body");
      sec.blocks.forEach(function (blk) {
        if (blk.type === "p") {
          var p = el("p");
          p.innerHTML = inline(blk.text);
          body.appendChild(p);
        } else {
          var ul = el("ul", sec.title.toLowerCase() === "safe zones" ? "zone-grid" : null);
          blk.items.forEach(function (t) {
            var li = el("li");
            li.innerHTML = inline(t);
            ul.appendChild(li);
          });
          body.appendChild(ul);
        }
      });
      d.appendChild(body);
      root.appendChild(d);
    });
  }

  fetch("content/rules.md", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (md) { render(parse(md)); })
    .catch(function () {
      var c = el("div", "card card--flat");
      c.appendChild(el("p", null, "Could not load the rules. Try refreshing the page."));
      root.appendChild(c);
    });
})();
