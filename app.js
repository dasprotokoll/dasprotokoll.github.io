/* Das Protokoll – kleine Helfer. Kein Tracking, keine externen Skripte. */
(function () {
  var d = document, de = d.documentElement;
  de.classList.add('js');
  var azHareket = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menue (Handy) */
  var ust = d.getElementById('ust'), btn = d.querySelector('.menu-dugme');
  if (btn) {
    btn.addEventListener('click', function () {
      var acik = ust.classList.toggle('menu-acik');
      btn.setAttribute('aria-expanded', acik ? 'true' : 'false');
    });
    d.querySelectorAll('.menu a').forEach(function (a) {
      a.addEventListener('click', function () { ust.classList.remove('menu-acik'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* Kopfzeile + Nach-oben-Knopf */
  var yukari = d.querySelector('.yukari'), bekle = false;
  function kaydir() {
    var y = window.scrollY || 0;
    ust.classList.toggle('golge', y > 10);
    if (yukari) yukari.classList.toggle('goster', y > 700);
    bekle = false;
  }
  window.addEventListener('scroll', function () { if (!bekle) { bekle = true; requestAnimationFrame(kaydir); } }, { passive: true });

  /* Einblenden + Zaehler */
  function say(el) {
    var hedef = +el.getAttribute('data-say'), ek = el.getAttribute('data-ek') || '';
    if (azHareket || hedef === 0) { el.textContent = hedef + ek; return; }
    var t0 = null;
    function adim(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1100, 1);
      el.textContent = Math.round(hedef * (1 - Math.pow(1 - p, 3))) + ek;
      if (p < 1) requestAnimationFrame(adim);
    }
    requestAnimationFrame(adim);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (gs) {
      gs.forEach(function (g) {
        if (!g.isIntersecting) return;
        g.target.classList.add('gorundu');
        var b = g.target.querySelector('[data-say]');
        if (b) say(b);
        io.unobserve(g.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('.gorun').forEach(function (el) { io.observe(el); });
  } else {
    d.querySelectorAll('.gorun').forEach(function (el) { el.classList.add('gorundu'); });
    d.querySelectorAll('[data-say]').forEach(say);
  }

  /* Countdown bis zur Zwischenwahl (3. Nov., Wahllokale oeffnen ca. 6 Uhr Ostkueste = 12 Uhr MEZ) */
  var sayac = d.getElementById('sayac'), hedefZ = Date.UTC(2026, 10, 3, 11, 0, 0);
  if (sayac && Date.now() < hedefZ) {
    sayac.hidden = false;
    var alan = {}; sayac.querySelectorAll('[data-s]').forEach(function (b) { alan[b.getAttribute('data-s')] = b; });
    function iki(n) { return n < 10 ? '0' + n : '' + n; }
    function guncelle() {
      var k = Math.max(0, hedefZ - Date.now()) / 1000;
      alan.g.textContent = Math.floor(k / 86400);
      alan.s.textContent = iki(Math.floor(k % 86400 / 3600));
      alan.d.textContent = iki(Math.floor(k % 3600 / 60));
      alan.sn.textContent = iki(Math.floor(k % 60));
      if (k <= 0) sayac.hidden = true;
    }
    guncelle(); setInterval(guncelle, 1000);
  }

  /* Video erst nach Klick laden (youtube-nocookie) */
  d.querySelectorAll('.oynat').forEach(function (o) {
    o.addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + o.getAttribute('data-vid') + '?autoplay=1&rel=0';
      f.title = 'YouTube-Video'; f.referrerPolicy = 'strict-origin-when-cross-origin'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      var kutu = d.createElement('div'); kutu.className = 'oynat oynuyor';
      kutu.appendChild(f); o.replaceWith(kutu);
    }, { once: true });
  });

  /* Themenfilter + "Mehr anzeigen" */
  var liste = d.getElementById('liste'), daha = d.getElementById('daha'), bos = d.getElementById('bos');
  if (liste) {
    var kartlar = [].slice.call(liste.querySelectorAll('.folge')), filtre = 'alle', acik = false, ILK = 6;
    function goster() {
      var uyan = kartlar.filter(function (k) { return filtre === 'alle' || k.getAttribute('data-t') === filtre; });
      kartlar.forEach(function (k) { k.classList.add('gizli'); });
      uyan.forEach(function (k, i) { if (acik || i < ILK) { k.classList.remove('gizli'); k.classList.add('gorundu'); } });
      daha.hidden = acik || uyan.length <= ILK;
      bos.hidden = uyan.length > 0;
    }
    d.querySelectorAll('.filtre button').forEach(function (b) {
      b.addEventListener('click', function () {
        d.querySelectorAll('.filtre button').forEach(function (x) { x.classList.remove('aktif'); });
        b.classList.add('aktif'); filtre = b.getAttribute('data-f'); goster();
      });
    });
    daha.addEventListener('click', function () { acik = true; goster(); });
    goster();
  }
})();
