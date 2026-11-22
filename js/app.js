/* ===== ISOMOVE – app utama (Fasa 1: kerangka) ===== */
(function () {
  'use strict';

  /* ---------- Ikon (SVG garis) ---------- */
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
    book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
    move: '<path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M15 19l-3 3-3-3"/><path d="M19 9l3 3-3 3"/><path d="M2 12h20"/><path d="M12 2v20"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4"/><path d="M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4"/><path d="M8 21h8"/><path d="M10 17h4"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.5h.01"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    tr: '<path d="M4 12h14"/><path d="M13 6l6 6-6 6"/>',
    pa: '<path d="M12 3v18"/><path d="M9 7L4 17h5z"/><path d="M15 7l5 10h-5z"/>',
    pu: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4h-4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
    dots: '<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>',
    share: '<path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>',
    plus: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8"/><path d="M8 12h8"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  const icon = (name, size = 22) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

  /* ---------- Simpanan dalam peranti ---------- */
  const STORE_KEY = 'isomove.v1';
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* abaikan */ }
  }
  const state = Object.assign({ stars: 0, progress: { translasi: 0, pantulan: 0, putaran: 0 } }, load());

  /* ---------- Rajah grid ---------- */
  const COL = { translasi: '#38BDF8', pantulan: '#FB923C', putaran: '#A78BFA', amber: '#FBBF24', text: '#E6EDF7', border: '#22304A' };
  function gridSvg(shapes, label, extra = '') {
    const U = 30, W = 9, H = 6, X = (x) => 12 + x * U, Y = (y) => 12 + (H - y) * U;
    let g = '';
    for (let i = 0; i <= W; i++) g += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(H)}" stroke="${COL.border}"/>`;
    for (let j = 0; j <= H; j++) g += `<line x1="${X(0)}" y1="${Y(j)}" x2="${X(W)}" y2="${Y(j)}" stroke="${COL.border}"/>`;
    const ex = typeof extra === 'function' ? extra(X, Y) : extra;
    const sh = shapes.map(([pts, c, dash, name, lp]) =>
      `<polygon points="${pts.map(([a, b]) => X(a) + ',' + Y(b)).join(' ')}" fill="${c}" fill-opacity="0.22" stroke="${c}" stroke-width="2.5"${dash ? ' stroke-dasharray="6 4"' : ''}/>` +
      `<text x="${X(lp[0])}" y="${Y(lp[1])}" fill="${COL.text}" font-size="14" font-weight="700" font-family="Inter, sans-serif">${name}</text>`).join('');
    return `<svg width="100%" viewBox="0 0 ${X(W) + 12} ${Y(0) + 12}" role="img" aria-label="${label}" style="display:block">${g}${ex}${sh}</svg>`;
  }
  const tri = [[1, 1], [3, 1], [1, 3]];
  const DIAG = {
    translasi: () => gridSvg([[tri, COL.translasi, false, 'P', [1.6, 1.5]], [[[5, 2], [7, 2], [5, 4]], COL.translasi, true, "P'", [5.6, 2.5]]],
      "Translasi segi tiga P kepada P'", (X, Y) => `<line x1="${X(1)}" y1="${Y(1)}" x2="${X(5)}" y2="${Y(2)}" stroke="${COL.amber}" stroke-width="2" stroke-dasharray="4 4"/>`),
    pantulan: () => gridSvg([[tri, COL.pantulan, false, 'P', [1.6, 1.5]], [[[7, 1], [5, 1], [7, 3]], COL.pantulan, true, "P'", [6, 1.5]]],
      'Pantulan segi tiga P pada paksi x = 4', (X, Y) => `<line x1="${X(4)}" y1="${Y(0)}" x2="${X(4)}" y2="${Y(6)}" stroke="${COL.text}" stroke-width="2.5"/><text x="${X(4.15)}" y="${Y(5.4)}" fill="${COL.text}" font-size="12" font-family="Inter, sans-serif">x = 4</text>`),
    putaran: () => gridSvg([[[[5, 1], [7, 1], [5, 2]], COL.putaran, false, 'P', [5.3, 1.25]], [[[4, 2], [4, 4], [3, 2]], COL.putaran, true, "P'", [3.3, 2.6]]],
      'Putaran 90 darjah lawan arah jam pada pusat C(4, 1)', (X, Y) => `<circle cx="${X(4)}" cy="${Y(1)}" r="5" fill="${COL.amber}"/><text x="${X(3.2)}" y="${Y(0.55)}" fill="${COL.amber}" font-size="13" font-weight="700" font-family="Inter, sans-serif">C</text>`)
  };

  /* ---------- Navigasi ---------- */
  const NAV = [
    { route: 'utama', label: 'Utama', icon: 'home' },
    { route: 'nota', label: 'Nota', icon: 'book' },
    { route: 'simulasi', label: 'Simulasi', icon: 'move', special: true },
    { route: 'latihan', label: 'Latihan', icon: 'pen' },
    { route: 'kuiz', label: 'Kuiz', icon: 'trophy' }
  ];
  function renderNav() {
    document.querySelector('.bottom-nav').innerHTML = NAV.map((n) => n.special
      ? `<a href="#/${n.route}" data-route="${n.route}" class="nav-sim" aria-label="${n.label}"><span class="sim-circle">${icon(n.icon, 28)}</span><span>${n.label}</span></a>`
      : `<a href="#/${n.route}" data-route="${n.route}">${icon(n.icon)}<span>${n.label}</span></a>`).join('');
    document.querySelector('.side-nav').innerHTML = NAV.map((n) =>
      `<a href="#/${n.route}" data-route="${n.route}"${n.special ? ' class="nav-sim"' : ''}>${icon(n.icon)}<span>${n.label}</span></a>`).join('');
    document.querySelectorAll('[data-icon]').forEach((el) => { el.outerHTML = icon(el.dataset.icon, 16); });
  }

  /* ---------- Halaman ---------- */
  const head = (title, sub, accent, right = '') =>
    `<header class="page-head" style="--accent:${accent}"><div><span class="eyebrow">ISOMOVE</span><h1>${title}</h1><p>${sub}</p></div>${right}</header>`;

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const VIEWS = {
    splash() {
      const tiles = [['translasi', 'tr', 'Translasi', 'Gerakkan objek dengan vektor'], ['pantulan', 'pa', 'Pantulan', 'Pantulkan pada satu paksi'], ['putaran', 'pu', 'Putaran', 'Putarkan pada satu pusat']]
        .map(([k, ic, t, d]) => `<div class="card tile" style="--c:var(--${k})"><span class="icon-box">${icon(ic)}</span><span><b>${t}</b><small>${d}</small></span></div>`).join('');
      const actions = `
        <a href="#/utama" class="btn btn-primary">Jom Mula! ${icon('arrow')}</a>
        ${isStandalone() ? '' : `<a href="#/pasang" class="btn btn-ghost">${icon('phone', 20)} Cara Pasang di Telefon</a>`}
        <p class="note">${icon('wifi', 16)} Boleh digunakan tanpa internet</p>`;
      return `
      <div class="splash">
        <div class="splash-main">
          <img class="splash-logo" src="icons/logo.svg" alt="Logo ISOMOVE" width="156" height="156">
          <h1>ISO<span>MOVE</span></h1>
          <p class="slogan"><span style="color:var(--translasi)">Gerak.</span> <span style="color:var(--pantulan)">Pantul.</span> <span style="color:var(--putaran)">Putar!</span></p>
          <p class="sub">Transformasi Isometri · Matematik Tingkatan 2 · Bab 11</p>
          <div class="splash-actions splash-desktop-actions">${actions}</div>
        </div>
        <div class="tiles">${tiles}</div>
        <div class="splash-mobile-only"><div class="splash-actions">${actions}</div></div>
      </div>`;
    },

    utama() {
      const p = state.progress;
      const bar = (k, label) => `<div class="progress-item"><div class="label"><b>${label}</b><span>${p[k]}/3</span></div><div class="bar"><i style="width:${Math.round(p[k] / 3 * 100)}%;background:var(--${k})"></i></div></div>`;
      const card = (route, title, desc, ic, c) => `<a href="#/${route}" class="card menu-card" style="--c:${c}"><span class="icon-box">${icon(ic, 26)}</span><span><h2>${title}</h2><p>${desc}</p></span></a>`;
      return `
        ${head('Selamat datang!', 'Jom teroka transformasi isometri.', 'var(--translasi)', `<span class="pill pill-star">${icon('star', 16)} ${state.stars}</span>`)}
        <div class="stack">
          <section class="card stack" style="gap:14px">
            <div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:15px">Kemajuan Saya</h2><span style="font-size:12px;color:var(--muted)">Latihan siap</span></div>
            <div class="progress-row">${bar('translasi', 'Translasi')}${bar('pantulan', 'Pantulan')}${bar('putaran', 'Putaran')}</div>
          </section>
          <div class="menu-grid">
            ${card('nota', 'Nota', 'Konsep & sifat setiap transformasi', 'book', 'var(--translasi)')}
            ${card('simulasi', 'Simulasi', 'Gerakkan bentuk dan lihat imejnya', 'move', 'var(--putaran)')}
            ${card('latihan', 'Latihan', 'Cuba soalan ikut tahap', 'pen', 'var(--amber)')}
            ${card('kuiz', 'Kuiz', 'Uji diri, kumpul bintang', 'trophy', 'var(--green)')}
          </div>
        </div>`;
    },

    simulasi() {
      const sc = (k, title, desc) => `<section class="card sim-card" style="--c:var(--${k})"><div class="diagram">${DIAG[k]()}</div><h2>${title}</h2><p>${desc}</p><span class="badge">${icon('clock', 14)} Akan dimasukkan</span></section>`;
      return `
        ${head('Simulasi', 'Gerakkan objek dan perhatikan imejnya.', 'var(--putaran)')}
        <div class="stack">
          <div class="sim-grid">
            ${sc('translasi', 'Translasi', 'Ubah vektor (a, b) dan lihat objek bergerak.')}
            ${sc('pantulan', 'Pantulan', 'Pilih paksi pantulan dan lihat imej terbalik.')}
            ${sc('putaran', 'Putaran', 'Tetapkan pusat, sudut dan arah putaran.')}
          </div>
        </div>`;
    },

    nota: () => soon('Nota', 'Fahami konsep sebelum mencuba simulasi.', 'var(--translasi)', 'book',
      'Nota Translasi, Pantulan dan Putaran akan dimasukkan di sini.', ['Definisi', 'Rajah pada grid', 'Sifat isometri']),
    latihan: () => soon('Latihan', 'Pilih tahap dan jawab soalan.', 'var(--amber)', 'pen',
      'Latihan interaktif dengan semakan jawapan akan dimasukkan di sini.', ['Mudah', 'Sederhana', 'Sukar']),
    kuiz: () => soon('Kuiz Pantas', 'Uji kefahaman dan kumpul bintang.', 'var(--green)', 'trophy',
      'Kuiz 10 soalan dengan pemasa akan dimasukkan di sini.', ['10 soalan', 'Pemasa', 'Rekod markah']),

    pasang() {
      const step = (n, ic, t, d) => `<li class="card step"><span class="num">${n}</span><span class="txt"><b>${t}</b><span>${d}</span></span><span class="ico">${icon(ic)}</span></li>`;
      const android = [
        step(1, 'globe', 'Buka pautan dalam Chrome', 'Buka pautan ISOMOVE yang cikgu kongsi.'),
        step(2, 'dots', 'Tekan menu ⋮', 'Butang tiga titik di penjuru kanan atas.'),
        step(3, 'plus', 'Pilih “Tambah ke skrin utama”', 'Atau “Pasang aplikasi”, ikut jenis telefon.'),
        step(4, 'check', 'Tekan “Pasang”', 'Ikon ISOMOVE akan muncul di skrin utama.')].join('');
      const iphone = [
        step(1, 'globe', 'Buka pautan dalam Safari', 'Mesti guna Safari, bukan aplikasi lain.'),
        step(2, 'share', 'Tekan butang Kongsi', 'Petak dengan anak panah ke atas, di bahagian bawah skrin.'),
        step(3, 'plus', 'Pilih “Tambah ke Skrin Utama”', 'Skrol ke bawah senarai untuk mencarinya.'),
        step(4, 'check', 'Tekan “Tambah”', 'Di penjuru kanan atas. Ikon ISOMOVE akan muncul.')].join('');
      const ios = isIOS();
      return `
        <div style="max-width:560px;margin:0 auto">
          <a href="#/" class="back" aria-label="Kembali">${icon('back')}</a>
          ${head('Cara Pasang di Telefon', 'Ikut 4 langkah mudah ini. Percuma, tiada Play Store.', 'var(--translasi)')}
          <div class="stack">
            ${isStandalone() ? `<div class="notice notice-green"><span class="ico">${icon('check')}</span><p>ISOMOVE sudah dipasang di peranti ini. 🎉</p></div>` : ''}
            <div class="notice notice-amber install-box${deferredPrompt ? ' show' : ''}" data-install-box>
              <span class="ico">${icon('download')}</span>
              <p style="flex:1">Telefon anda boleh pasang terus.</p>
              <button type="button" class="btn btn-primary" style="min-height:44px;font-size:15px;padding:0 16px" data-install>Pasang</button>
            </div>
            <div class="tabs" role="tablist" aria-label="Jenis telefon">
              <button type="button" role="tab" aria-selected="${!ios}" data-tab="android">Android</button>
              <button type="button" role="tab" aria-selected="${ios}" data-tab="iphone">iPhone</button>
            </div>
            <ol class="steps" data-panel="android" ${ios ? 'hidden' : ''}>${android}</ol>
            <ol class="steps" data-panel="iphone" ${ios ? '' : 'hidden'}>${iphone}</ol>
            <div class="notice notice-green"><span class="ico">${icon('wifi')}</span><p>Selepas dipasang, ISOMOVE boleh dibuka terus dari skrin utama, walaupun <b>tanpa internet</b>.</p></div>
            <a href="#/utama" class="btn btn-primary">Faham, Jom Mula!</a>
          </div>
        </div>`;
    }
  };

  function soon(title, sub, c, ic, msg, chips) {
    return `${head(title, sub, c)}
      <section class="card soon" style="--c:${c}">
        <span class="icon-box">${icon(ic, 34)}</span>
        <h2>Akan datang</h2>
        <p>${msg}</p>
        <ul>${chips.map((t) => `<li>${t}</li>`).join('')}</ul>
      </section>`;
  }

  /* ---------- Penghala (router) ---------- */
  const FULLSCREEN = ['splash', 'pasang'];
  function route() {
    const r = (location.hash.replace(/^#\/?/, '') || 'splash');
    const name = VIEWS[r] ? r : 'splash';
    const view = document.getElementById('view');
    view.innerHTML = VIEWS[name]();
    document.body.classList.toggle('fullscreen', FULLSCREEN.includes(name));
    document.querySelectorAll('[data-nav] a').forEach((a) => {
      const on = a.dataset.route === name;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const titles = { splash: 'ISOMOVE – Transformasi Isometri', utama: 'Utama', nota: 'Nota', simulasi: 'Simulasi', latihan: 'Latihan', kuiz: 'Kuiz', pasang: 'Cara Pasang' };
    document.title = name === 'splash' ? titles.splash : `${titles[name]} · ISOMOVE`;
    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
  }

  /* ---------- Interaksi ---------- */
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      const box = tab.closest('.stack');
      box.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b === tab)));
      box.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
      return;
    }
    if (e.target.closest('[data-install]') && deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => { deferredPrompt = null; document.querySelectorAll('[data-install-box]').forEach((b) => b.classList.remove('show')); });
    }
  });

  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ---------- PWA: pasang & offline ---------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.querySelectorAll('[data-install-box]').forEach((b) => b.classList.add('show'));
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('ISOMOVE berjaya dipasang! 🎉'); });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { /* abaikan */ });
    });
  }
  window.addEventListener('offline', () => toast('Tiada internet – ISOMOVE masih boleh digunakan.'));

  /* ---------- Mula ---------- */
  save(state);
  renderNav();
  window.addEventListener('hashchange', route);
  route();
})();
