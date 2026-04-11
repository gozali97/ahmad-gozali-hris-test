# 🏢 Sistem HR (Human Resource Management System)

Aplikasi manajemen SDM berbasis web yang dirancang untuk mempermudah pekerjaan sehari-hari tim HR — mulai dari mengelola data karyawan, mencatat kehadiran, sampai memproses pengajuan cuti. Dibangun dengan arsitektur modern yang memisahkan backend (Laravel) dan frontend (React), sehingga mudah dikembangkan dan di-maintain ke depannya.

---

## 📋 Daftar Isi

- [Gambaran Umum](#-gambaran-umum)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Akun Demo](#-akun-demo)
- [Panduan Penggunaan](#-panduan-penggunaan)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Gambaran Umum

Sistem HR ini punya dua tipe pengguna dengan peran berbeda:

- **Admin HR** — orang yang mengelola seluruh data perusahaan. Bisa menambah/edit/hapus karyawan, mengatur jabatan & departemen, melihat rekap absensi semua orang, dan menyetujui atau menolak pengajuan cuti.

- **Karyawan** — pengguna biasa yang bisa melakukan check-in/check-out harian, mengajukan cuti, serta melihat riwayat kehadiran dan status cuti mereka sendiri.

Kedua peran ini masuk lewat halaman login yang sama — sistem akan otomatis mengarahkan ke dashboard yang sesuai berdasarkan role masing-masing.

---

## ✨ Fitur Utama

### Untuk Admin HR

| Fitur                  | Keterangan                                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| **Dashboard**          | Ringkasan statistik: total karyawan, karyawan aktif, absensi hari ini, dan cuti yang menunggu persetujuan |
| **Manajemen Karyawan** | CRUD lengkap dengan upload foto, filter berdasarkan departemen/jabatan/status, dan pagination             |
| **Jabatan**            | Kelola daftar jabatan (Manager, Staff, Senior Staff, dll.) dengan dialog form yang praktis                |
| **Departemen**         | Kelola departemen beserta kode uniknya (HR, IT, FIN, dll.)                                                |
| **Absensi**            | Lihat seluruh riwayat absensi karyawan, input manual, dan rekap bulanan per orang                         |
| **Persetujuan Cuti**   | Review pengajuan cuti dari karyawan, setujui atau tolak dengan catatan                                    |
| **Export CSV**         | Export data karyawan, absensi, dan rekap absensi/cuti ke file CSV (siap buka di Excel)                    |

### Untuk Karyawan

| Fitur              | Keterangan                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| **Dashboard**      | Info pribadi, sisa cuti, status absensi hari ini, dan riwayat cuti terakhir |
| **Absensi**        | Check-in dan check-out dengan jam real-time, riwayat absensi per bulan      |
| **Pengajuan Cuti** | Form pengajuan cuti dengan kalkulasi otomatis jumlah hari, pilih jenis cuti |
| **Profil**         | Lihat data diri lengkap dan ubah password                                   |

### Keamanan, Akses & Real-Time

| Fitur                  | Keterangan                                                             |
| ---------------------- | ---------------------------------------------------------------------- |
| **Role-Based Access**  | Admin dan Karyawan memiliki hak akses berbeda, dijaga di route & API   |
| **Token Auth**         | Sanctum Bearer Token — otomatis logout jika token tidak valid (401)    |
| **Halaman 403**        | Tampilan informatif jika user mencoba akses halaman yang bukan haknya  |
| **Halaman 404**        | Halaman tidak ditemukan yang friendly                                  |
| **Laravel Reverb**     | Mengirim Notifikasi Status & Pengajuan Cuti secara Real-Time via Websockets |

---

## 🛠 Tech Stack

### Backend

| Komponen    | Teknologi        | Versi |
| ----------- | ---------------- | ----- |
| Framework   | Laravel          | 12.x  |
| Bahasa      | PHP              | ≥ 8.2 |
| Database    | MySQL            | 8.x   |
| Autentikasi | Laravel Sanctum  | 4.x   |
| API         | RESTful JSON API | —     |

### Frontend

| Komponen      | Teknologi         | Versi   |
| ------------- | ----------------- | ------- |
| Library       | React             | 19.x    |
| Build Tool    | Vite              | 8.x     |
| CSS           | Tailwind CSS      | 4.x     |
| UI Components | shadcn/ui (Radix) | terbaru |
| HTTP Client   | Axios             | 1.x     |
| Routing       | React Router      | 7.x     |
| Icons         | Lucide React      | 1.x     |
| Date Utility  | date-fns          | 4.x     |
| Toast         | Sonner            | 2.x     |

---

## 📁 Struktur Proyek

```
cbi-test/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Enums/              # Enum classes (Gender, UserRole, LeaveType, dll.)
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # 7 controller RESTful
│   │   │   ├── Middleware/       # RoleMiddleware untuk proteksi akses
│   │   │   ├── Requests/        # Form Request validation per fitur
│   │   │   └── Resources/       # API Resource transformers
│   │   ├── Models/             # Eloquent models (User, Position, Department, dll.)
│   │   └── Traits/             # ApiResponse trait untuk format JSON konsisten
│   ├── database/
│   │   ├── migrations/         # 9 file migrasi
│   │   └── seeders/            # Data awal lengkap (admin, 10 karyawan, absensi, cuti)
│   ├── routes/
│   │   └── api.php             # 35 endpoint API
│   └── .env                    # Konfigurasi environment
│
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # AppLayout (sidebar + navbar responsif)
│   │   │   └── ui/             # Komponen shadcn/ui (button, dialog, table, dll.)
│   │   ├── contexts/           # AuthContext untuk state management
│   │   ├── lib/                # Utilities (cn, exportCsv)
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx   # Halaman login
│   │   │   ├── ForbiddenPage.jsx  # Halaman 403 akses ditolak
│   │   │   ├── NotFoundPage.jsx   # Halaman 404
│   │   │   ├── admin/          # 7 halaman admin (dashboard, employees, dll.)
│   │   │   └── employee/       # 4 halaman karyawan (dashboard, attendance, dll.)
│   │   ├── router/             # Route guards (ProtectedRoute, GuestRoute)
│   │   ├── services/           # 8 service modules (Axios API calls)
│   │   └── App.jsx             # Router utama
│   └── .env                    # VITE_API_URL
│
└── README.md                   # Dokumentasi ini
```

---

## 📦 Prasyarat

Sebelum mulai, pastikan kamu sudah punya ini di komputermu:

1. **PHP ≥ 8.2** — Cek dengan `php -v`
2. **Composer** — Package manager PHP. Cek dengan `composer -V`
3. **Node.js ≥ 18** — Cek dengan `node -v`
4. **npm** — Biasanya sudah bundled sama Node.js. Cek dengan `npm -v`
5. **MySQL 8.x** — Database server. Bisa pakai XAMPP, Laragon, atau install mandiri
6. **Git** — Untuk clone repository (opsional kalau sudah punya file-nya)

> **💡 Tips:** Kalau pakai Windows, [Laragon](https://laragon.org/) adalah cara paling gampang untuk setup PHP + MySQL + Composer sekaligus.

---

## 🚀 Instalasi & Setup

### Langkah 1: Siapkan Database

Buka MySQL client kamu (phpMyAdmin, MySQL Workbench, atau terminal) lalu buat database baru:

```sql
CREATE DATABASE hris CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Langkah 2: Setup Backend (Laravel)

```bash
# Masuk ke folder backend
cd backend

# Install dependency PHP
composer install

# Salin file environment (kalau belum ada)
cp .env.example .env
# Di Windows: copy .env.example .env

# Generate application key
php artisan key:generate
```

Sekarang buka file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hris
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173
```

> Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` dengan setup MySQL kamu. Kalau pakai Laragon/XAMPP default, biasanya username `root` tanpa password.

Lanjut jalankan migrasi dan seeder:

```bash
# Buat tabel-tabel di database
php artisan migrate

# Isi data awal (admin, karyawan, absensi, cuti)
php artisan db:seed

# Buat symlink untuk akses file upload (foto profil)
php artisan storage:link
```

Kalau semua lancar, kamu akan punya:

- 1 akun Admin HR
- 10 akun Karyawan
- Data absensi 7 hari terakhir
- 3 contoh pengajuan cuti (pending, approved, rejected)

### Langkah 3: Setup Frontend (React)

```bash
# Masuk ke folder frontend
cd frontend

# Install dependency Node.js
npm install
```

Pastikan file `.env` di folder `hr-frontend` isinya:

```env
VITE_API_URL=http://localhost:8000/api
```

**Selesai!** Aplikasi siap dijalankan. 🎉

---

## ▶ Menjalankan Aplikasi

Kamu perlu membuka **3 terminal** secara bersamaan — dua untuk backend (Server + Websocket), dan satu untuk frontend.

### Terminal 1: Backend (Laravel)

```bash
cd backend
php artisan serve
```

Backend akan berjalan di: **http://localhost:8000**

### Terminal 2: Frontend (React)

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

### Terminal 3: Server WebSocket (Laravel Reverb)

```bash
cd backend
php artisan reverb:start
```

Server Reverb akan meng-handle semua koneksi real-time antara Node.js Frontend dan Laravel App.

Buka browser dan akses **http://localhost:5173** — kamu akan langsung diarahkan ke halaman login.

> **⚠️ Penting:** Backend dan Reverb harus jalan duluan sebelum frontend.

---

## 🔑 Akun Demo

Setelah menjalankan `php artisan db:seed`, kamu bisa login dengan akun-akun berikut:

### Admin HR

| Field    | Nilai                |
| -------- | -------------------- |
| Email    | `admin@hrsystem.com` |
| Password | `password`           |

### Karyawan (contoh beberapa)

| Nama          | Email                 | Password   |
| ------------- | --------------------- | ---------- |
| Budi Santoso  | `budi@hrsystem.com`   | `password` |
| Siti Rahayu   | `siti@hrsystem.com`   | `password` |
| Ahmad Fauzi   | `ahmad@hrsystem.com`  | `password` |
| Dewi Lestari  | `dewi@hrsystem.com`   | `password` |
| Rizki Pratama | `rizki@hrsystem.com`  | `password` |
| Ani Wijayanti | `ani@hrsystem.com`    | `password` |
| Eko Purnomo   | `eko@hrsystem.com`    | `password` |
| Rina Susanti  | `rina@hrsystem.com`   | `password` |
| Hendra Kurnia | `hendra@hrsystem.com` | `password` |
| Maya Indah    | `maya@hrsystem.com`   | `password` |

> Semua password karyawan sama: **`password`**. Ini hanya untuk demo, jangan dipakai di production ya!

---

## 📖 Panduan Penggunaan

### Login

1. Buka **http://localhost:5173**
2. Masukkan email dan password
3. Sistem akan otomatis mengarahkan ke dashboard sesuai role:
   - Admin → `/admin/dashboard`
   - Karyawan → `/employee/dashboard`

### Sebagai Admin HR

#### Dashboard

Begitu login, kamu langsung melihat ringkasan perusahaan:

- Total karyawan dan yang aktif
- Jumlah yang hadir hari ini
- Pengajuan cuti yang menunggu persetujuan
- Grafik komposisi departemen

#### Mengelola Karyawan

1. Klik menu **Karyawan** di sidebar
2. Gunakan kolom pencarian untuk cari berdasarkan nama, NIP, atau email
3. Filter berdasarkan departemen atau status (aktif/non-aktif)
4. Klik tombol **Tambah Karyawan** untuk membuat data baru
5. Isi form lengkap: data pribadi, info pekerjaan, upload foto, dan set password
6. Klik ikon pensil (✏️) untuk edit, atau ikon tempat sampah (🗑️) untuk hapus

#### Mengelola Jabatan & Departemen

1. Klik menu **Jabatan** atau **Departemen** di sidebar
2. Klik **Tambah** — muncul dialog form
3. Isi data lalu klik Simpan
4. Untuk edit, klik ikon pensil di baris yang diinginkan

#### Melihat Absensi

1. Klik menu **Absensi** di sidebar
2. Tab **Daftar Absensi**: lihat semua record absensi, filter berdasarkan status atau rentang tanggal
3. Tab **Rekap Bulanan**: lihat ringkasan per karyawan (berapa kali hadir, sakit, izin, alpha)
4. Klik **Input Absensi Manual** untuk menambah record absensi secara manual

#### Memproses Cuti

1. Klik menu **Cuti** di sidebar
2. Tab **Menunggu**: lihat pengajuan yang belum diproses
3. Klik baris untuk lihat detail (siapa yang mengajukan, tanggal, alasan)
4. Tambahkan catatan admin (opsional)
5. Klik **Setujui** atau **Tolak**

### Sebagai Karyawan

#### Dashboard

Melihat informasi pribadi, sisa jatah cuti, status absensi hari ini, dan riwayat cuti terbaru.

#### Check-in & Check-out

1. Klik menu **Absensi** di sidebar
2. Di bagian atas ada jam real-time — klik **Check In** di pagi hari
3. Sore hari, klik **Check Out**
4. Di bawahnya ada riwayat absensi per bulan, bisa difilter

#### Mengajukan Cuti

1. Klik menu **Cuti** di sidebar
2. Lihat sisa jatah cuti di bagian atas
3. Klik **Ajukan Cuti**
4. Pilih jenis cuti (Tahunan, Sakit, Melahirkan, Lainnya)
5. Tentukan tanggal mulai dan selesai — jumlah hari otomatis terhitung
6. Tulis alasan, lalu klik **Kirim Pengajuan**
7. Lihat status di tabel riwayat: Menunggu → Disetujui / Ditolak

#### Profil

1. Klik menu **Profil** atau klik avatar di navbar
2. Lihat data diri lengkap
3. Bisa mengubah password di bagian bawah

---

## 📡 API Reference

Semua endpoint menggunakan prefix `/api` dan mengembalikan format JSON yang konsisten:

```json
{
  "success": true,
  "message": "Pesan deskriptif",
  "data": { ... }
}
```

Untuk endpoint yang butuh autentikasi, sertakan header:

```
Authorization: Bearer {token}
```

### Autentikasi

| Method | Endpoint                      | Deskripsi                   | Auth |
| ------ | ----------------------------- | --------------------------- | ---- |
| POST   | `/api/auth/login`             | Login, mendapatkan token    | ❌   |
| POST   | `/api/auth/logout`            | Logout, hapus token         | ✅   |
| GET    | `/api/auth/me`                | Data user yang sedang login | ✅   |
| POST   | `/api/auth/change-password`   | Ubah password user aktif    | ✅   |

### Dashboard

| Method | Endpoint                  | Deskripsi                | Role     |
| ------ | ------------------------- | ------------------------ | -------- |
| GET    | `/api/dashboard/admin`    | Statistik untuk Admin HR | Admin    |
| GET    | `/api/dashboard/employee` | Ringkasan untuk Karyawan | Employee |

### Karyawan

| Method | Endpoint              | Deskripsi                                  | Role  |
| ------ | --------------------- | ------------------------------------------ | ----- |
| GET    | `/api/employees`      | Daftar karyawan (paginasi, filter, search) | Admin |
| POST   | `/api/employees`      | Tambah karyawan baru                       | Admin |
| GET    | `/api/employees/{id}` | Detail satu karyawan                       | Admin |
| PUT    | `/api/employees/{id}` | Update data karyawan                       | Admin |
| DELETE | `/api/employees/{id}` | Hapus karyawan                             | Admin |

**Query parameters untuk GET `/api/employees`:**

- `search` — Cari nama, NIP, atau email
- `department_id` — Filter per departemen
- `position_id` — Filter per jabatan
- `status` — Filter: `active` atau `inactive`
- `per_page` — Jumlah per halaman (default: 15)
- `page` — Nomor halaman

### Jabatan

| Method | Endpoint              | Deskripsi                            | Role  |
| ------ | --------------------- | ------------------------------------ | ----- |
| GET    | `/api/positions`      | Daftar jabatan (paginasi)            | Admin |
| GET    | `/api/positions/all`  | Semua jabatan aktif (tanpa paginasi) | Admin |
| POST   | `/api/positions`      | Tambah jabatan                       | Admin |
| GET    | `/api/positions/{id}` | Detail jabatan                       | Admin |
| PUT    | `/api/positions/{id}` | Update jabatan                       | Admin |
| DELETE | `/api/positions/{id}` | Hapus jabatan                        | Admin |

### Departemen

| Method | Endpoint                | Deskripsi                               | Role  |
| ------ | ----------------------- | --------------------------------------- | ----- |
| GET    | `/api/departments`      | Daftar departemen (paginasi)            | Admin |
| GET    | `/api/departments/all`  | Semua departemen aktif (tanpa paginasi) | Admin |
| POST   | `/api/departments`      | Tambah departemen                       | Admin |
| GET    | `/api/departments/{id}` | Detail departemen                       | Admin |
| PUT    | `/api/departments/{id}` | Update departemen                       | Admin |
| DELETE | `/api/departments/{id}` | Hapus departemen                        | Admin |

### Absensi

| Method | Endpoint                     | Deskripsi                  | Role     |
| ------ | ---------------------------- | -------------------------- | -------- |
| GET    | `/api/attendances`           | Riwayat absensi (shared)   | Semua    |
| GET    | `/api/attendances/today`     | Status absensi hari ini    | Semua    |
| POST   | `/api/attendances`           | Input absensi manual       | Admin    |
| GET    | `/api/attendances/recap`     | Rekap bulanan per karyawan | Admin    |
| POST   | `/api/attendances/check-in`  | Check-in hari ini          | Employee |
| PUT    | `/api/attendances/check-out` | Check-out hari ini         | Employee |

### Cuti

| Method | Endpoint                   | Deskripsi             | Role     |
| ------ | -------------------------- | --------------------- | -------- |
| GET    | `/api/leaves`              | Daftar cuti (shared)  | Semua    |
| GET    | `/api/leaves/{id}`         | Detail pengajuan cuti | Semua    |
| POST   | `/api/leaves`              | Ajukan cuti baru      | Employee |
| PUT    | `/api/leaves/{id}/approve` | Setujui cuti          | Admin    |
| PUT    | `/api/leaves/{id}/reject`  | Tolak cuti            | Admin    |

### Lookup Data

| Method | Endpoint               | Deskripsi                               | Auth |
| ------ | ---------------------- | --------------------------------------- | ---- |
| GET    | `/api/positions/all`   | Semua jabatan aktif (tanpa paginasi)    | ✅   |
| GET    | `/api/departments/all` | Semua departemen aktif (tanpa paginasi) | ✅   |

> **Catatan RBAC:** Endpoint dengan role `Admin` akan mengembalikan `403 Forbidden` jika diakses oleh karyawan, dan sebaliknya.

---

## 🗄 Database Schema

Aplikasi ini menggunakan 6 tabel utama:

### `users`

Tabel utama untuk semua pengguna (admin maupun karyawan), dibedakan oleh kolom `role`.

| Kolom         | Tipe        | Keterangan                    |
| ------------- | ----------- | ----------------------------- |
| id            | bigint (PK) | Auto increment                |
| nip           | varchar     | Nomor Induk Pegawai, unique   |
| name          | varchar     | Nama lengkap                  |
| email         | varchar     | Email, unique                 |
| password      | varchar     | Password (hashed)             |
| phone         | varchar     | Nomor telepon                 |
| address       | text        | Alamat                        |
| birth_date    | date        | Tanggal lahir                 |
| gender        | enum        | `male`, `female`              |
| position_id   | bigint (FK) | Referensi ke `positions`      |
| department_id | bigint (FK) | Referensi ke `departments`    |
| join_date     | date        | Tanggal bergabung             |
| status        | enum        | `active`, `inactive`          |
| photo         | varchar     | Path file foto                |
| leave_quota   | integer     | Sisa jatah cuti (default: 12) |
| role          | enum        | `admin`, `employee`           |

### `positions`

| Kolom       | Tipe        | Keterangan           |
| ----------- | ----------- | -------------------- |
| id          | bigint (PK) | Auto increment       |
| name        | varchar     | Nama jabatan         |
| description | text        | Deskripsi jabatan    |
| status      | enum        | `active`, `inactive` |

### `departments`

| Kolom       | Tipe        | Keterangan                 |
| ----------- | ----------- | -------------------------- |
| id          | bigint (PK) | Auto increment             |
| name        | varchar     | Nama departemen            |
| code        | varchar     | Kode singkat (HR, IT, FIN) |
| description | text        | Deskripsi departemen       |
| status      | enum        | `active`, `inactive`       |

### `attendances`

| Kolom     | Tipe        | Keterangan                            |
| --------- | ----------- | ------------------------------------- |
| id        | bigint (PK) | Auto increment                        |
| user_id   | bigint (FK) | Referensi ke `users`                  |
| date      | date        | Tanggal absensi                       |
| check_in  | time        | Jam masuk                             |
| check_out | time        | Jam keluar                            |
| status    | enum        | `present`, `sick`, `permit`, `absent` |
| notes     | text        | Catatan tambahan                      |

### `leaves`

| Kolom        | Tipe        | Keterangan                             |
| ------------ | ----------- | -------------------------------------- |
| id           | bigint (PK) | Auto increment                         |
| user_id      | bigint (FK) | Karyawan yang mengajukan               |
| type         | enum        | `annual`, `sick`, `maternity`, `other` |
| start_date   | date        | Tanggal mulai cuti                     |
| end_date     | date        | Tanggal selesai cuti                   |
| total_days   | integer     | Total hari cuti                        |
| reason       | text        | Alasan pengajuan                       |
| status       | enum        | `pending`, `approved`, `rejected`      |
| admin_notes  | text        | Catatan dari admin saat approve/reject |
| approved_by  | bigint (FK) | Admin yang memproses                   |
| processed_at | timestamp   | Waktu diproses                         |

### `personal_access_tokens`

Tabel bawaan Laravel Sanctum untuk menyimpan token autentikasi. Tidak perlu dikelola manual.

---

## 🔧 Troubleshooting

### Backend tidak bisa connect ke database

```
SQLSTATE[HY000] [2002] Connection refused
```

- Pastikan MySQL sudah berjalan
- Cek konfigurasi `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` di file `.env`
- Jalankan `php artisan config:clear` setelah mengubah `.env`

### Frontend error CORS

```
Access to XMLHttpRequest at 'http://localhost:8000/api/...' has been blocked by CORS policy
```

- Pastikan `FRONTEND_URL=http://localhost:5173` di file `.env` backend
- Jalankan `php artisan config:clear`
- Restart `php artisan serve`

### Frontend CSS error "@import must precede all other statements"

- Pastikan di file `src/index.css`, baris `@import url(...)` untuk Google Fonts berada **paling atas**, sebelum `@import "tailwindcss"` dan lainnya

### Halaman blank setelah login

- Buka DevTools browser (F12) → tab Console, lihat error
- Pastikan backend sudah berjalan di port 8000
- Pastikan `VITE_API_URL=http://localhost:8000/api` di `.env` frontend

### Foto tidak muncul

- Jalankan `php artisan storage:link` di folder backend
- Pastikan folder `storage/app/public/photos` bisa ditulis

### WebSockets (Reverb) atau Notifikasi Cuti Tidak Merespon Real-Time

- Pastikan kamu menjalankan `php artisan reverb:start` di terminal backend terpisah (Terminal 3).
- Pastikan variabel `VITE_REVERB_...` sudah terdaftar di `.env` frontend.
- Kalau baru menempelkan variabel lingkungan (`.env`), pastikan matikan layanan Vite lalu hidupkan ulang `npm run dev`.

### Mau reset semua data dari awal

```bash
cd backend
php artisan migrate:fresh --seed
```

> **Hati-hati**, perintah ini menghapus semua tabel dan membuat ulang dari awal.

---

### Cara Export CSV

1. Login sebagai **Admin HR**
2. Pergi ke halaman **Karyawan**, **Absensi**, atau **Cuti**
3. Gunakan filter yang diinginkan (opsional)
4. Klik tombol **Export CSV** di pojok kanan atas
5. File `karyawan_YYYY-MM-DD.csv` (atau `absensi_...` / `cuti_...`) akan otomatis terunduh
6. Buka dengan Microsoft Excel, Google Sheets, atau aplikasi spreadsheet lainnya

> File CSV menggunakan UTF-8 BOM agar karakter Indonesia (á, é, dll.) tampil dengan benar di Excel.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan tugas/assessment dan bersifat open-source.

---

_Dibuat dengan ☕ dan sedikit debugging._
