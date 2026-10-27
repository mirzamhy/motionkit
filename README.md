# MotionKit

MotionKit adalah cara Mirza Muhyidin membuat film dengan [Remotion](https://www.remotion.dev): brief menjadi naskah dan storyboard, setiap shot dibangun sebagai scene React, benda reusable disimpan di pustaka aset, lalu hasilnya diperiksa lewat still sebelum video dirender.

Dibuat oleh **Mirza Muhyidin · [@mirzamhy](https://github.com/mirzamhy)**. Panduan untuk agen ada di [skill/motionkit/SKILL.md](skill/motionkit/SKILL.md).

MotionKit memakai satu jalur produksi, **scene mode**. Cerita, sejarah, explainer, promo produk, dan animasi 3D dibuat sebagai shot khusus. Perintah `storyboard` menyiapkan draf, bukan film otomatis.

## Mulai

Butuh Node.js 22 atau lebih baru, npm, `ffmpeg`, dan `ffprobe`. Render pertama mungkin mengunduh Chrome Headless Shell untuk Remotion.

```bash
git clone https://github.com/mirzamhy/motionkit.git
cd motionkit
npm ci
node bin/mk.mjs scene list
```

Jalankan perintah dari root repo. `npm run typecheck` memeriksa TypeScript. Media proyek dan hasil render tidak ikut clone GitHub.

## Alur produksi

1. **Riset.** Simpan fakta per butir beserta sumbernya di `projects/<slug>/facts.md`. Foto acuan dan catatan bentuk benda nyata berada di `refs/` serta `refs.md`. Tandai bagian yang direka.
2. **Naskah dan storyboard.** Buat draf treatment dengan `storyboard`, lengkapi `ISI`, lalu sepakati naskah dan pembagian shot.
3. **Pustaka dulu.** Pilih gaya, cari aset yang tersedia, kemudian bangun dan preview benda yang belum ada. Film memakai `<Aset>` untuk SVG atau `<Aset3D>` di `<ThreeCanvas>`.
4. **Satu proof shot.** Bangun satu shot, typecheck, render beberapa still dengan grid, buka gambarnya, dan perbaiki sebelum melanjutkan.
5. **Review setiap shot.** Periksa contact sheet, frame penuh, bagian kecil lewat `--region`, dan beberapa frame di tengah aksi. Render ulang bagian yang berubah.
6. **Render film.** Jalankan satu render pada satu waktu, periksa sampel MP4, lalu catat gaya, kamera, ritme, aset, dan pelajaran film di `scenes/catatan.ts`.

Panduan rinci: [WORKFLOW.md](docs/scenes/WORKFLOW.md), [CRAFT.md](docs/scenes/CRAFT.md), [ITEMS.md](docs/scenes/ITEMS.md), dan [KIT.md](docs/scenes/KIT.md). `PizzaScene` adalah contoh 14 detik dengan tiga setup kamera; `UnairScene` adalah contoh film sembilan shot dengan voice-over.

### Brief sampai treatment

```bash
node bin/mk.mjs film list
node bin/mk.mjs gaya list
node bin/mk.mjs gaya show ilustrasi
node bin/mk.mjs storyboard "sejarah pelabuhan kota" --format 16:9 --detik 45 --gaya ilustrasi --slug pelabuhan-kota
node bin/mk.mjs aset find perahu
node bin/mk.mjs item find bangunan
node bin/mk.mjs kit find kamera
```

`storyboard` menulis `projects/pelabuhan-kota/treatment.md`. Pilihan gaya didasarkan pada cakupan aset dan catatan film; periksa dan revisi hasilnya. Isi `facts.md`, `refs.md`, dan `script.md` sebelum membuat shot. Jangan memakai `--timpa` pada treatment yang sudah disunting tanpa meninjau isinya.

### Membuat aset

```bash
node bin/mk.mjs aset find mercusuar
node bin/mk.mjs aset prompt mercusuar ilustrasi --target kode
node bin/mk.mjs aset baru mercusuar ilustrasi
node bin/mk.mjs item preview mercusuar-ilustrasi
node bin/mk.mjs aset peta
node bin/mk.mjs gate --no-render
```

`aset prompt` mencetak petunjuk pembuatan; `aset baru` membuat kerangka kode yang masih harus diisi. Nama aset mengikuti `<benda>-<gaya>`. Metadata mencatat dimensi, sumber visual, varian, dan bagian rekaan. `aset peta` memperbarui [PETA.md](docs/aset/PETA.md) secara otomatis.

Untuk GLB atau tekstur eksternal, CLI menyediakan `asset polyhaven`, `asset ambientcg`, `asset note`, `asset check`, dan `asset optimize`. Catat sumber dan lisensi aset. Media khusus satu film berada di `projects/<slug>/public/`.

### Menggambar dan merender scene

Shot disusun dalam `packages/core/src/scenes/`, digabung melalui `Film` di `film.tsx`, lalu didaftarkan di `index.tsx` dan `manifest.ts`. `Film` memberi shot dua waktu: `u` untuk beat yang dapat diselaraskan dengan narasi dan `a` untuk gerak ambient pada waktu nyata. Setiap frame harus dapat dihitung sendiri dalam urutan apa pun.

```bash
npm run typecheck
node bin/mk.mjs scene stills PizzaScene 120,420,700 --grid
node bin/mk.mjs scene stills PizzaScene 420 --grid --region 400,300,300,400
node bin/mk.mjs scene video PizzaScene
```

Still tersimpan di `out/scenes/<Id>/f00000.jpg`; beberapa frame juga menghasilkan `sheet.jpg`. Video berada di `out/scenes/<Id>/<Id>.mp4`. `--grid` menggambar garis komposisi dan `--region` memperbesar bagian yang dinilai. Set `MK_PNG=1` untuk still PNG, `MK_FRAMES=awal-akhir` untuk rentang video, atau `MK_CONCURRENCY` untuk membatasi tab render. `scene audio <Id>` mengganti audio pada MP4 yang sudah ada.

Voice-over ditempatkan di `public/` proyek dan dicatat pada `manifest.ts`. `mk vo-cut <file.mp3>` membantu menemukan jeda rekaman; `mk beats <musik>` membantu melihat onset musik. Film dapat dibuat tanpa VO.

## Struktur repo

| Lokasi | Kegunaan |
|---|---|
| `packages/core/src/scenes/` | Shot, film runner, registry, motion helpers, contoh film |
| `packages/core/src/library/` | Aset 2D/3D yang dapat dipakai ulang per gaya |
| `packages/core/src/styles/` dan `templates/` | Aturan visual dan pola scene |
| `packages/three/` | Model dan geometri 3D |
| `apps/cli/`, `bin/mk.mjs` | Storyboard, pustaka, render, dan gate |
| `docs/scenes/`, `skill/motionkit/` | Metode menggambar dan instruksi agen |
| `projects/` | Naskah, fakta, foto acuan, VO, dan media film lokal; diabaikan Git |
| `out/` | MP4, still, sheet, dan preview lokal; diabaikan Git |
| `references/`, `legacy-worktrees/` | Arsip riset lokal; diabaikan Git |

Clone GitHub baru perlu `npm ci` serta media proyek sendiri untuk merender ulang film yang memakai VO, model, atau tekstur khusus.

## Pemeriksaan

```bash
npm run typecheck
node bin/mk.mjs gate --no-render
node bin/mk.mjs gate --only PizzaScene,UnairScene
```

`gate --no-render` memeriksa pustaka, TypeScript, dan unit test. Gate dengan render membuat still kecil dan laporan di `out/gate/`. Periksa sendiri referensi benda, komposisi, caption, perspektif, kontak tanah, gerak antarframe, dan hasil MP4. Bila shared code berubah, uji lagi `PizzaScene` dan `UnairScene`.

## Lisensi

[MIT License](LICENSE) © 2026 Mirza Muhyidin. Lisensi dan asal setiap aset eksternal dicatat terpisah.
