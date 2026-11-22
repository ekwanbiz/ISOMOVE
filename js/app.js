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
        .map(([k, ic, t, d]) => `<a href="simulasi/${k}.html" class="card tile" style="--c:var(--${k})" aria-label="Buka simulasi ${t}"><span class="icon-box">${icon(ic)}</span><span class="tile-txt"><b>${t}</b><small>${d}</small></span><span class="tile-go">${icon('arrow', 16)}</span></a>`).join('');
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
      const READY = { translasi: 'simulasi/translasi.html', pantulan: 'simulasi/pantulan.html', putaran: 'simulasi/putaran.html' };
      const sc = (k, title, desc) => `<section class="card sim-card" style="--c:var(--${k})"><div class="diagram">${DIAG[k]()}</div><h2>${title}</h2><p>${desc}</p>${READY[k]
        ? `<a href="${READY[k]}" class="btn sim-open">Buka Simulasi ${icon('arrow', 18)}</a>`
        : `<span class="badge">${icon('clock', 14)} Akan dimasukkan</span>`}</section>`;
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

    nota() {
      const m = (v) => String(v).replace('-', '−');
      const vec = (a, b) => `<span class="vec" aria-label="vektor ${m(a)}, ${m(b)}"><span>${m(a)}</span><span>${m(b)}</span></span>`;
      const prop = (label, val, ok) => `<li class="prop ${ok ? 'ok' : 'chg'}"><span class="prop-ico">${icon(ok ? 'check' : 'pu', 16)}</span><span><b>${label}</b><small>${val}</small></span></li>`;
      const block = (k, data) => `
        <div class="nota-panel" data-panel="${k}" style="--c:var(--${k})" ${k === 'translasi' ? '' : 'hidden'}>
          <div class="nota-cols">
            <div class="stack">
              <section class="card nota-sec"><h2>Definisi</h2><p>${data.def}</p></section>
              <section class="card nota-sec"><h2>Cara Menyatakan</h2>${data.cara}</section>
              <section class="card nota-sec"><h2>Sifat</h2><ul class="props">${data.sifat}</ul>${data.extra ? `<ul class="bul">${data.extra}</ul>` : ''}</section>
            </div>
            <div class="stack">
              <section class="card nota-sec"><h2>Rajah</h2><div class="diagram">${DIAG[k]()}</div><p class="cap">${data.cap}</p></section>
              <section class="card nota-sec"><h2>Contoh</h2>${data.contoh}</section>
              <section class="card nota-sec warn"><h2>Kesilapan Biasa</h2><ul class="bul">${data.silap}</ul></section>
              <a href="simulasi/${k}.html" class="btn nota-go">Cuba Simulasi ${data.title} ${icon('arrow', 18)}</a>
            </div>
          </div>
        </div>`;
      const T = {
        translasi: {
          title: 'Translasi',
          def: '<b>Translasi</b> ialah pemindahan semua titik pada suatu objek dengan <b>jarak dan arah yang sama</b>.',
          cara: `<p>Translasi diwakili oleh <b>vektor translasi</b>:</p>
            <div class="formula">${vec('a', 'b')}</div>
            <ul class="bul"><li><b>a</b>: gerakan mengufuk (+ ke kanan, − ke kiri)</li><li><b>b</b>: gerakan mencancang (+ ke atas, − ke bawah)</li></ul>
            <p class="eg">Contoh: Translasi ${vec(4, 1)} bermaksud 4 unit ke kanan, 1 unit ke atas.</p>`,
          sifat: prop('Bentuk', 'Sama', true) + prop('Saiz', 'Sama', true) + prop('Orientasi', 'Sama', true),
          cap: "Objek P ditranslasikan 4 unit ke kanan dan 1 unit ke atas kepada imej P′.",
          contoh: `<p class="q">Titik A(2, 3) ditranslasikan oleh ${vec(-4, 5)}. Cari koordinat imej A′.</p>
            <ol class="steps-sol"><li>Tambah <b>a</b> pada koordinat-x: 2 + (−4) = −2</li><li>Tambah <b>b</b> pada koordinat-y: 3 + 5 = 8</li></ol>
            <p class="ans">Jawapan: <b>A′(−2, 8)</b></p>`,
          silap: '<li>Tertukar nilai <b>a</b> dan <b>b</b> dalam vektor.</li><li>Lupa tanda negatif: ke <b>kiri</b> dan ke <b>bawah</b> ialah negatif.</li><li>Mengira petak dari titik objek yang berbeza dengan titik imej yang sepadan.</li>'
        },
        pantulan: {
          title: 'Pantulan',
          def: '<b>Pantulan</b> ialah transformasi yang memantulkan semua titik pada suatu objek pada satu garis yang dipanggil <b>paksi pantulan</b> (garis pantulan).',
          cara: `<p>Nyatakan <b>persamaan garis pantulan</b>:</p>
            <ul class="bul"><li><b>x = a</b>: garis menegak (contoh: x = 4)</li><li><b>y = b</b>: garis mengufuk (contoh: y = −1)</li><li><b>paksi-x</b> (y = 0) atau <b>paksi-y</b> (x = 0)</li><li><b>y = x</b> atau <b>y = −x</b>: garis condong</li></ul>
            <p class="eg">Contoh: Pantulan pada garis x = 4.</p>`,
          sifat: prop('Bentuk', 'Sama', true) + prop('Saiz', 'Sama', true) + prop('Orientasi', 'Songsang (terbalik)', false),
          extra: '<li>Titik dan imejnya berada pada <b>jarak yang sama</b> dari paksi pantulan.</li><li>Garis yang menyambungkan titik dan imejnya <b>berserenjang</b> dengan paksi pantulan.</li><li>Titik pada paksi pantulan <b>tidak berubah</b>.</li>',
          cap: 'Objek P dipantulkan pada garis x = 4 kepada imej P′.',
          contoh: `<p class="q">Titik B(1, 2) dipantulkan pada garis x = 4. Cari koordinat imej B′.</p>
            <ol class="steps-sol"><li>Jarak B ke garis x = 4: 4 − 1 = 3 unit</li><li>B′ berada 3 unit di sebelah lain garis: 4 + 3 = 7</li><li>Koordinat-y tidak berubah kerana garis pantulan menegak.</li></ol>
            <p class="ans">Jawapan: <b>B′(7, 2)</b></p>`,
          silap: '<li>Mengira jarak dari <b>paksi-y</b>, bukan dari garis pantulan.</li><li>Keliru <b>x = a</b> (garis menegak) dengan <b>y = b</b> (garis mengufuk).</li><li>Mengubah koordinat yang sepatutnya kekal.</li>'
        },
        putaran: {
          title: 'Putaran',
          def: '<b>Putaran</b> ialah transformasi yang memutarkan semua titik pada suatu objek pada satu titik tetap (<b>pusat putaran</b>) melalui suatu <b>sudut</b> dan <b>arah</b> tertentu.',
          cara: `<p>Nyatakan <b>3 perkara</b>:</p>
            <ul class="bul"><li><b>Pusat putaran</b>, contoh: (4, 1)</li><li><b>Sudut putaran</b>, contoh: 90°, 180°, 270°</li><li><b>Arah</b>: ikut arah jam ↻ atau lawan arah jam ↺</li></ul>
            <p class="eg">Contoh: Putaran 90° lawan arah jam pada pusat (4, 1).</p>`,
          sifat: prop('Bentuk', 'Sama', true) + prop('Saiz', 'Sama', true) + prop('Orientasi', 'Berubah (berpusing, tidak terbalik)', false),
          extra: '<li>Jarak setiap titik dari pusat putaran <b>kekal sama</b>.</li><li>Pusat putaran ialah satu-satunya titik yang <b>tidak berubah</b>.</li><li>90° ikut arah jam = 270° lawan arah jam. Putaran 180° memberi imej yang sama bagi kedua-dua arah.</li>',
          cap: 'Objek P diputarkan 90° lawan arah jam pada pusat C(4, 1) kepada imej P′.',
          contoh: `<p class="q">Titik Q(3, 1) diputarkan 90° lawan arah jam pada asalan O(0, 0). Cari koordinat imej Q′.</p>
            <ol class="steps-sol"><li>Dari O, Q berada 3 unit ke kanan dan 1 unit ke atas.</li><li>Selepas putaran 90° lawan arah jam: 3 unit ke kanan menjadi 3 unit ke <b>atas</b>, 1 unit ke atas menjadi 1 unit ke <b>kiri</b>.</li></ol>
            <p class="ans">Jawapan: <b>Q′(−1, 3)</b></p>`,
          silap: '<li>Keliru <b>ikut arah jam</b> dengan <b>lawan arah jam</b>.</li><li>Lupa menyatakan <b>pusat putaran</b> dalam jawapan.</li><li>Memutarkan pada asalan O walaupun pusat putaran ialah titik lain.</li>'
        }
      };
      const tab = (k, l) => `<button type="button" role="tab" aria-selected="${k === 'translasi'}" data-tab="${k}" style="--c:var(--${k})">${l}</button>`;
      return `
        ${head('Nota', 'Fahami konsep sebelum mencuba simulasi.', 'var(--translasi)')}
        <div class="stack">
          <div class="tabs" role="tablist" aria-label="Pilih transformasi">${tab('translasi', 'Translasi')}${tab('pantulan', 'Pantulan')}${tab('putaran', 'Putaran')}</div>
          ${block('translasi', T.translasi)}${block('pantulan', T.pantulan)}${block('putaran', T.putaran)}
        </div>`;
    },
    latihan: () => Lat.render(),
    kuiz: () => Kuiz.render(),

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

  /* ===================== LATIHAN ===================== */
  const Lat = (() => {
    const TOPICS = { translasi: 'Translasi', pantulan: 'Pantulan', putaran: 'Putaran' };
    const N_Q = 5;
    const XMIN = -6, XMAX = 6, YMIN = -5, YMAX = 5;
    const C = { obj: '#38BDF8', img: '#F472B6', line: '#C084FC', ctr: '#FBBF24', grid: '#1C2A42', axis: '#64748B', num: '#94A3B8', text: '#E6EDF7' };
    const L3 = ['A', 'B', 'C'];

    /* ---- utiliti ---- */
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const m = (v) => String(v).replace('-', '−');
    const pt = (p) => `(${m(p[0])}, ${m(p[1])})`;
    const inRange = (p) => p[0] >= XMIN && p[0] <= XMAX && p[1] >= YMIN && p[1] <= YMAX;
    const allIn = (...sets) => sets.every((s) => s.every(inRange));
    const same = (p, q) => p[0] === q[0] && p[1] === q[1];
    const vec = (a, b) => `<span class="vec"><span>${m(a)}</span><span>${m(b)}</span></span>`;

    /* ---- transformasi ---- */
    const tr = (p, a, b) => [p[0] + a, p[1] + b];
    const refl = (p, ln) => ln.k === 'x' ? [2 * ln.v - p[0], p[1]] : ln.k === 'y' ? [p[0], 2 * ln.v - p[1]] : ln.k === 'd' ? [p[1], p[0]] : [-p[1], -p[0]];
    // sudut ccw: 90, 180, 270
    const rot = (p, c, ang) => {
      const dx = p[0] - c[0], dy = p[1] - c[1];
      const r = ang === 90 ? [-dy, dx] : ang === 180 ? [-dx, -dy] : [dy, -dx];
      return [c[0] + r[0], c[1] + r[1]];
    };
    const lineName = (ln) => ln.k === 'x' ? (ln.v === 0 ? 'paksi-y (x = 0)' : `x = ${m(ln.v)}`) : ln.k === 'y' ? (ln.v === 0 ? 'paksi-x (y = 0)' : `y = ${m(ln.v)}`) : ln.k === 'd' ? 'y = x' : 'y = −x';
    const lineDist = (p, ln) => ln.k === 'x' ? Math.abs(p[0] - ln.v) : ln.k === 'y' ? Math.abs(p[1] - ln.v) : null;
    const rotName = (r) => r.ang === 180 ? '180°' : `90° ${r.dir === 'ccw' ? 'lawan arah jam' : 'ikut arah jam'}`;
    const rotAng = (r) => r.ang === 180 ? 180 : r.dir === 'ccw' ? 90 : 270;

    /* ---- bentuk rawak (segi tiga bersudut tegak tak simetri) ---- */
    const LEGS = [[2, 3], [3, 2], [1, 2], [2, 1], [3, 1], [1, 3]];
    function shape() {
      const [w, h] = pick(LEGS), sx = pick([1, -1]), sy = pick([1, -1]);
      const o = [rnd(XMIN + 3, XMAX - 3), rnd(YMIN + 3, YMAX - 3)];
      return [[o[0], o[1]], [o[0] + w * sx, o[1]], [o[0], o[1] + h * sy]];
    }
    const overlaps = (P, Q) => P.some((p) => Q.some((q) => same(p, q)));

    /* ---- rajah ---- */
    function diagram(o) {
      const U = 26, pad = 18, W = (XMAX - XMIN) * U + pad * 2, H = (YMAX - YMIN) * U + pad * 2;
      const X = (x) => pad + (x - XMIN) * U, Y = (y) => pad + (YMAX - y) * U;
      let s = '';
      for (let x = XMIN; x <= XMAX; x++) s += `<line x1="${X(x)}" y1="${Y(YMIN)}" x2="${X(x)}" y2="${Y(YMAX)}" stroke="${x === 0 ? C.axis : C.grid}" stroke-width="${x === 0 ? 1.6 : 1}"/>`;
      for (let y = YMIN; y <= YMAX; y++) s += `<line x1="${X(XMIN)}" y1="${Y(y)}" x2="${X(XMAX)}" y2="${Y(y)}" stroke="${y === 0 ? C.axis : C.grid}" stroke-width="${y === 0 ? 1.6 : 1}"/>`;
      for (let x = XMIN; x <= XMAX; x++) if (x) s += `<text x="${X(x)}" y="${Y(0) + 13}" fill="${C.num}" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">${m(x)}</text>`;
      for (let y = YMIN; y <= YMAX; y++) if (y) s += `<text x="${X(0) - 5}" y="${Y(y) + 3}" fill="${C.num}" font-size="9" text-anchor="end" font-family="Inter, sans-serif">${m(y)}</text>`;
      s += `<text x="${X(0) - 5}" y="${Y(0) + 13}" fill="${C.num}" font-size="9" text-anchor="end" font-family="Inter, sans-serif">0</text>`;
      if (o.line) {
        const ln = o.line;
        let a, b;
        if (ln.k === 'x') { a = [ln.v, YMIN]; b = [ln.v, YMAX]; }
        else if (ln.k === 'y') { a = [XMIN, ln.v]; b = [XMAX, ln.v]; }
        else if (ln.k === 'd') { a = [YMIN, YMIN]; b = [YMAX, YMAX]; }
        else { a = [-YMAX, YMAX]; b = [-YMIN, YMIN]; }
        s += `<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 6"/>`;
        if (o.lineLabel) s += `<text x="${X(b[0]) + (ln.k === 'x' ? 5 : -4)}" y="${Y(b[1]) + (ln.k === 'x' ? 12 : -5)}" fill="${C.line}" font-size="12" font-weight="700" text-anchor="${ln.k === 'x' ? 'start' : 'end'}" font-family="Inter, sans-serif">${lineName(ln)}</text>`;
      }
      const poly = (P, col, dash, names) => {
        let r = `<polygon points="${P.map((p) => X(p[0]) + ',' + Y(p[1])).join(' ')}" fill="${col}" fill-opacity="0.2" stroke="${col}" stroke-width="2.5" stroke-linejoin="round"${dash ? ' stroke-dasharray="6 4"' : ''}/>`;
        const cx = P.reduce((t, p) => t + p[0], 0) / P.length, cy = P.reduce((t, p) => t + p[1], 0) / P.length;
        P.forEach((p, i) => {
          const dx = p[0] - cx, dy = p[1] - cy, len = Math.hypot(dx, dy) || 1;
          r += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.5" fill="${col}"/>`;
          r += `<text x="${X(p[0]) + dx / len * 13}" y="${Y(p[1]) - dy / len * 13 + 4}" fill="${C.text}" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">${names[i]}</text>`;
        });
        return r;
      };
      if (o.obj) s += poly(o.obj, C.obj, false, L3);
      if (o.img) s += poly(o.img, C.img, true, L3.map((l) => l + '′'));
      (o.points || []).forEach((q) => {
        s += `<circle cx="${X(q.p[0])}" cy="${Y(q.p[1])}" r="5" fill="${q.col}"/>`;
        s += `<text x="${X(q.p[0]) + 8}" y="${Y(q.p[1]) - 7}" fill="${C.text}" font-size="12" font-weight="700" font-family="Inter, sans-serif">${q.label}</text>`;
      });
      if (o.center) {
        s += `<circle cx="${X(o.center[0])}" cy="${Y(o.center[1])}" r="5.5" fill="${C.ctr}" stroke="#0B1220" stroke-width="2"/>`;
        s += `<text x="${X(o.center[0]) + 8}" y="${Y(o.center[1]) + 15}" fill="${C.ctr}" font-size="12" font-weight="700" font-family="Inter, sans-serif">${o.centerLabel || 'C'}</text>`;
      }
      return `<svg width="100%" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria || 'Rajah pada grid'}" style="display:block">${s}</svg>`;
    }

    /* ---- penjana soalan ---- */
    function tryGen(fn) { for (let i = 0; i < 400; i++) { const q = fn(); if (q) return q; } return null; }

    // MUDAH: kenal pasti jenis transformasi
    function genMudah(topic) {
      const type = Math.random() < 0.5 ? topic : pick(Object.keys(TOPICS).filter((t) => t !== topic));
      return tryGen(() => {
        const P = shape();
        let Q, why;
        if (type === 'translasi') {
          const a = rnd(-5, 5), b = rnd(-4, 4);
          if (!a && !b) return null;
          Q = P.map((p) => tr(p, a, b));
          why = `Imej tidak terbalik dan tidak berpusing. Semua bucu bergerak sama jarak dan arah, iaitu translasi ${vec(a, b)}.`;
        } else if (type === 'pantulan') {
          const ln = pick([{ k: 'x', v: rnd(-2, 2) }, { k: 'y', v: rnd(-2, 2) }, { k: 'd' }, { k: 'n' }]);
          Q = P.map((p) => refl(p, ln));
          why = `Imej <b>terbalik</b> (orientasi songsang). Ini ialah pantulan pada garis <b>${lineName(ln)}</b>.`;
        } else {
          const c = [rnd(-2, 2), rnd(-2, 2)], ang = pick([90, 180, 270]);
          Q = P.map((p) => rot(p, c, ang));
          const r = ang === 180 ? { ang: 180 } : { ang: 90, dir: ang === 90 ? 'ccw' : 'cw' };
          why = `Imej <b>berpusing</b> tetapi tidak terbalik. Ini ialah putaran <b>${rotName(r)}</b> pada pusat <b>${pt(c)}</b>.`;
        }
        if (!allIn(P, Q) || overlaps(P, Q)) return null;
        return {
          kind: 'mcq',
          prompt: 'Rajah menunjukkan objek <b>ABC</b> dan imejnya <b>A′B′C′</b>. Apakah transformasi yang terlibat?',
          svg: diagram({ obj: P, img: Q, aria: 'Objek ABC dan imej A′B′C′' }),
          options: ['Translasi', 'Pantulan', 'Putaran'],
          answer: TOPICS[type],
          hint: 'Bandingkan objek dengan imej. Adakah imej <b>terbalik</b>? Adakah imej <b>berpusing</b>? Atau hanya <b>beralih</b> tempat?',
          solution: `<p>Jawapan: <b>${TOPICS[type]}</b></p><p>${why}</p>`
        };
      });
    }

    // SEDERHANA: cari koordinat imej satu titik
    function genSederhana(topic) {
      return tryGen(() => {
        const A = [rnd(-5, 5), rnd(-4, 4)];
        if (topic === 'translasi') {
          const a = rnd(-5, 5), b = rnd(-4, 4);
          if (!a || !b) return null;
          const B = tr(A, a, b);
          if (!inRange(B)) return null;
          return {
            kind: 'coord',
            prompt: `Titik <b>A${pt(A)}</b> ditranslasikan oleh ${vec(a, b)}. Nyatakan koordinat imej <b>A′</b>.`,
            svg: diagram({ points: [{ p: A, col: C.obj, label: 'A' }], aria: 'Titik A pada grid' }),
            answer: B,
            hint: 'Tambah <b>a</b> pada koordinat-x dan tambah <b>b</b> pada koordinat-y.',
            solution: `<ol class="steps-sol"><li>x′ = ${m(A[0])} + (${m(a)}) = ${m(B[0])}</li><li>y′ = ${m(A[1])} + (${m(b)}) = ${m(B[1])}</li></ol><p>Jawapan: <b>A′${pt(B)}</b></p>`,
            reveal: diagram({ points: [{ p: A, col: C.obj, label: 'A' }, { p: B, col: C.img, label: 'A′' }] })
          };
        }
        if (topic === 'pantulan') {
          const ln = pick([{ k: 'x', v: rnd(-3, 3) }, { k: 'y', v: rnd(-3, 3) }, { k: 'x', v: 0 }, { k: 'y', v: 0 }, { k: 'd' }]);
          const B = refl(A, ln);
          if (!inRange(B) || same(A, B)) return null;
          const d = lineDist(A, ln);
          let steps;
          if (ln.k === 'x') steps = `<li>Jarak A ke garis ${lineName(ln)}: ${d} unit</li><li>Imej berada ${d} unit di sebelah lain: x′ = ${m(B[0])}</li><li>Koordinat-y tidak berubah: y′ = ${m(B[1])}</li>`;
          else if (ln.k === 'y') steps = `<li>Jarak A ke garis ${lineName(ln)}: ${d} unit</li><li>Imej berada ${d} unit di sebelah lain: y′ = ${m(B[1])}</li><li>Koordinat-x tidak berubah: x′ = ${m(B[0])}</li>`;
          else steps = `<li>Pantulan pada garis y = x menukar tempat koordinat-x dan koordinat-y.</li><li>${pt(A)} → ${pt(B)}</li>`;
          return {
            kind: 'coord',
            prompt: `Titik <b>A${pt(A)}</b> dipantulkan pada garis <b>${lineName(ln)}</b>. Nyatakan koordinat imej <b>A′</b>.`,
            svg: diagram({ points: [{ p: A, col: C.obj, label: 'A' }], line: ln, lineLabel: true, aria: 'Titik A dan garis pantulan' }),
            answer: B,
            hint: 'Kira jarak titik A ke garis pantulan. Imej A′ berada pada jarak yang sama di sebelah lain garis.',
            solution: `<ol class="steps-sol">${steps}</ol><p>Jawapan: <b>A′${pt(B)}</b></p>`,
            reveal: diagram({ points: [{ p: A, col: C.obj, label: 'A' }, { p: B, col: C.img, label: 'A′' }], line: ln, lineLabel: true })
          };
        }
        // putaran
        const c = pick([[0, 0], [0, 0], [rnd(-2, 2), rnd(-2, 2)]]);
        const r = pick([{ ang: 90, dir: 'ccw' }, { ang: 90, dir: 'cw' }, { ang: 180 }]);
        const B = rot(A, c, rotAng(r));
        if (!inRange(B) || same(A, c)) return null;
        const dx = A[0] - c[0], dy = A[1] - c[1], ex = B[0] - c[0], ey = B[1] - c[1];
        const desc = (x, y) => [x ? `${Math.abs(x)} unit ke ${x > 0 ? 'kanan' : 'kiri'}` : '', y ? `${Math.abs(y)} unit ke ${y > 0 ? 'atas' : 'bawah'}` : ''].filter(Boolean).join(' dan ') || 'di pusat';
        const cName = same(c, [0, 0]) ? 'asalan O(0, 0)' : `pusat ${pt(c)}`;
        return {
          kind: 'coord',
          prompt: `Titik <b>A${pt(A)}</b> diputarkan <b>${rotName(r)}</b> pada <b>${cName}</b>. Nyatakan koordinat imej <b>A′</b>.`,
          svg: diagram({ points: [{ p: A, col: C.obj, label: 'A' }], center: c, centerLabel: same(c, [0, 0]) ? 'O' : 'C', aria: 'Titik A dan pusat putaran' }),
          answer: B,
          hint: 'Lihat kedudukan A dari pusat putaran (kanan/kiri, atas/bawah), kemudian putarkan kedudukan itu.',
          solution: `<ol class="steps-sol"><li>Dari pusat, A berada ${desc(dx, dy)}.</li><li>Selepas putaran ${rotName(r)}, A′ berada ${desc(ex, ey)} dari pusat.</li></ol><p>Jawapan: <b>A′${pt(B)}</b></p>`,
          reveal: diagram({ points: [{ p: A, col: C.obj, label: 'A' }, { p: B, col: C.img, label: 'A′' }], center: c, centerLabel: same(c, [0, 0]) ? 'O' : 'C' })
        };
      });
    }

    // SUKAR: nyatakan transformasi selengkapnya
    function genSukar(topic) {
      return tryGen(() => {
        const P = shape();
        if (topic === 'translasi') {
          const a = rnd(-5, 5), b = rnd(-4, 4);
          if (!a || !b) return null;
          const Q = P.map((p) => tr(p, a, b));
          if (!allIn(P, Q) || overlaps(P, Q)) return null;
          return {
            kind: 'vector',
            prompt: 'Rajah menunjukkan objek <b>ABC</b> dan imejnya <b>A′B′C′</b> di bawah suatu translasi. Nyatakan <b>vektor translasi</b> itu.',
            svg: diagram({ obj: P, img: Q }),
            answer: [a, b],
            hint: 'Pilih satu bucu, contohnya A. Kira berapa unit ke kanan/kiri dan ke atas/bawah untuk sampai ke A′.',
            solution: `<ol class="steps-sol"><li>A${pt(P[0])} → A′${pt(Q[0])}</li><li>Mengufuk: ${m(Q[0][0])} − (${m(P[0][0])}) = ${m(a)}</li><li>Mencancang: ${m(Q[0][1])} − (${m(P[0][1])}) = ${m(b)}</li></ol><p>Jawapan: translasi ${vec(a, b)}</p>`
          };
        }
        if (topic === 'pantulan') {
          const pool = [{ k: 'x', v: -2 }, { k: 'x', v: -1 }, { k: 'x', v: 0 }, { k: 'x', v: 1 }, { k: 'x', v: 2 }, { k: 'y', v: -2 }, { k: 'y', v: -1 }, { k: 'y', v: 0 }, { k: 'y', v: 1 }, { k: 'y', v: 2 }, { k: 'd' }, { k: 'n' }];
          const ln = pick(pool);
          const Q = P.map((p) => refl(p, ln));
          if (!allIn(P, Q) || overlaps(P, Q)) return null;
          const others = shuffle(pool.filter((l) => lineName(l) !== lineName(ln) && !P.map((p) => refl(p, l)).every((q, i) => same(q, Q[i])))).slice(0, 3);
          const mid = [(P[0][0] + Q[0][0]) / 2, (P[0][1] + Q[0][1]) / 2];
          return {
            kind: 'mcq',
            prompt: 'Rajah menunjukkan objek <b>ABC</b> dan imejnya <b>A′B′C′</b> di bawah suatu pantulan. Nyatakan <b>garis pantulan</b> itu.',
            svg: diagram({ obj: P, img: Q }),
            options: shuffle([ln, ...others].map(lineName)),
            answer: lineName(ln),
            hint: 'Garis pantulan berada <b>di tengah-tengah</b> antara setiap bucu dan imejnya.',
            solution: `<ol class="steps-sol"><li>A${pt(P[0])} dan A′${pt(Q[0])}: titik tengahnya ialah ${pt(mid.map((v) => Math.round(v * 10) / 10))}.</li><li>Semua titik tengah bucu dan imejnya terletak pada garis <b>${lineName(ln)}</b>.</li></ol><p>Jawapan: pantulan pada garis <b>${lineName(ln)}</b></p>`,
            reveal: diagram({ obj: P, img: Q, line: ln, lineLabel: true })
          };
        }
        // putaran
        const c = [rnd(-2, 2), rnd(-2, 2)];
        const r = pick([{ ang: 90, dir: 'ccw' }, { ang: 90, dir: 'cw' }, { ang: 180 }]);
        const Q = P.map((p) => rot(p, c, rotAng(r)));
        if (!allIn(P, Q) || overlaps(P, Q) || P.some((p) => same(p, c))) return null;
        const label = (rr, cc) => `Putaran ${rotName(rr)} pada pusat ${pt(cc)}`;
        const wrongC = pick([[c[0] + 1, c[1]], [c[0] - 1, c[1]], [c[0], c[1] + 1], [c[0], c[1] - 1]]);
        const otherR = r.ang === 180 ? [{ ang: 90, dir: 'ccw' }, { ang: 90, dir: 'cw' }] : [{ ang: 90, dir: r.dir === 'ccw' ? 'cw' : 'ccw' }, { ang: 180 }];
        const opts = [label(r, c), label(otherR[0], c), label(otherR[1], c), label(r, wrongC)];
        return {
          kind: 'mcq',
          prompt: 'Rajah menunjukkan objek <b>ABC</b> dan imejnya <b>A′B′C′</b> di bawah suatu putaran pada pusat <b>C</b>. Huraikan putaran itu selengkapnya.',
          svg: diagram({ obj: P, img: Q, center: c, centerLabel: 'C' }),
          options: shuffle(opts),
          answer: opts[0],
          hint: 'Baca koordinat pusat C pada grid. Kemudian bayangkan garis dari C ke A dan dari C ke A′: berapakah sudut di antaranya, dan ke arah mana?',
          solution: `<ol class="steps-sol"><li>Pusat putaran: C${pt(c)}</li><li>A${pt(P[0])} → A′${pt(Q[0])}: berpusing <b>${rotName(r)}</b> mengelilingi C.</li></ol><p>Jawapan: <b>${opts[0]}</b></p>`
        };
      });
    }

    const GEN = { mudah: genMudah, sederhana: genSederhana, sukar: genSukar };

    /* ---- keadaan sesi ---- */
    let s = { screen: 'menu', topic: null, level: null, qs: [], i: 0, score: 0, sel: null, checked: false, ok: false, hint: false, val: ['', ''] };

    // 80% soalan mudah (4 daripada 5), 1 soalan sederhana/sukar pada kedudukan rawak
    function start(topic) {
      const levels = shuffle(['mudah', 'mudah', 'mudah', 'mudah', pick(['sederhana', 'sukar'])]);
      const qs = levels.map((lv) => GEN[lv](topic));
      s = { screen: 'quiz', topic, qs, i: 0, score: 0, sel: null, checked: false, ok: false, hint: false, val: ['', ''] };
    }

    function best(topic) { const b = (state.latBest || {})[topic]; return typeof b === 'number' ? b : undefined; }
    function passed(topic) { return (state.latPass || {})[topic] || 0; }
    function finish() {
      state.latBest = state.latBest || {};
      state.latPass = state.latPass || {};
      state.latBest[s.topic] = Math.max(best(s.topic) || 0, s.score);
      if (s.score >= 3) state.latPass[s.topic] = passed(s.topic) + 1;
      state.progress[s.topic] = Math.min(3, passed(s.topic));
      save(state);
      s.screen = 'done';
    }

    /* ---- paparan ---- */
    function renderMenu() {
      const card = (k) => {
        const b = best(k), n = passed(k);
        return `<section class="card lat-topic" style="--c:var(--${k})"><div class="lat-topic-head"><span class="icon-box">${icon(k === 'translasi' ? 'tr' : k === 'pantulan' ? 'pa' : 'pu', 24)}</span><div><h2>${TOPICS[k]}</h2><p>${b === undefined ? 'Belum dicuba' : `Terbaik: ${b}/${N_Q} · Set lulus: ${n}`}</p></div></div><button type="button" class="btn lat-start" data-lat="start" data-topic="${k}">Mula Latihan ${icon('arrow', 18)}</button></section>`;
      };
      return `
        ${head('Latihan', 'Pilih topik. Setiap set ada 5 soalan rawak.', 'var(--amber)', `<span class="pill pill-star">${icon('star', 16)} ${state.stars}</span>`)}
        <div class="stack">
          <div class="lat-grid">${card('translasi')}${card('pantulan')}${card('putaran')}</div>
          <div class="notice notice-amber"><span class="ico">${icon('star')}</span><p>Setiap jawapan betul memberi <b>1 bintang</b>. Dapatkan sekurang-kurangnya <b>3/5</b> untuk lulus satu set.</p></div>
        </div>`;
    }

    function renderQuiz() {
      const q = s.qs[s.i];
      let answer = '';
      if (q.kind === 'mcq') {
        answer = `<div class="opts${q.options.length > 3 ? ' opts-col' : ''}">${q.options.map((o, i) => {
          let cls = '';
          if (s.checked) { if (o === q.answer) cls = ' right'; else if (i === s.sel) cls = ' wrong'; }
          else if (i === s.sel) cls = ' sel';
          return `<button type="button" class="opt${cls}" data-lat="sel" data-i="${i}" ${s.checked ? 'disabled' : ''}>${o}</button>`;
        }).join('')}</div>`;
      } else {
        const dis = s.checked ? 'disabled' : '';
        const f = (i, lbl) => `<label class="num-in"><span>${lbl}</span><input type="number" inputmode="numeric" step="1" data-lat-in="${i}" value="${s.val[i]}" ${dis} aria-label="${lbl}"></label>`;
        answer = q.kind === 'coord'
          ? `<div class="ans-row"><b class="ans-lbl">A′ (</b>${f(0, 'x')}<b class="ans-lbl">,</b>${f(1, 'y')}<b class="ans-lbl">)</b></div>`
          : `<div class="ans-row"><span class="vec-in">${f(0, 'a')}${f(1, 'b')}</span></div>`;
      }
      const fb = s.checked
        ? `<section class="feedback ${s.ok ? 'fb-ok' : 'fb-no'}"><h3>${s.ok ? `Betul! ${icon('star', 18)} +1` : 'Belum tepat'}</h3>${q.reveal ? `<div class="diagram">${q.reveal}</div>` : ''}${q.solution}</section>`
        : '';
      const last = s.i === N_Q - 1;
      return `
        <div class="lat-top">
          <button type="button" class="back" data-lat="menu" aria-label="Kembali ke menu latihan">${icon('back')}</button>
          <div class="lat-meta"><span class="eyebrow" style="color:var(--${s.topic})">Latihan · ${TOPICS[s.topic]}</span><b>Soalan ${s.i + 1} / ${N_Q}</b></div>
          <span class="pill pill-star">${icon('star', 16)} ${s.score}</span>
        </div>
        <div class="bar lat-bar"><i style="width:${(s.i + (s.checked ? 1 : 0)) / N_Q * 100}%;background:var(--${s.topic})"></i></div>
        <div class="lat-cols" style="--c:var(--${s.topic})">
          <section class="card lat-q"><p class="q-text">${q.prompt}</p><div class="diagram">${q.svg}</div></section>
          <section class="stack lat-a">
            <h2 class="lat-h">Jawapan anda</h2>
            ${answer}
            ${s.hint && !s.checked ? `<div class="notice notice-amber"><span class="ico">${icon('star')}</span><p><b>Petunjuk:</b> ${q.hint}</p></div>` : ''}
            ${fb}
            <div class="lat-actions">
              ${s.checked
                ? `<button type="button" class="btn btn-primary lat-main" data-lat="next">${last ? 'Lihat Keputusan' : 'Soalan Seterusnya'} ${icon('arrow')}</button>`
                : `<button type="button" class="btn btn-ghost" data-lat="hint" ${s.hint ? 'disabled' : ''}>Petunjuk</button><button type="button" class="btn btn-primary lat-main" data-lat="check">Semak Jawapan</button>`}
            </div>
            <p class="lat-msg" role="status" aria-live="polite"></p>
          </section>
        </div>`;
    }

    function renderDone() {
      const msg = s.score === N_Q ? 'Cemerlang! Semua betul! 🎉' : s.score >= 3 ? 'Bagus! Set ini lulus.' : 'Cuba lagi, anda boleh! 💪';
      return `
        <div class="lat-done card" style="--c:var(--${s.topic})">
          <span class="eyebrow" style="color:var(--${s.topic})">Latihan · ${TOPICS[s.topic]}</span>
          <div class="big-score">${s.score}<small>/ ${N_Q}</small></div>
          <div class="stars-row">${Array.from({ length: N_Q }, (_, i) => `<span class="${i < s.score ? 'on' : ''}">${icon('star', 30)}</span>`).join('')}</div>
          <p class="done-msg">${msg}</p>
          <p class="muted-p">Jumlah bintang anda: <b>${state.stars}</b></p>
          <div class="done-actions">
            <button type="button" class="btn btn-primary" data-lat="start" data-topic="${s.topic}">Ulang Set Baharu</button>
            <button type="button" class="btn btn-ghost" data-lat="menu">Pilih Latihan Lain</button>
          </div>
        </div>`;
    }

    function render() { return s.screen === 'quiz' ? renderQuiz() : s.screen === 'done' ? renderDone() : renderMenu(); }

    function rerender(top) {
      const view = document.getElementById('view');
      view.innerHTML = render();
      if (top) window.scrollTo(0, 0);
    }

    function check() {
      const q = s.qs[s.i];
      const msg = document.querySelector('.lat-msg');
      if (q.kind === 'mcq') {
        if (s.sel === null) { msg.textContent = 'Pilih satu jawapan dahulu.'; return; }
        s.ok = q.options[s.sel] === q.answer;
      } else {
        const v = [...document.querySelectorAll('[data-lat-in]')].map((el) => el.value.trim());
        s.val = v;
        if (v.some((x) => x === '' || !Number.isInteger(Number(x)))) { msg.textContent = 'Isi kedua-dua kotak dengan nombor bulat.'; return; }
        s.ok = Number(v[0]) === q.answer[0] && Number(v[1]) === q.answer[1];
      }
      s.checked = true;
      if (s.ok) { s.score++; state.stars++; save(state); }
      rerender(false);
      const fbEl = document.querySelector('.feedback');
      if (fbEl) fbEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function onClick(e) {
      const el = e.target.closest('[data-lat]');
      if (!el) return false;
      const act = el.dataset.lat;
      if (act === 'start') { start(el.dataset.topic); rerender(true); }
      else if (act === 'menu') { s.screen = 'menu'; rerender(true); }
      else if (act === 'sel' && !s.checked) { s.sel = Number(el.dataset.i); rerender(false); }
      else if (act === 'hint') { s.val = [...document.querySelectorAll('[data-lat-in]')].map((x) => x.value); s.hint = true; rerender(false); }
      else if (act === 'check') check();
      else if (act === 'next') {
        if (s.i >= N_Q - 1) finish();
        else Object.assign(s, { i: s.i + 1, sel: null, checked: false, ok: false, hint: false, val: ['', ''] });
        rerender(true);
      }
      return true;
    }
    function onKey(e) {
      if (e.key === 'Enter' && e.target.matches('[data-lat-in]') && !s.checked) { e.preventDefault(); check(); }
    }
    return { render, onClick, onKey, gen: (t, l) => GEN[l](t), reset: () => { if (s.screen === 'done') s.screen = 'menu'; } };
  })();

  /* ===================== KUIZ ===================== */
  const Kuiz = (() => {
    const N_Q = 10, SECS = 60;
    const TOPIC = { translasi: 'Translasi', pantulan: 'Pantulan', putaran: 'Putaran' };
    const m = (v) => String(v).replace('-', '−');
    const vec = (a, b) => `<span class="vec"><span>${m(a)}</span><span>${m(b)}</span></span>`;
    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    let k = { screen: 'start' };
    let timer = null;

    function plan() {
      // 3 mudah, 4 sederhana, 3 sukar; topik diagih sama rata secara rawak
      const levels = ['mudah', 'mudah', 'mudah', 'sederhana', 'sederhana', 'sederhana', 'sederhana', 'sukar', 'sukar', 'sukar'];
      const pool = ['translasi', 'pantulan', 'putaran'];
      let topics = [];
      while (topics.length < N_Q) topics = topics.concat(pool.slice().sort(() => Math.random() - 0.5));
      topics = topics.slice(0, N_Q).sort(() => Math.random() - 0.5);
      return levels.map((lv, i) => ({ topic: topics[i], level: lv, q: Lat.gen(topics[i], lv) }));
    }

    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
    function startTimer() {
      stopTimer();
      k.left = SECS;
      timer = setInterval(() => {
        k.left--;
        const el = document.querySelector('[data-kz-timer]');
        if (el) {
          el.textContent = k.left;
          const pill = el.closest('.k-timer');
          pill.classList.toggle('low', k.left <= 15);
          pill.classList.toggle('crit', k.left <= 5);
          const bar = document.querySelector('[data-kz-tbar]');
          if (bar) bar.style.width = (k.left / SECS * 100) + '%';
        }
        if (k.left <= 0) { stopTimer(); answer(true); }
      }, 1000);
    }

    function begin() {
      k = { screen: 'quiz', qs: plan(), i: 0, score: 0, sel: null, val: ['', ''], checked: false, ok: false, timedOut: false, left: SECS, t0: Date.now(), by: {} };
      Object.keys(TOPIC).forEach((t) => { k.by[t] = [0, 0]; });
      rerender(true);
      startTimer();
    }

    function answer(timedOut) {
      const item = k.qs[k.i], q = item.q;
      if (!timedOut) {
        const msg = document.querySelector('.lat-msg');
        if (q.kind === 'mcq') {
          if (k.sel === null) { msg.textContent = 'Pilih satu jawapan dahulu.'; return; }
          k.ok = q.options[k.sel] === q.answer;
        } else {
          const v = [...document.querySelectorAll('[data-kz-in]')].map((el) => el.value.trim());
          k.val = v;
          if (v.some((x) => x === '' || !Number.isInteger(Number(x)))) { msg.textContent = 'Isi kedua-dua kotak dengan nombor bulat.'; return; }
          k.ok = Number(v[0]) === q.answer[0] && Number(v[1]) === q.answer[1];
        }
      } else {
        k.val = [...document.querySelectorAll('[data-kz-in]')].map((el) => el.value);
        k.ok = false;
      }
      stopTimer();
      k.checked = true; k.timedOut = !!timedOut;
      k.by[item.topic][1]++;
      if (k.ok) { k.score++; k.by[item.topic][0]++; state.stars++; save(state); }
      rerender(false);
    }

    function next() {
      if (k.i >= N_Q - 1) {
        k.total = Math.round((Date.now() - k.t0) / 1000);
        k.screen = 'done';
        rerender(true);
        return;
      }
      Object.assign(k, { i: k.i + 1, sel: null, val: ['', ''], checked: false, ok: false, timedOut: false });
      rerender(true);
      startTimer();
    }

    const correctText = (q) => q.kind === 'mcq' ? q.answer : q.kind === 'coord' ? `A′(${m(q.answer[0])}, ${m(q.answer[1])})` : `translasi ${vec(q.answer[0], q.answer[1])}`;

    function renderStart() {
      return `
        ${head('Kuiz Pantas', 'Uji kefahaman anda bagi ketiga-tiga transformasi.', 'var(--green)')}
        <div class="k-start">
          <section class="card k-rules">
            <h2>Peraturan</h2>
            <ul class="k-list">
              <li>${icon('check', 18)} <span><b>10 soalan</b> campuran Translasi, Pantulan dan Putaran</span></li>
              <li>${icon('clock', 18)} <span><b>1 minit</b> bagi setiap soalan</span></li>
              <li>${icon('star', 18)} <span><b>1 bintang</b> bagi setiap jawapan betul</span></li>
              <li>${icon('pen', 18)} <span>Tiada petunjuk. Jawapan betul ditunjukkan selepas setiap soalan.</span></li>
            </ul>
            <button type="button" class="btn btn-primary k-go" data-kz="begin">Mula Kuiz ${icon('arrow')}</button>
          </section>
        </div>`;
    }

    function renderQuiz() {
      const item = k.qs[k.i], q = item.q;
      let ans;
      if (q.kind === 'mcq') {
        ans = `<div class="opts${q.options.length > 3 ? ' opts-col' : ''}">${q.options.map((o, i) => {
          let cls = '';
          if (k.checked) { if (o === q.answer) cls = ' right'; else if (i === k.sel) cls = ' wrong'; }
          else if (i === k.sel) cls = ' sel';
          return `<button type="button" class="opt${cls}" data-kz="sel" data-i="${i}" ${k.checked ? 'disabled' : ''}>${o}</button>`;
        }).join('')}</div>`;
      } else {
        const dis = k.checked ? 'disabled' : '';
        const f = (i, lbl) => `<label class="num-in"><span>${lbl}</span><input type="number" inputmode="numeric" step="1" data-kz-in="${i}" value="${k.val[i]}" ${dis} aria-label="${lbl}"></label>`;
        ans = q.kind === 'coord'
          ? `<div class="ans-row"><b class="ans-lbl">A′ (</b>${f(0, 'x')}<b class="ans-lbl">,</b>${f(1, 'y')}<b class="ans-lbl">)</b></div>`
          : `<div class="ans-row"><span class="vec-in">${f(0, 'a')}${f(1, 'b')}</span></div>`;
      }
      const fb = k.checked
        ? `<section class="feedback ${k.ok ? 'fb-ok' : 'fb-no'}"><h3>${k.ok ? `Betul! ${icon('star', 18)} +1` : k.timedOut ? 'Masa tamat!' : 'Salah'}</h3>${k.ok ? '' : `<p>Jawapan betul: <b>${correctText(q)}</b></p>`}</section>`
        : '';
      const left = k.checked ? k.left : SECS;
      return `
        <div class="lat-top">
          <div class="lat-meta"><span class="eyebrow" style="color:var(--${item.topic})">Kuiz · ${TOPIC[item.topic]}</span><b>Soalan ${k.i + 1} / ${N_Q}</b></div>
          <span class="pill pill-star">${icon('star', 16)} ${k.score}</span>
          <span class="k-timer${left <= 15 ? ' low' : ''}${left <= 5 ? ' crit' : ''}" aria-label="Masa berbaki">${icon('clock', 18)} <b data-kz-timer>${left}</b>s</span>
        </div>
        <div class="bar lat-bar"><i data-kz-tbar style="width:${left / SECS * 100}%;background:var(--green);transition:width 1s linear"></i></div>
        <div class="k-dots">${k.qs.map((_, i) => `<span class="${i < k.i ? 'done' : i === k.i ? 'now' : ''}"></span>`).join('')}</div>
        <div class="lat-cols" style="--c:var(--${item.topic})">
          <section class="card lat-q"><p class="q-text">${q.prompt}</p><div class="diagram">${q.svg}</div></section>
          <section class="stack lat-a">
            <h2 class="lat-h">Jawapan anda</h2>
            ${ans}
            ${fb}
            <div class="lat-actions">
              ${k.checked
                ? `<button type="button" class="btn btn-primary lat-main" data-kz="next">${k.i === N_Q - 1 ? 'Lihat Keputusan' : 'Soalan Seterusnya'} ${icon('arrow')}</button>`
                : `<button type="button" class="btn btn-primary lat-main" data-kz="check">Hantar Jawapan</button>`}
            </div>
            <p class="lat-msg" role="status" aria-live="polite"></p>
          </section>
        </div>`;
    }

    function renderDone() {
      const pct = k.score / N_Q;
      const msg = k.score === N_Q ? 'Sempurna! Anda pakar transformasi! 🏆' : pct >= 0.8 ? 'Cemerlang! 🎉' : pct >= 0.5 ? 'Bagus! Teruskan usaha.' : 'Jangan putus asa, cuba ulang kaji di Latihan! 💪';
      const rows = Object.keys(TOPIC).filter((t) => k.by[t][1]).map((t) => {
        const [c, n] = k.by[t];
        return `<div class="k-row" style="--c:var(--${t})"><span>${TOPIC[t]}</span><div class="bar"><i style="width:${c / n * 100}%;background:var(--${t})"></i></div><b>${c}/${n}</b></div>`;
      }).join('');
      const weak = Object.keys(TOPIC).filter((t) => k.by[t][1] && k.by[t][0] / k.by[t][1] < 0.5).map((t) => TOPIC[t]);
      return `
        <div class="lat-done card" style="--c:var(--green)">
          <span class="eyebrow" style="color:var(--green)">Keputusan Kuiz</span>
          <div class="big-score">${k.score}<small>/ ${N_Q}</small></div>
          <p class="done-msg">${msg}</p>
          <p class="muted-p">Masa: <b>${fmt(k.total)}</b> · Bintang diperoleh: <b>${k.score}</b> · Jumlah bintang: <b>${state.stars}</b></p>
          <div class="k-break">${rows}</div>
          ${weak.length ? `<div class="notice notice-amber" style="text-align:left"><span class="ico">${icon('pen')}</span><p>Cadangan: ulang kaji <b>${weak.length > 1 ? weak.slice(0, -1).join(', ') + ' dan ' + weak[weak.length - 1] : weak[0]}</b> di bahagian Latihan.</p></div>` : ''}
          <div class="done-actions">
            <button type="button" class="btn btn-primary" data-kz="begin">Cuba Lagi</button>
            <a href="#/latihan" class="btn btn-ghost">Ulang Kaji di Latihan</a>
          </div>
        </div>`;
    }

    function render() { return k.screen === 'quiz' ? renderQuiz() : k.screen === 'done' ? renderDone() : renderStart(); }
    function rerender(top) {
      document.getElementById('view').innerHTML = render();
      if (top) window.scrollTo(0, 0);
    }

    function onClick(e) {
      const el = e.target.closest('[data-kz]');
      if (!el) return false;
      const act = el.dataset.kz;
      if (act === 'begin') begin();
      else if (act === 'sel' && !k.checked) {
        k.sel = Number(el.dataset.i);
        document.querySelectorAll('[data-kz="sel"]').forEach((b, i) => b.classList.toggle('sel', i === k.sel));
      }
      else if (act === 'check') answer(false);
      else if (act === 'next') next();
      return true;
    }
    function onKey(e) { if (e.key === 'Enter' && e.target.matches('[data-kz-in]') && !k.checked) { e.preventDefault(); answer(false); } }
    // dipanggil setiap kali halaman bertukar
    function onRoute(name) {
      if (name !== 'kuiz') { if (k.screen === 'quiz') { stopTimer(); k = { screen: 'start' }; } }
      else if (k.screen === 'done') k = { screen: 'start' };
    }
    return { render, onClick, onKey, onRoute };
  })();

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
    if (name === 'latihan') Lat.reset();
    Kuiz.onRoute(name);
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
    if (Lat.onClick(e)) return;
    if (Kuiz.onClick(e)) return;
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      const box = tab.closest('.stack');
      box.querySelectorAll(':scope > .tabs [data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b === tab)));
      box.querySelectorAll(':scope > [data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
      return;
    }
    if (e.target.closest('[data-install]') && deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => { deferredPrompt = null; document.querySelectorAll('[data-install-box]').forEach((b) => b.classList.remove('show')); });
    }
  });

  document.addEventListener('keydown', (e) => { Lat.onKey(e); Kuiz.onKey(e); });

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
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
        .then((reg) => reg.update())
        .catch(() => { /* abaikan */ });
      // Bila versi baharu app dipasang, muat semula sekali secara automatik
      let reloaded = false;
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController || reloaded) return;
        reloaded = true;
        location.reload();
      });
    });
  }
  window.addEventListener('offline', () => toast('Tiada internet – ISOMOVE masih boleh digunakan.'));

  /* ---------- Mula ---------- */
  save(state);
  renderNav();
  window.addEventListener('hashchange', route);
  route();
})();
