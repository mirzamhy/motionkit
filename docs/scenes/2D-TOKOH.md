# Film 2D bertokoh: rig, ruang, bangunan, dan hal yang sudah dikoreksi pengguna

Dokumen ini dikumpulkan dari evaluasi pengguna selama pembuatan *Janji yang Belum Selesai* (2026, 10 adegan,
`packages/core/src/scenes/janji/`). Baca sebelum membuat film 2D dengan tokoh, ruangan, atau bangunan. Bagian
"Kesalahan yang sudah terjadi" adalah daftar periksa: cek tiap butir di setiap lembar still.

Alat bantunya ada di pustaka (`packages/core/src/library/tokoh-2d/`, gaya `tokoh`, lihat KIT.md): rig, preset
tokoh, kamera 3D, balok solid, rumah, perabot. Rig adalah alat bantu; tokoh tiap film dibuat dari preset lalu
disesuaikan dengan kebutuhan film. Aset yang dibangun untuk film masuk pustaka juga (orang, benda, rumah), supaya
film berikutnya mulai dari sana.

Kode adegan film tidak disimpan di repo. Contoh pemakaian ada di salinan lokal (bila ada):
- `janji/tokoh.ts`: rig tokoh (`figure`, `arm`, `leg`, `pelvis`, `RIG`, `LEGPOSE`, `walkLegs`).
- `janji/kamera.ts`: kamera 3D sederhana untuk ruangan 2D (`makeCam`: `pj`, `quad`, `poly`, `line3`, `put`).
- `janji/Adegan1.tsx`: kelas dengan perabot yang diukur dari rig.
- `janji/Adegan7.tsx`: ruang tamu dengan lantai dipecah per pita z (`stripsZ`).
- `janji/vo.ts`: VO tiga suara dipotong per kalimat, durasi shot dan caption diatur ulang.
- `janji/Reels.tsx`: versi 9:16 dari film 16:9.

## 1. Tokoh

- **Tanpa mata dan hidung.** Pengguna muslim dan tidak mau tokoh menyerupai makhluk hidup. Wajah polos; yang boleh
  hanya mulut (`mouth: 'open' | 'tight'`). Jangan menambah mata, alis, atau hidung, juga di figuran.
- **Varian, bukan satu tokoh diulang.** Teman sekelas, pemuda, dan pemudi butuh banyak variasi: warna kulit, rambut,
  peci, kerudung, baju, dan tinggi badan.
- **Kerudung harus menutup kepala dengan wajar**, membingkai wajah dan turun ke bahu. Bentuk kerudung yang terlihat
  seperti topi atau tempelan langsung ditandai "janggal".
- **Tokoh selalu punya kaki dan pantat.** Rig lengkap: paha, betis, dan sepatu. Saat duduk, pantat menapak di
  dudukan. Tokoh yang terpotong di pinggang tanpa alasan kamera dianggap bug.

### Rig

- Tinggi tokoh 520 satuan = 1,6 m (1 m ≈ 325 satuan). Telapak di y = 520, x = 0 adalah garis tengah badan.
- Tampak samping (`view: 'side'`) menghadap +x. Untuk membalik, pakai `flip` di `put` atau `scale(-1 1)` di luar.
- Titik sendi saat berdiri:

  | Sendi | Posisi | Tulang berikutnya |
  |---|---|---|
  | Leher | (0, 150) | kepala |
  | Bahu | (±66, 192) | lengan atas 98, lengan bawah 88 |
  | Pinggang | y 318 | potongan pinggul/pantat |
  | Pinggul | (±28, 326) | paha 96, betis 82, sepatu selalu datar |

- **Sudut** memakai `rotate` SVG. 0 berarti tulang menggantung lurus; nilai positif berputar ke arah −x. Sendi kedua
  (siku, lutut) relatif terhadap tulang pertama. Contoh tampak samping duduk: paha `a1 = −90`, betis `a2 = +90`.
- **Duduk** (`pose: 'sit'`): badan dan kepala turun **95 satuan**. Semua benda yang ditempel ke wajah atau tangan
  tokoh duduk, misalnya masker nebulizer atau HP, harus ikut digeser `translate(0 95)`. Kalau tidak, benda itu
  mendarat di dahi.
- **Mulut**: tampak samping di sekitar (58, 128), tampak depan di y ≈ 128.
- **Lapisan**: bila ada benda di antara kaki dan badan, pecah tokoh jadi `part: 'legs'`, lalu dudukan kursi, lalu
  `part: 'body'`, lalu sandaran. Pada tampak depan atau 3/4, lutut digambar sesudah pangkuan karena lebih dekat ke
  kamera.
- `armsUnder: true` dipakai untuk tampak belakang dengan tangan ke meja: siku terlihat, lengan bawah tertutup badan.

### Tangan

- **Tangan yang memegang** digambar dengan jari menekuk di sisi benda. Jari lurus terbaca sebagai menunjuk.

## 2. Perabot diukur dari rig, bukan dari ukuran asli

Tokoh berkepala besar, kakinya hanya 190 satuan (≈ 0,58 m). Kursi dan meja ukuran asli akan terlihat raksasa.
- Dudukan kursi: (520 − 448) ≈ 0,22 m. Meja murid setinggi siku saat duduk: ≈ 0,42 m.
- Sandaran kursi: dari dudukan + 0,10 m sampai dudukan + 0,36 m.
- Tokoh duduk diletakkan dengan `put(x, 0, zKursi, 520, figure({ ...pose: 'sit' }))`: telapak di lantai.
- **Yang diduduki harus terbaca.** Pada shot posko, pengguna tidak tahu ibu duduk di meja atau di kursi. Gambar kursi
  yang jelas, misalnya kursi plastik biru, dengan kaki kursi terlihat, dan beri meja sendiri untuk alat.

## 3. Ruangan dan bangunan

- **Perspektif dari kamera 3D, bukan ditebak.** Kelas yang digambar datar dinilai "perspektifnya salah". Pengguna
  membuat sketsa: kamera di belakang kelas, agak tinggi, deretan meja menyusut ke arah papan. Bangun ruangan dalam
  meter dengan `makeCam`, lalu proyeksikan semua titik supaya satu titik hilang berlaku untuk semuanya. Bila
  pengguna mengirim sketsa, ikuti sketsanya.

- **Bangunan harus solid.** Dinding, atap, dan sisi rumah ditutup penuh. Celah atau bidang yang hilang di antara dua
  poligon langsung terlihat sebagai "rumah yang tidak solid". Gambar setiap volume sebagai bidang tertutup, dan
  bidang belakang lebih dulu.
- **Bidang yang sebagian ada di belakang kamera dibuang oleh `makeCam`.** Akibatnya lantai atau dinding yang panjang
  bisa hilang. Pecah bidang panjang jadi pita z (`stripsZ`, langkah 0,5 m).
- **Urutan gambar = urutan kedalaman.** Orang berdiri di baris belakang yang tergambar di atas orang duduk di depannya
  adalah bug. Urutkan semua tokoh dan perabot menurut z (jauh ke dekat) sebelum menggambar. Meja yang "tiba-tiba
  muncul di tengah" biasanya juga salah urutan atau salah z.
- **Ruangan harus tahu fungsinya.** Kramat 106 memang rumah indekos pelajar (Commensalen Huis) sekaligus tempat
  diskusi, jadi kasur di sana benar menurut sejarah. Tapi pengguna tetap bingung "mereka di kamar atau gimana?".
  Bedakan dengan jelas shot kamar indekos dan shot ruang rapat, dan sebut faktanya ke pengguna bila latar asli
  memang tidak lazim.
- **Jangan kosong.** Ruang tamu dengan sedikit benda dan kamera terlalu jauh terasa kosong. Kecilkan ruangan dan isi:
  karpet, tanaman, rak buku, lampu. Bila lebih dari sepertiga frame hanya dinding, geser kamera atau lebarkan
  benda depan (misalnya pintu pada shot over-the-shoulder).
- **Kelas Indonesia**: papan tulis, peta Indonesia di samping papan, foto presiden dan wakil presiden di atas papan
  dengan Garuda Pancasila di tengahnya. Pakai gambar Pancasila yang dipilih pengguna; jangan menggambar ulang
  lambang resmi dari ingatan.
- **Cahaya layar**: cahaya TV digambar di lapisan belakang (dinding dan lantai), bukan di atas layar TV.
- **Teks spanduk dan papan tidak boleh tertutup tokoh.** Geser tokoh atau persingkat teks.

## 4. Peta

- Peta Indonesia di `janji/peta.ts` (`ISLANDS`) di-trace dari gambar peta yang dikirim pengguna, detail sampai teluk
  dan semenanjung. Peta pertama yang digambar kasar langsung dikomentari.
- Titik di peta, misalnya titik api, diletakkan dengan uji titik-dalam-poligon pada pulau yang benar.
- **Benda berlabel harus terbaca sebagai bendanya.** Koper pelajar berlabel MEDAN, SOLO, AMBON digambar sebagai balok
  polos, dan pengguna bertanya "ini apa?". Beri ciri yang membuatnya terbaca: sudut kuningan, tali kulit, gesper,
  pegangan, kartu label. Label tanpa benda yang jelas tidak menjelaskan apa-apa.

## 5. Transisi dan kamera

- **Transisi harus terasa.** Pergantian adegan tanpa hubungan visual dinilai "tidak ada transisi". Pakai *match cut*:
  bentuk di akhir adegan A berubah menjadi bentuk yang sama di awal adegan B, dengan posisi, ketebalan, dan jarak
  yang sama. Contohnya garis tinta di adegan 5 yang menjadi senar biola, lalu zoom keluar ke Supratman di adegan 6.
  Ukur posisinya di kedua sisi.
- **Zoom lanjut melewati transisi.** Bila shot A berakhir dengan zoom masuk, shot B melanjutkan dari zoom itu, bukan
  mulai lagi dari bingkai lebar.
- **Warna mengikuti makna.** Koran dan arsip berwarna sepia. Setelah transisi masuk ke peristiwa (Kongres Pemuda),
  warna kembali penuh, karena yang ditampilkan adalah kejadiannya, bukan arsipnya.
- **Tempo: beri napas, terutama di akhir.** Shot 1 detik di penutup dan layar hitam 2 detik dinilai terlalu cepat.
  Shot penutup minimal 2–2,5 detik. Beri jeda ±1 detik sebelum kalimat terakhir yang penting, dan tahan kartu
  penutup sekitar 5 detik (tanpa warp, supaya teks muncul seperti biasa lalu ditahan). Kartu montase cepat minimal
  ±1 detik.
- **Dialog yang mengulang narasi dibuang.** Bisikan tokoh yang hanya mengulang kalimat narator ("Satu tanah air…")
  dihapus pengguna. Tokoh bicara hanya bila menambah sesuatu.
- **Potongan `snap`** (4 frame, `cuts.tsx`) untuk montase cepat seperti kartu teks Pembukaan UUD dan gambar bukti.
  Dissolve tetap jadi bawaan.

## 6. Footage

- Footage yang dipakai hanya dari sumber yang disetujui pengguna (untuk karhutla: film HyperFrames
  `hf-compare/out-karhutla-film-v2.mp4`).
- Ekstrak frame JPG 30 fps ke public dir proyek, lalu tampilkan lewat `<foreignObject>` + `<Img>`; pada film 60 fps
  pakai frame `1 + floor(u / 2)`. Pilih potongan (crop) yang bersih dari teks atau logo film sumber, lalu cek tepinya
  di still.

## 7. VO multi-suara (ElevenLabs atau rekaman lain)

- **Naskah untuk pengguna**: satu blok teks per suara, bukan tabel. Tag v3 di depan kalimat, `[long pause]` di antara
  kalimat sebagai titik potong, tahun ditulis dengan huruf. Pengguna menempel satu blok, generate sekali, dan Claude
  yang memotong.
- **Memotong**: transkripsi `faster-whisper` (model `tiny`, bahasa `id`; decode audio dengan ffmpeg ke array, bukan
  path) untuk mengenali kalimat, lalu `silencedetect=n=-40dB:d=0.35` untuk titik potong yang tepat.
- **Satu file gabungan**: semua suara digabung jadi `public/vo/all.wav`, tiap suara dengan offset sendiri (`adelay`),
  lalu `loudnorm`. `Film` hanya menerima satu file VO.
- **Atur ulang tanpa merombak shot**: `retime(SHOTS0, PLAN[n])` di `vo.ts` mengganti `dur`, `caps`, dan `vo` per shot,
  dan memberi `warp` linear agar animasi melambat merata. Pakai `warp` sendiri bila sebuah kejadian harus jatuh pada
  kata tertentu, atau `warp: false` bila animasi diatur langsung (contoh: mulut Raka, `RAKA_SPEAK`).
- Caption lebih dari ±70 karakter dipecah jadi dua di jeda kalimat.
- Footage yang shot-nya diperpanjang tetap butuh warp, supaya nomor frame tidak melewati frame yang diekstrak.

## 8. Versi Reels 9:16

- **Jangan pakai mode portrait `tall()` untuk film 16:9 yang sudah jadi.** Hasilnya pita aneh, gambar keluar bingkai,
  dan caption terpotong.
- Pakai pola `Reels.tsx`: tiap adegan dirender `captions={false}` di jendela persegi 1080×1080. Tiap shot punya titik
  fokus dan skala sendiri, dan kamera bergeser ±8 frame di sekitar potongan. Judul di pita atas, caption besar di
  pita bawah diambil dari `caps` shot. Titik kunci diregangkan otomatis bila shot diperpanjang untuk VO.

## Kesalahan yang sudah terjadi

| Yang dilihat pengguna | Sebab | Aturan |
|---|---|---|
| Tokoh tanpa kaki, pantat tidak terlihat | rig dipotong atau duduk tanpa lapisan | rig lengkap; pecah `legs` / `body` di sekitar kursi |
| Masker menempel di dahi anak | lupa offset duduk 95 | benda di wajah tokoh duduk ikut `translate(0 95)` |
| Kerudung janggal | bentuk seperti topi | kerudung membingkai wajah dan turun ke bahu |
| "Perspektifmu salah" di kelas | ruangan digambar datar, ditebak | kamera 3D dalam meter, ikuti sketsa pengguna |
| Tangan seperti menunjuk | jari lurus | jari menekuk di sisi benda yang dipegang |
| Meja tiba-tiba di tengah | salah z atau urutan gambar | urutkan menurut z, cek di still berpetak |
| Orang berdiri menimpa orang duduk | urutan gambar bukan urutan kedalaman | gambar dari jauh ke dekat |
| Rumah "tidak solid" | celah antarpoligon | volume tertutup, bidang belakang dulu |
| "Di kamar atau gimana?" | kamar indekos dan ruang rapat tidak dibedakan | bedakan shot per ruangan, jelaskan fakta latar |
| Ruangan kosong, kamera terlalu jauh | sedikit benda, ruangan terlalu besar | kecilkan ruangan, tambah benda depan dan belakang |
| Separuh frame dinding kosong | komposisi | lebarkan benda depan atau geser kamera |
| Lantai hilang | bidang melewati belakang kamera | pecah per pita z |
| Cahaya TV menutupi layar | cahaya di lapisan depan | cahaya di lapisan belakang |
| Teks spanduk tertutup badan | posisi tokoh | geser tokoh atau persingkat teks |
| Peta kasar | digambar dari ingatan | trace dari gambar peta acuan |
| Koper berlabel kota "apa ini?" | balok polos | beri ciri benda: sudut, tali, gesper, pegangan |
| Posko: duduk di mana? tidak ada dokter | latar tidak lengkap | kursi jelas, petugas berseragam dengan alat |
| Tidak terasa ada transisi | tidak ada hubungan visual | *match cut* dari bentuk yang sama |
| Setelah transisi zoom mulai lagi dari awal | kamera reset | zoom lanjut melewati transisi |
| Warna arsip terbawa ke peristiwa | warna tidak berganti | sepia untuk arsip, warna penuh untuk kejadian |
| Sisa teks film sumber di tepi footage | crop kurang ketat | potong ulang, cek tepi |
| Portrait pecah | `tall()` pada film 16:9 jadi | pola `Reels.tsx` |
| Naskah VO dalam tabel sulit di-generate | format | satu blok per suara, Claude yang memotong |
| Tempo terlalu cepat, terutama di akhir | shot penutup 1 detik, kartu hitam 2 detik | penutup ≥ 2 detik per shot, jeda sebelum kalimat akhir, kartu ±5 detik |
| Bisikan tokoh terasa berlebihan | dialog mengulang narasi | buang, tokoh bicara hanya bila menambah |
