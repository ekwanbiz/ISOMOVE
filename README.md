# ISOMOVE

App pembelajaran **Transformasi Isometri** (Matematik Tingkatan 2, Bab 11): Translasi, Pantulan dan Putaran.

- 📱 Boleh dipasang di telefon (PWA) dan digunakan **tanpa internet**
- 💻 Susunan bertukar automatik: telefon (navigasi bawah) atau laptop (menu sisi)
- 🎮 Simulasi · 📘 Nota · ✏️ Latihan · 🏆 Kuiz

## Status
- [x] Fasa 1: Kerangka PWA (skrin pembuka, utama, navigasi, cara pasang, offline)
- [x] Fasa 2: Simulasi Translasi, Pantulan, Putaran
- [x] Fasa 3: Nota
- [x] Fasa 4: Latihan interaktif
- [x] Fasa 5: Kuiz

## Struktur fail
| Fail | Fungsi |
|---|---|
| `index.html` | Halaman utama app |
| `css/style.css` | Warna, fon dan susunan (telefon & laptop) |
| `js/app.js` | Semua skrin dan navigasi |
| `manifest.json` | Nama & ikon app untuk dipasang |
| `sw.js` | Membolehkan app berfungsi tanpa internet |
| `icons/`, `fonts/` | Ikon app dan fon |

> Bila mengemas kini app, tukar `VERSION` dalam `sw.js` (contoh `isomove-v2`) supaya telefon murid dapat versi baharu.

Fon: Inter & Space Grotesk (SIL Open Font License, lihat `fonts/`).
