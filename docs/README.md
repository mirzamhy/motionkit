# Peta dokumen MotionKit

Baca sesuai jenis pekerjaan. Semua agen mulai dari [AGENTS.md](../AGENTS.md); dokumen di bawah melengkapinya.

## Urutan baca untuk film baru

1. [scenes/WORKFLOW.md](scenes/WORKFLOW.md): urutan kerja dari fakta, referensi, naskah, storyboard, proof shot,
   review still, render, sampai VO, SFX, dan portrait. Tiap langkah punya gerbang (gate).
2. [scenes/TREATMENT.md](scenes/TREATMENT.md): bentuk treatment, yaitu brief, kerangka, lalu blok tiap shot.
3. [scenes/CRAFT.md](scenes/CRAFT.md): cara menggambar supaya tidak terlihat seperti slide, plus tabel kesalahan
   yang sudah pernah terjadi dan daftar periksa tiap lembar still.
4. Panduan sesuai jenis film:
   - [scenes/2D-TOKOH.md](scenes/2D-TOKOH.md): film 2D dengan tokoh, ruangan, atau bangunan. Isinya tokoh tanpa
     wajah, rig, perabot yang diukur dari rig, bangunan solid, peta, transisi, VO multi-suara, dan versi Reels.
   - [scenes/3D.md](scenes/3D.md): film dari aset 3D (`<ThreeCanvas>` + `<Aset3D>`): sumbu, kamera, tiga lapis
     kedalaman.
5. [scenes/KIT.md](scenes/KIT.md) dan [scenes/ITEMS.md](scenes/ITEMS.md): komponen dan benda yang sudah ada.
   Cari dulu (`mk kit find`, `mk item find`) sebelum menulis yang baru.
6. [aset/PETA.md](aset/PETA.md): peta aset per gaya, dibuat otomatis oleh `mk aset peta`. Jangan disunting manual.

## Saat ada keluhan dari pengguna

| Keluhan | Lihat |
|---|---|
| Terlihat seperti PowerPoint, tokoh terlalu sederhana | CRAFT.md |
| Tokoh tanpa kaki, salah duduk, kerudung janggal | 2D-TOKOH.md §1 |
| Perabot terlalu besar, duduknya tidak jelas | 2D-TOKOH.md §2 |
| Perspektif salah, bangunan tidak solid, benda menimpa benda | 2D-TOKOH.md §3 |
| Peta kasar, label tidak terbaca | 2D-TOKOH.md §4, CRAFT.md |
| Transisi tidak terasa | 2D-TOKOH.md §5 |
| VO sempit atau tidak pas, suara sepi | WORKFLOW.md §9 dan §9b |
| Versi HP pecah | 2D-TOKOH.md §8 |
| Kamera 3D di tempat yang salah | 3D.md |

Setiap keluhan baru yang sudah diperbaiki ditambahkan ke tabel kesalahan di dokumen yang cocok, supaya film
berikutnya tidak mengulanginya.

## Lainnya

- [plan.md](plan.md): arah MotionKit dan definisi film selesai.
- [../skill/motionkit/SKILL.md](../skill/motionkit/SKILL.md): panduan ringkas untuk agen.
- [../examples/unair-sejarah/](../examples/unair-sejarah/): contoh lengkap facts, refs, dan script untuk satu film.
