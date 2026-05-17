
# 🏎️ War Ticket Remote Control Panel (Laravel + Puppeteer Bot Engine)

Aplikasi *automation bot* berbasis *Hybrid Architecture* untuk memantau dan melakukan klik otomatis tombol pembelian tiket konser secara *real-time*. Dilengkapi dengan *dashboard control panel* berbasis web Laravel yang bisa diakses via *mobile/smartphone* dan *engine bot* berbasis Node.js + Puppeteer yang berjalan di komputer lokal.

---

## 📌 Prasyarat Sistem (Prerequisites)

Sebelum melakukan instalasi, pastikan komputer Anda sudah terpasang:
* **PHP** (Minimal versi 8.1 atau menggunakan **Laragon / XAMPP**)
* **Composer** (Untuk manajemen dependensi Laravel)
* **Node.js** (Minimal versi 18.x) & **NPM**
* **Microsoft Edge Browser** (Pastikan terinstal di direktori default Windows)

---

## 🛠️ Langkah-Langkah Instalasi (Setup & Installation)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di komputer lokal Anda setelah melakukan *clone*.

### 1. Clone Repositori
Buka terminal (Git Bash, CMD, atau VS Code Terminal), masuk ke folder direktori server Anda (misal `C:/laragon/www/`), lalu jalankan perintah:
```bash
git clone [https://github.com/USERNAME/NAMA_REPOSITORI.git](https://github.com/USERNAME/NAMA_REPOSITORI.git)
cd NAMA_REPOSITORI

```

### 2. Konfigurasi Sisi Backend (Laravel)

Masuk ke folder aplikasi Laravel, lalu ikuti sub-langkah berikut:

* **Instal dependensi PHP via Composer:**
```bash
composer install

```


* **Duplikat file konfigurasi lingkungan (.env):**
```bash
cp .env.example .env

```


* **Generate Application Key:**
```bash
php artisan key:generate

```


* **Jalankan Server Laravel:**
```bash
php artisan serve --host=0.0.0.0 --port=8000

```


*Catatan: Menggunakan `--host=0.0.0.0` bertujuan agar dashboard Laravel dapat diakses oleh HP Anda yang berada dalam satu jaringan Wi-Fi menggunakan alamat IP Laptop.*

---

### 3. Konfigurasi Sisi Engine Bot (Node.js)

Buka *tab* atau *window* terminal baru, tetap berada di folder proyek, lalu lakukan setup untuk *engine automation*:

* **Instal dependensi Node.js (Puppeteer, Express, dsb):**
```bash
npm install

```


* **Pastikan tipe modul di `package.json` sudah sesuai:**
Buka file `package.json`, pastikan atribut `"type": "module"` sudah ditambahkan agar mendukung sintaks ES6 modern:
```json
"type": "module"

```


* **Jalankan Engine Bot:**
```bash
node server.js

```


Jika berhasil, terminal akan menampilkan pesan: `API Bot Multi-Session standby di port 3000...`

---

## 🚀 Cara Penggunaan (How to Use)

1. Pastikan kedua server (**Laravel di port 8000** dan **Node.js di port 3000**) dalam posisi aktif (*running*).
2. Ambil HP Anda, pastikan terhubung ke **Wi-Fi yang sama** dengan Laptop.
3. Buka browser HP, lalu akses URL menggunakan IP laptop Anda (Contoh: `http://192.168.1.15:8000`).
4. **Fitur Tab Preset:** Anda dapat langsung menekan tombol instan konser target (NCT 127 / The Weeknd) yang sudah mengunci konfigurasi URL dan nama *class selector* tombol.
5. **Fitur Tab Manual:** Jika ada konser baru, gunakan tab ini untuk memasukkan URL, nama *class CSS* tombol hasil *inspect element*, serta urutan indeks tombol target secara dinamis.
6. Tekan **"Mulai War Sekarang"**. Jendela browser Microsoft Edge baru akan otomatis terbuka di laptop Anda dan melakukan pemindaian struktur DOM secara intensif tanpa membebani performa CPU (dilengkapi fitur *Auto-Clear CLI Log* per 20 siklus).
7. Jika ingin membatalkan atau menutup paksa seluruh sesi jendela browser dari jauh, cukup tekan tombol **"Hentikan Semua Browser"** dari layar HP Anda.

---

## 🛡️ Catatan Keamanan & Optimasi Performa

* Setiap sesi browser menggunakan `--user-data-dir` yang terisolasi secara dinamis (berdasarkan *timestamp* mikro), sehingga antar-jendela browser tidak akan saling menimpa *cookie* dan dianggap sebagai perangkat unik yang berbeda oleh sistem antrean tiket.
* Bot ini dilengkapi dengan mekanisme *Micro-Timeout Polling DOM* (100ms) alih-alih melakukan *hard-reload* satu halaman penuh secara konstan. Fitur ini sangat efektif untuk meminimalkan risiko terkena blokir IP (*Banned*) oleh proteksi Cloudflare atau kendala jaringan *Request Time Out* (RTO).

```

***
