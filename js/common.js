// Shared helpers plus the header and footer that every page uses.
(function () {
  var G = window.GAME || {};

  var NAV = [
    { href: "index.html", label: "Home" },
    { href: "rules.html", label: "Rules" },
    { href: "graveyard.html", label: "Graveyard" },
    { href: "dispatches.html", label: "Dispatches" }
  ];

  // A config value counts as "not set" when blank or still the TODO placeholder.
  function isUnset(v) {
    return !v || String(v).trim() === "" || String(v).trim().toUpperCase() === "TODO";
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // "2026-11-06" -> "Nov 6". Date only, parsed by hand so time zones can't shift the day.
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
    if (!m) return "";
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function loadJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(url + " " + r.status);
      return r.json();
    });
  }

  function byDateDesc(a, b) {
    return String(b.date).localeCompare(String(a.date));
  }

  function buildHeader() {
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var header = el("header", "site-header");
    var links = NAV.map(function (n) {
      var cur = n.href === page ? ' aria-current="page"' : "";
      return '<li><a href="' + n.href + '"' + cur + ">" + n.label + "</a></li>";
    }).join("");
    header.innerHTML =
      '<div class="header-inner">' +
      '<a class="logo" href="index.html"><img src="assets/logo.svg" alt="" width="38" height="38"><span>ORGT Assassin</span><span class="sr-only"> home</span></a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu"><span class="bars"></span></button>' +
      '<nav class="site-nav" id="site-nav" aria-label="Main"><ul>' + links + "</ul></nav>" +
      "</div>";
    var btn = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".site-nav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
    return header;
  }

  function buildFooter() {
    var f = el("footer", "site-footer");
    f.appendChild(el("p", null, "Unofficial event, not affiliated with the CRC or Georgia Tech"));
    var p = el("p");
    var hasEmail = !isUnset(G.contactEmail);
    var hasPhone = !isUnset(G.contactPhone);
    var hasName = !isUnset(G.contactName);
    if (!hasEmail && !hasPhone) {
      p.textContent = "Contact: coming soon";
    } else {
      p.appendChild(document.createTextNode("Contact: "));
      if (hasName) p.appendChild(document.createTextNode(G.contactName + " | "));
      if (hasEmail) {
        var a = el("a", null, G.contactEmail);
        a.href = "mailto:" + G.contactEmail;
        p.appendChild(a);
      }
      if (hasEmail && hasPhone) p.appendChild(document.createTextNode(" | "));
      if (hasPhone) {
        var t = el("a", null, G.contactPhone);
        t.href = "tel:" + G.contactPhone.replace(/[^\d+]/g, "");
        p.appendChild(t);
      }
    }
    f.appendChild(p);
    return f;
  }

  window.Site = { isUnset: isUnset, el: el, fmtDate: fmtDate, loadJSON: loadJSON, byDateDesc: byDateDesc };

  var skip = el("a", "skip-link", "Skip to content");
  skip.href = "#main";
  document.body.insertBefore(buildHeader(), document.body.firstChild);
  document.body.insertBefore(skip, document.body.firstChild);
  document.body.appendChild(buildFooter());
})();
