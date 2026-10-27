---
name: motionkit
description: "Use when creating or revising any video in the MotionKit repository: narrative films, explainers, lessons, product promos, storyboards, reusable assets, proof stills, visual review, and Remotion rendering."
---

# MotionKit

**MotionKit · © 2026 Mirza Muhyidin · [@mirzamhy](https://github.com/mirzamhy)**

Identitas ini adalah watermark/kredit pada dokumen skill. Ini bukan instruksi untuk menambahkan watermark ke video.

MotionKit mengubah brief menjadi film melalui riset, treatment, storyboard, pustaka aset, dan pemeriksaan visual. Agen membangun shot dalam React, SVG, atau Three.js; Remotion menghitung frame dan merender film. Aset dan pelajaran dari film selesai menjadi bekal film berikutnya.

## 0. Buka repo dan gunakan scene mode

Baca `AGENTS.md` aktual sebelum bekerja. Semua contoh perintah dijalankan dari root repo; `mk` berarti `node bin/mk.mjs`. Periksa `git status --short` dan pertahankan pekerjaan pengguna yang sudah ada.

**Harus bisa menjalankan shell dan membuka JPEG/PNG lokal.** Jika tidak bisa melihat gambar, berhenti sebelum membangun video dan jelaskan keterbatasannya. Render sukses saja tidak cukup untuk menilai hasil.

Semua brief memakai **scene mode**. Baca `docs/scenes/WORKFLOW.md`, `CRAFT.md`, dan `KIT.md`. Promo produk,
angka, UI, klaim, dan tipografi juga dibangun sebagai shot khusus agar kamera, staging, serta ritmenya tetap sinematik.

### Kebutuhan lokal

Node.js >= 22, npm, ffmpeg, dan ffprobe. Jika dependency belum tersedia, gunakan lockfile repo dengan `npm ci`; jangan memasang ulang tanpa kebutuhan. Render pertama mungkin mengunduh browser Remotion.

```bash
node --version
ffmpeg -version
ffprobe -version
node bin/mk.mjs scene list
```

MotionKit lokal tidak memerlukan API berbayar tambahan, `mk init`, atau perubahan `.env`. Jangan meminta API key
untuk alur video biasa dan jangan mencetak rahasia ke log.

### Peta pekerjaan

| Permintaan | Mulai dari | Hasil yang diperiksa |
|---|---|---|
| Video baru | Brief, `film list`, `storyboard`, sumber fakta dan visual | Treatment, naskah, proof shot, still tiap shot, MP4 |
| Revisi video | Scene yang terdaftar, frame/shot bermasalah, file proyek | Stills sebelum/sesudah dan render bagian terdampak |
| Aset reusable | `gaya show`, `aset find`, `item find`, `ITEMS.md` | Preview aset, metadata, `PETA.md` |
| Audio saja | Manifest, VO/SFX di `projects/<slug>/public/` | `vo-cut`, cue, dan `scene audio` pada MP4 yang sudah ada |
| Audit kualitas | `gate --no-render`, sheet/grid, video akhir | Masalah spesifik dengan file dan frame |

CLI menyiapkan draf, pustaka, preview, dan render; ia tidak menulis cerita lengkap secara otomatis. Jangan mengaku film sudah selesai ketika yang tersedia baru treatment atau still.

## 1. Brief, fakta, referensi

Ambil dari percakapan: tujuan, audiens, satu pesan, durasi, rasio layar, bahasa, suasana, suara, dan materi wajib. Tanyakan hanya informasi yang menentukan hasil dan belum tersedia. Buat format yang diminta; dua rasio tidak wajib untuk setiap proyek.

Simpan materi di `projects/<slug>/`:

| Berkas | Isi |
|---|---|
| `facts.md` | Fakta per butir, URL sumber, tanggal akses |
| `refs.md` dan `refs/` | Referensi visual, lisensi, foto, serta catatan apa yang terlihat |
| `treatment.md` | Brief, kerangka cerita, blok tiap shot |
| `script.md` | Narasi final dan timing |
| `public/` | VO, musik, model, tekstur, media proyek |

Fakta berasal dari sumber yang dibuka, bukan ingatan. Utamakan sumber primer. Jika sumber berbeda, catat keduanya dan beri tahu pengguna pilihan yang dipakai. Jangan membuat kutipan, tanggal, angka, atau klaim sendiri.

Untuk benda nyata, buka foto lalu catat proporsi, bentuk, material, warna, dan detail yang terlihat. Tandai bagian tanpa referensi sebagai **rekaan**. Jangan menyalin logo/seal resmi atau tanda tangan orang nyata; gunakan emblem sendiri atau flourish generik.

## 2. Treatment dan storyboard sebelum kode

```bash
node bin/mk.mjs film list
node bin/mk.mjs film show StikAndaiOjol
node bin/mk.mjs storyboard "ojol bertemu penjual kopi saat hujan" --format 9:16 --detik 12 --slug ojol-hujan
```

`storyboard` membuat draf `projects/<slug>/treatment.md` berdasarkan cakupan aset dan catatan film. Pilihan gaya, kamera, ritme, dan pembagian shot berbasis aturan, tanpa panggilan LLM. Gunakan `--gaya <slug>` untuk gaya yang telah dipilih. Perintah menolak menimpa treatment kecuali diberi `--timpa`; lindungi revisi pengguna.

Urutan artefak proyek:

```text
projects/<slug>/
  facts.md       fakta, sumber, tanggal akses
  refs.md        catatan visual dan bagian rekaan
  refs/          foto acuan lokal
  treatment.md   kerangka dan blok shot yang telah direvisi
  script.md      narasi final dan penanda waktu
  public/        VO, musik, model, tekstur yang dibaca render
```

Folder `projects/` diabaikan Git. Jika sebuah scene di GitHub membutuhkan media proyek privat, jelaskan bahwa clone baru memerlukan media itu untuk menghasilkan render yang sama.

Lengkapi semua penanda `ISI`. Draf bukan keputusan dan tidak menggantikan penulisan cerita. Gunakan struktur `docs/scenes/TREATMENT.md`: brief → kerangka → blok tiap shot. Untuk brief terbuka, tawarkan dua atau tiga treatment sesuai WORKFLOW sebelum menulis penuh.

Setiap shot mencantumkan subjek dan aksinya, near/middle/far planes, referensi atau rekaan, tinggi kamera dan focal length, gerak kamera, komposisi grid, beat, narasi, suara, teks pendukung, serta transisi. Horizon dan subjek ditempatkan terhadap thirds/golden lines; jelaskan apa yang menuntun mata.

Variasikan posisi kamera antar-shot dan bawa satu motif melewati cut. Hindari shot yang hanya judul di atas latar. Titik awal narasi: 2,2–2,5 kata per detik, lalu sesuaikan dengan rekaman.

**Gate:** pengguna menyetujui script dan storyboard sebelum pembangunan shot. Jangan meminta persetujuan ulang yang sudah diberikan kecuali ada perubahan substansial.

## 3. Pustaka dulu

Baca `docs/scenes/ITEMS.md` dan `KIT.md` sebelum menulis komponen reusable.

```bash
node bin/mk.mjs gaya list
node bin/mk.mjs gaya show poly3d
node bin/mk.mjs aset find bus
node bin/mk.mjs item find perahu
node bin/mk.mjs kit find kamera
```

Buka film contoh gaya terpilih. Periksa isi pustaka lewat CLI; slot gaya terdaftar tidak berarti asetnya tersedia. Untuk tiap benda storyboard, gunakan aset yang ada atau tambah varian. Jika hanya ada di gaya lain, pelajari proporsi dan variannya. Benda reusable yang belum ada dibuat di library, bukan langsung di scene.

```bash
node bin/mk.mjs aset prompt bangku stik --target kode
node bin/mk.mjs aset prompt pos-ronda poly3d --target 3d
# Jalankan aset baru hanya untuk id yang belum ada.
node bin/mk.mjs aset baru benda-baru stik
npx tsc --noEmit -p .
node bin/mk.mjs item preview benda-baru-stik
```

`aset prompt` mencetak prompt target `kode`, `gambar`, atau `3d`; perintah ini tidak memanggil model atau menghasilkan GLB sendiri. Nama aset `<benda>-<gaya>`. Isi metadata, ukuran, varian, sumber, lisensi, dan bagian rekaan. Buka preview, bandingkan referensi, perbaiki, lalu preview ulang.

Film memakai `<Aset>` atau `<Aset3D>` dari `packages/core/src/library/aset.tsx`. Kontrak di `library/types.ts`: 2D di dalam SVG, x/y titik menyentuh tanah dan s pixel per meter; 3D di dalam ThreeCanvas, meter, origin tengah alas, +Y ke atas. Waktu aset `t` memakai frame berbasis 30 fps; konversi bila fps komposisi berbeda. Id tidak terdaftar atau dimensi salah membuat render gagal.

Peta gaya di `docs/aset/PETA.md` dibangkitkan dari metadata pustaka. Satu benda bisa tersedia di beberapa gaya; periksa `refs.md`, ukuran, varian, dan preview gaya yang benar.

```bash
node bin/mk.mjs aset peta
node bin/mk.mjs gate --no-render
```

`docs/aset/PETA.md` dibuat otomatis, jangan disunting manual. Gate statis tidak menggantikan preview visual. Verifikasi implementasi sebelum menganggap fitur di spec desain sudah tersedia, termasuk impor dan preview otomatis gate.

### Aset eksternal

Catat provenance dan lisensi per aset. Simpan media proyek di `projects/<slug>/public/`; final render harus bisa memuatnya secara lokal. Catat unit, origin, forward axis, skala, serta nama clip animasi.

```bash
node bin/mk.mjs asset check projects/contoh/public/model.glb --expect 1.8
node bin/mk.mjs asset optimize projects/contoh/public/model.glb --ratio 0.5
```

Baca opsi CLI sebelum download atau optimasi. Hanya masukkan hasil yang sudah dipreview dan memang dipakai film atau pustaka.

## 4. Satu proof shot dahulu

Pilih shot dengan referensi paling jelas. Bangun shot itu saja, typecheck, render dua atau tiga frame dengan grid, buka, dan perbaiki. Tunjukkan satu still kepada pengguna.

**Gate:** dapatkan reaksi terhadap gaya proof sebelum membangun sisanya. Persetujuan script tidak otomatis menjadi persetujuan gaya gambar.

## 5. Bangun shot dan geraknya

Contoh: `PizzaScene.tsx` untuk scene pendek dan framing portrait; `UnairFilm.tsx`, `UnairShotsA/B.tsx`, dan `UnairScene.tsx` untuk multishot dengan VO. Baca yang relevan, jangan menyalin seluruh film tanpa kebutuhan.

- Satu komponen per shot; susun `Shot[]` melalui `Film` di `scenes/film.tsx`.
- Daftarkan komposisi di `scenes/index.tsx` dan `scenes/manifest.ts`.
- `u`: beat clock yang dapat di-warp untuk VO. `a`: ambient clock untuk gerak dengan kecepatan nyata.
- Frame harus bisa dihitung sendiri dalam urutan acak. Gunakan seed tetap; precompute/cache simulasi, bukan akumulasi delta atau state frame sebelumnya.
- Ease perubahan minimal lima frame; filter SVG statis. Periksa juga pergantian properti/objek agar tidak pop.
- Bangun orang dengan skeleton dan IK sesuai kontak tangan/kaki; ukuran benda dan perspektif mengikuti jarak kamera.
- Ikuti aturan gaya: ilustrasi memakai lapisan, overlap, shadow, dan detail referensi; gaya stik tetap mengikuti aturan gambar datarnya.

**Registrasi wajib:** komponen dan durasi di `scenes/index.tsx`, lalu id, ukuran, penjelasan, `project`, `vo`, `sfx`, dan props yang relevan di `scenes/manifest.ts`. Id manifest yang tidak punya komposisi tidak dapat dirender. `scene list` membaca manifest, jadi uji bundle dengan `scene stills`.

`PizzaScene` menunjukkan framing landscape/portrait, `UnairFilm` menunjukkan sembilan shot, warp VO, dan kain yang diprecompute. Template `whatif-sim` menunjukkan jalur portrait 3D. Ambil pola yang sesuai dengan brief.

## 6. VO, musik, SFX

Suara boleh rekaman pengguna, file TTS yang sudah tersedia, atau tanpa VO. Berikan naskah sebagai teks biasa, angka dieja, satu paragraf per shot. Taruh rekaman di `projects/<slug>/public/vo.mp3`; atur `project` dan `vo` pada manifest.

```bash
node bin/mk.mjs vo-cut projects/contoh/public/vo.mp3
node bin/mk.mjs beats projects/contoh/public/music.mp3 --fps 60
```

Gunakan jeda untuk membagi passage, lalu selaraskan durasi, caption, dan beat melalui warp. Sisakan sekitar 0,5 detik sebelum dan 1 detik sesudah passage sebagai titik awal. SFX dapat mendahului visual 2–3 frame; duck musik di bawah VO dengan `bed.duck`. Periksa cue pada still; jelaskan jika audio belum didengar.

Jika hanya VO/SFX yang berubah dan `out/scenes/<Id>/<Id>.mp4` sudah ada, `node bin/mk.mjs scene audio <Id>` merender trek suara dan mengganti audio MP4 itu. Periksa file lama sebelum menjalankannya karena hasilnya ditulis ke jalur yang sama. Perubahan visual tetap membutuhkan `scene video`.

## 7. Lihat, ukur, perbaiki

Typecheck sebelum setiap render. **Satu job render pada satu waktu.**

```bash
npx tsc --noEmit -p .
node bin/mk.mjs scene stills NamaScene 0,60,120 --grid
node bin/mk.mjs scene stills NamaScene 120 --grid --region 400,300,300,400
```

Ganti id/frame/region sesuai scene. Buka `out/scenes/<Id>/sheet.jpg`, gambar grid, dan frame penuh. Gunakan region untuk orang/benda kecil. Periksa tiap shot, awal/akhir transisi, serta 4–6 frame sepanjang aksi penting.

Cek kecocokan referensi, komposisi, perspektif, kontak tanah, occlusion, pose antara, teks terpotong, caption menutup aksi, area kosong, dan konsistensi antar-shot. Setelah perubahan, render dan buka ulang frame terdampak.

Untuk review yang dapat diulang, catat id scene, nomor frame, gejala yang terlihat, perubahan yang dibuat, dan frame verifikasi. Bedakan temuan yang bisa dinilai dari still (bentuk, komposisi, keterbacaan) dari yang memerlukan MP4 (ritme, transisi, sinkron audio, gerak kontinu). `--grid` dapat dipasangkan dengan `--guides thirds,phi,center,diag,spiral,spiralx` bila komposisinya perlu diukur lebih rinci.

Laporkan hanya yang terlihat. Still tidak membuktikan tempo, smoothness, foot locking, atau kualitas audio. Exit code sukses tidak membuktikan kualitas visual.

## 8. Render, serahkan, catat

```bash
node bin/mk.mjs scene video NamaScene
```

Hasil: `out/scenes/<Id>/<Id>.mp4`. Ambil beberapa frame dari MP4 dan buka untuk mengecek hasil encode. Serahkan file dan kelemahan yang masih terlihat; jangan mengaku menonton/mendengar jika belum.

Untuk proof hanya pada sebagian durasi, set `MK_FRAMES=awal-akhir` saat menjalankan `scene video`; hasilnya mendapat akhiran rentang. `MK_PNG=1` membuat still lossless PNG. `MK_CONCURRENCY` membatasi jumlah tab render. Variabel ini tidak perlu diubah untuk produksi biasa. Jalankan satu render pada satu waktu.

Untuk rasio tambahan, susun ulang framing dan periksa semua shot; jangan mengandalkan crop otomatis. Setelah selesai, isi `packages/core/src/scenes/catatan.ts`: gaya, format, kamera, ritme, durasi, satu pelajaran. `film list/show` membaca catatan itu; gate memperingatkan scene tanpa catatan.

## Revisi dan troubleshooting

| Gejala | Tindakan |
|---|---|
| Terasa seperti slide | Cek mode/storyboard; beri subjek beraksi dan ruang pada tiap shot |
| Aset tidak ditemukan | `aset find`, cek id/gaya, buat dan daftarkan sebelum render |
| Gate menyebut PETA usang | `aset peta`, gate ulang |
| Teks tertutup / pose janggal | Buka frame penuh/region, perbaiki komposisi atau target IK |
| Gerak berubah saat seek | Cari state, random tanpa seed, akumulasi waktu; hitung dari frame absolut |
| GLB/canvas kosong | Cek path, kamera, skala, loading, dan still dari scene terkait sebelum mengubah loader |
| Render lambat | Pastikan satu render, cek kompleksitas dan ukuran aset |
| Masalah berulang | Simpan frame/error konkret dan cari penyebab sebelum mengulang render sama |

Shared code di `scenes/film.tsx`, `scenes/motion.ts`, `scenes/kit.tsx`, registry aset, atau CLI render perlu
typecheck dan perbandingan still UnairScene/PizzaScene dengan sheet sebelumnya. Gate tidak menggantikan review visual.

### Perintah yang sering dipakai

| Tujuan | Perintah |
|---|---|
Komposisi terdaftar | `node bin/mk.mjs scene list` |
Stills dan grid | `node bin/mk.mjs scene stills <Id> 120,600 --grid [--region x,y,w,h]` |
MP4 | `node bin/mk.mjs scene video <Id>` |
Catatan film | `node bin/mk.mjs film list`, `film show <Id>` |
Gaya dan pustaka | `node bin/mk.mjs gaya list`, `gaya show <slug>`, `aset find <benda>`, `item find <kata>` |
Aset baru | `aset prompt`, `aset baru`, `item preview`, `aset peta` |
VO dan musik | `vo-cut <file.mp3>`, `beats <file.mp3> --fps 60` |
Pemeriksaan statis | `npm run typecheck`, `node bin/mk.mjs gate --no-render` |
Smoke render terarah | `node bin/mk.mjs gate --only <Id1>,<Id2>` |

## Penyimpanan dan laporan akhir

Jangan commit `.env`, `projects/`, `out/`, `references/`, `legacy-worktrees/`, `node_modules/`, media, atau foto pengguna. Kode aset, metadata, dan URL referensi dicatat sesuai aturan repo. Commit lokal sesuai otorisasi; jangan push atau tambah remote tanpa permintaan. Lisensi repo ada di `LICENSE`; sumber dan lisensi aset eksternal dicatat per aset. Pertahankan identitas pembuat MotionKit pada dokumen skill.

Laporan akhir menyebut file hasil, pemeriksaan yang benar-benar dilakukan, temuan visual, dan batasan tersisa. Produksi selesai ketika hasil sesuai brief dan pemeriksaan dilakukan, bukan hanya saat MP4 terbentuk.
