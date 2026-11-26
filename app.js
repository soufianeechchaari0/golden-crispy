window.gcStart = function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function num(n) { var v = Math.round(n * 100) / 100; return (v % 1 === 0 ? String(v) : v.toFixed(2)).replace(".", ","); }
  function money(n) { return num(n) + " " + CONFIG.currency; }

  var PLUS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var MINUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';

  // ---------- Index des plats ----------
  var ITEMS = {}, totalDishes = 0;
  MENU.forEach(function (c) {
    c.items.forEach(function (it) {
      ITEMS[it.id] = { id: it.id, name: it.name, price: Number(it.price) || 0, soldOut: !!it.soldOut };
      totalDishes++;
    });
  });

  // ---------- État : panier, mode, table ----------
  var cart = {}, mode = "emporter", table = "";
  try { cart = JSON.parse(localStorage.getItem("gc_cart") || "{}"); } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (id) { if (!ITEMS[id] || ITEMS[id].soldOut || !(cart[id] > 0)) delete cart[id]; });
  try { table = localStorage.getItem("gc_table") || ""; } catch (e) { table = ""; }
  try {
    var tp = new URLSearchParams(window.location.search).get("table");
    if (tp && /^[A-Za-z0-9\-]{1,6}$/.test(tp)) { table = tp; }
  } catch (e) {}
  if (table) mode = "table";
  try {
    var mp = new URLSearchParams(window.location.search).get("mode");
    if (mp === "emporter" || mp === "livraison") { mode = mp; table = ""; }
  } catch (e) {}

  function save() {
    try { localStorage.setItem("gc_cart", JSON.stringify(cart)); localStorage.setItem("gc_table", table); } catch (e) {}
  }
  function count() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k] * ITEMS[k].price; }, 0); }

  // ---------- Accueil ----------
  $("#heroAr").textContent = CONFIG.nameAr || "";
  $("#heroTag").textContent = CONFIG.tagline || "";
  $("#heroWa").href = "https://wa.me/" + CONFIG.whatsapp;

  function countUp(node, to) {
    node.textContent = to;
    if (reduced || !window.requestAnimationFrame) return;
    var t0 = null, dur = 900;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      node.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var statsEl = $("#stats");
  (CONFIG.stats || []).forEach(function (s) {
    var to = s.to === "plats" ? totalDishes : s.to === "categories" ? MENU.length : Number(s.to) || 0;
    var d = document.createElement("div");
    d.className = "stat";
    d.innerHTML = "<strong><span class=\"num\"></span>" + esc(s.suffix || "") + "</strong><span>" + esc(s.label || "") + "</span>";
    statsEl.appendChild(d);
    countUp($(".num", d), to);
  });

  // ---------- Menu ----------
  var pillsEl = $("#catnavIn"), catsEl = $("#cats");
  MENU.forEach(function (c) {
    var pic = c.img ? '<img src="' + esc(c.img) + '" alt="" width="30" height="30">' : "";
    pillsEl.insertAdjacentHTML("beforeend",
      '<a class="pill" href="#' + esc(c.id) + '" data-cat="' + esc(c.id) + '">' + pic + "<span>" + esc(c.name) + "</span></a>");

    var big = c.img ? '<img src="' + esc(c.img) + '" alt="" width="84" height="84" loading="lazy">' : esc(c.icon || "");
    var h = '<section class="cat" id="' + esc(c.id) + '" data-cat="' + esc(c.id) + '"><div class="cat-hd"><div class="cat-img">' + big +
      "</div><div><h3 class=\"disp\">" + esc(c.name) + "</h3><small>" + c.items.length + (c.items.length > 1 ? " plats" : " plat") +
      '</small></div></div><div class="grid">';
    c.items.forEach(function (it) {
      var psrc = it.img || c.img; var ipic = psrc ? '<img class="item-pic" src="' + esc(psrc) + '" alt="" loading="lazy">' : "";
      h += '<article class="item' + (it.soldOut ? " sold" : "") + '" data-id="' + esc(it.id) + '" data-name="' + esc(norm(it.name)) + '">' + ipic +
        "<h4>" + esc(it.name) + '</h4><div class="item-row"><span class="price">' + esc(num(Number(it.price) || 0)) +
        "<small>" + esc(CONFIG.currency) + '</small></span><div class="ctrl"></div></div></article>';
    });
    catsEl.insertAdjacentHTML("beforeend", h + "</div></section>");
  });

  function renderCtrl(id) {
    var host = $('.item[data-id="' + id + '"] .ctrl');
    if (!host) return;
    var it = ITEMS[id], q = cart[id] || 0;
    if (it.soldOut) { host.innerHTML = '<span class="soldtag">Épuisé</span>'; return; }
    host.innerHTML = q
      ? '<div class="qty"><button type="button" data-act="dec" data-id="' + esc(id) + '" aria-label="Retirer un ' + esc(it.name) + '">' + MINUS + "</button><b>" + q +
        '</b><button type="button" data-act="inc" data-id="' + esc(id) + '" aria-label="Ajouter un ' + esc(it.name) + '">' + PLUS + "</button></div>"
      : '<button type="button" class="add" data-act="inc" data-id="' + esc(id) + '" aria-label="Ajouter ' + esc(it.name) + '">' + PLUS + "</button>";
  }

  function change(id, d) {
    if (!ITEMS[id] || ITEMS[id].soldOut) return;
    cart[id] = (cart[id] || 0) + d;
    if (cart[id] <= 0) delete cart[id];
    renderCtrl(id);
    update();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (b) change(b.dataset.id, b.dataset.act === "inc" ? 1 : -1);
  });

  // Recherche
  $("#q").addEventListener("input", function () {
    var q = norm(this.value.trim()), any = false;
    $$(".cat").forEach(function (cat) {
      var vis = 0;
      $$(".item", cat).forEach(function (it) {
        var m = !q || it.dataset.name.indexOf(q) > -1;
        it.hidden = !m;
        if (m) vis++;
      });
      cat.hidden = vis === 0;
      var p = $('.pill[data-cat="' + cat.dataset.cat + '"]');
      if (p) p.hidden = vis === 0;
      if (vis) any = true;
    });
    $("#noRes").hidden = any;
  });

  // Catégorie visible dans la barre
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$(".pill").forEach(function (p) { p.classList.toggle("on", p.dataset.cat === en.target.dataset.cat); });
        var on = $(".pill.on");
        if (on && pillsEl.scrollTo) pillsEl.scrollTo({ left: Math.max(0, on.offsetLeft - 24), behavior: reduced ? "auto" : "smooth" });
      });
    }, { rootMargin: "-30% 0px -62% 0px" });
    $$(".cat").forEach(function (s) { io.observe(s); });
  }

  // ---------- Commande ----------
  var overlay = $("#overlay"), drawer = $("#drawer"), lastFocus = null;

  function syncTable() {
    $("#tableVal").textContent = table || "—"; $("#tableChip").classList.toggle("empty", !table);
    if ($("#table").value !== table) $("#table").value = table;
  }

  function renderDrawer() {
    var ids = Object.keys(cart), html = "";
    if (!ids.length) html = '<p class="empty-cart">Votre panier est vide.</p>';
    ids.forEach(function (id) {
      var it = ITEMS[id];
      html += '<div class="ln"><span class="n">' + esc(it.name) + '</span><div class="qty"><button type="button" data-act="dec" data-id="' + esc(id) +
        '" aria-label="Retirer un ' + esc(it.name) + '">' + MINUS + "</button><b>" + cart[id] + '</b><button type="button" data-act="inc" data-id="' + esc(id) +
        '" aria-label="Ajouter un ' + esc(it.name) + '">' + PLUS + '</button></div><span class="p">' + money(it.price * cart[id]) + "</span></div>";
    });
    $("#lines").innerHTML = html;
    $("#sheetTotal").textContent = money(total());
    $$(".seg button").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.mode === mode ? "true" : "false"); });
    $("#fTable").hidden = mode !== "table";
    $("#fName").hidden = mode === "table";
    $("#fPhone").hidden = mode === "table";
    $("#fAddr").hidden = mode !== "livraison";
  }

  function update() {
    var n = count();
    $("#badge").textContent = n;
    $("#barCount").textContent = n;
    $("#barTotal").textContent = money(total());
    $("#cartbar").classList.toggle("show", n > 0 && !overlay.classList.contains("open"));
    save();
    renderDrawer();
  }

  function open() {
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    $("#cartbar").classList.remove("show");
    renderDrawer();
    $("#closeX").focus();
  }
  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    update();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $("#cartBtn").addEventListener("click", open);
  $("#cartbarBtn").addEventListener("click", open);
  $("#tableChip").addEventListener("click", function () { mode = "table"; open(); $("#table").focus(); });
  $("#closeX").addEventListener("click", close);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    var f = $$("button, a[href], input, textarea", drawer).filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  $$(".seg button").forEach(function (b) {
    b.addEventListener("click", function () { mode = b.dataset.mode; renderDrawer(); });
  });
  $("#table").addEventListener("input", function () {
    table = this.value.replace(/[^A-Za-z0-9\-]/g, "").slice(0, 6);
    $("#tableVal").textContent = table || "—"; $("#tableChip").classList.toggle("empty", !table);
    save();
  });

  // Envoi WhatsApp : le lien est construit au clic, après validation
  $("#sendBtn").addEventListener("click", function (e) {
    var err = $("#err");
    err.textContent = "";
    var name = $("#name").value.trim(), phone = $("#phone").value.trim(), addr = $("#addr").value.trim(), note = $("#note").value.trim();

    var problem = "";
    if (!count()) problem = "Ajoutez au moins un plat à votre commande.";
    else if (mode === "table" && !table) problem = "Entrez le numéro de votre table.";
    else if (mode !== "table" && (!name || !phone)) problem = "Entrez votre nom et votre téléphone.";
    else if (mode === "livraison" && !addr) problem = "Entrez l'adresse de livraison.";
    if (problem) { e.preventDefault(); err.textContent = problem; return; }

    var label = { table: "À table", emporter: "À emporter", livraison: "Livraison" }[mode];
    var msg = "*Nouvelle commande — " + CONFIG.name + "*\nMode : " + label + "\n";
    if (mode === "table") msg += "Table : " + table + "\n";
    else msg += "Nom : " + name + "\nTél : " + phone + "\n";
    if (mode === "livraison") msg += "Adresse : " + addr + "\n";
    msg += "\n";
    Object.keys(cart).forEach(function (id) {
      msg += "• " + cart[id] + " × " + ITEMS[id].name + " — " + money(ITEMS[id].price * cart[id]) + "\n";
    });
    msg += "\n*Total : " + money(total()) + "*";
    if (note) msg += "\nNote : " + note;
    this.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
  });

  // ---------- Contact & pied de page ----------
  $("#cAddr").textContent = CONFIG.address || "";
  $("#cPhone").textContent = CONFIG.phoneDisplay || "";
  $("#cHours").textContent = CONFIG.hours || "";
  $("#cIg").textContent = CONFIG.instagram ? "@" + CONFIG.instagram : "";
  $("#cWa").href = "https://wa.me/" + CONFIG.whatsapp;
  $("#cIgLink").href = "https://instagram.com/" + CONFIG.instagram;
  var realAddr = CONFIG.address && !/^Ajoutez/i.test(CONFIG.address) ? CONFIG.address : "";
  $("#cMap").href = CONFIG.mapUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(realAddr ? CONFIG.name + " " + realAddr : CONFIG.name);
  $("#cMap").hidden = false;
  $("#year").textContent = new Date().getFullYear();
  var dev = CONFIG.developer || {};
  if (dev.name) {
    $("#devName").textContent = dev.name;
    var dl = $("#devLink");
    if (dev.url) { dl.href = dev.url; dl.target = "_blank"; dl.rel = "noopener"; }
    else { dl.removeAttribute("href"); $("#devCta").hidden = true; }
  } else { $("#devBox").hidden = true; }

  // ---------- Démarrage ----------
  Object.keys(ITEMS).forEach(renderCtrl);
  syncTable();
  update();
};
