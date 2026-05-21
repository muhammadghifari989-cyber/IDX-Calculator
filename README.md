# IDX Calculator PWA — Panduan Setup

## 📁 Struktur File

```
idx-calculator/
├── index.html       ← Halaman login/daftar (start disini)
├── app.html         ← Kalkulator saham (dilindungi auth)
├── admin.html       ← Panel admin untuk approve user
├── manifest.json    ← Config PWA
├── sw.js            ← Service Worker (offline support)
├── icon-192.png     ← Icon app 192×192 (buat sendiri)
├── icon-512.png     ← Icon app 512×512 (buat sendiri)
└── README.md
```

---

## 🔥 LANGKAH 1 — Setup Firebase

1. Buka **https://console.firebase.google.com**
2. Klik **"Add project"** → beri nama, misal `idx-calculator`
3. Setelah project dibuat, klik ikon **`</>`** (Web)
4. Register app → **copy konfigurasi** yang muncul

Contoh konfigurasi Firebase:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "idx-calculator-xxx.firebaseapp.com",
  projectId: "idx-calculator-xxx",
  storageBucket: "idx-calculator-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

5. **Tempel config** ini ke `index.html` dan `admin.html` (ganti bagian `GANTI_DENGAN_...`)

---

## 🔐 LANGKAH 2 — Aktifkan Firebase Authentication

1. Di Firebase Console → **Authentication** → **Sign-in method**
2. Aktifkan **Email/Password** → Enable → Save

---

## 🗄️ LANGKAH 3 — Setup Firestore Database

1. Di Firebase Console → **Firestore Database** → **Create database**
2. Pilih **"Start in test mode"** dulu (nanti kita kunci)
3. Pilih region terdekat → Done

### Atur Rules Firestore:
Klik **Rules** tab, tempel ini:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // User hanya bisa baca data dirinya sendiri
      allow read: if request.auth != null && request.auth.uid == userId;
      // User bisa buat akun baru (status pending)
      allow create: if request.auth != null && request.auth.uid == userId
                    && request.resource.data.status == 'pending';
      // Hanya admin yang bisa update status
      allow update: if request.auth != null 
                    && request.auth.token.email == 'admin@idxcalculator.app';
      // Admin bisa baca semua
      allow read: if request.auth != null 
                  && request.auth.token.email == 'admin@idxcalculator.app';
      allow delete: if request.auth != null 
                    && request.auth.token.email == 'admin@idxcalculator.app';
    }
  }
}
```

> **Ganti** `admin@idxcalculator.app` dengan email admin kamu

---

## 👤 LANGKAH 4 — Buat Akun Admin

1. Di Firebase Console → **Authentication** → **Users** → **Add user**
2. Masukkan email admin (misal `admin@gmail.com`) dan password
3. Catat email ini — akan dipakai untuk login ke `admin.html`
4. Update `ADMIN_EMAIL` di `admin.html` sesuai email yang dibuat

---

## 🌐 LANGKAH 5 — Deploy ke GitHub Pages

1. Buat repository baru di **github.com** → nama: `idx-calculator`
2. Upload semua file ke repository
3. Buka **Settings** → **Pages**
4. Source: **Deploy from a branch** → Branch: `main` → `/root` → Save
5. Tunggu 1-2 menit → URL aplikasi: `https://USERNAME.github.io/idx-calculator/`

### Tambahkan domain ke Firebase:
- Firebase Console → Authentication → Settings → **Authorized domains**
- Tambahkan: `USERNAME.github.io`

---

## 🎨 LANGKAH 6 — Buat Icon Aplikasi

Buat 2 file icon PNG:
- `icon-192.png` → ukuran 192×192 pixel
- `icon-512.png` → ukuran 512×512 pixel

Bisa pakai **Canva** atau **https://favicon.io** untuk generate icon dari emoji 📈

---

## 💰 LANGKAH 7 — Setup Info Pembayaran

Edit `index.html` bagian payment info:
- Ganti **nomor rekening** dengan rekening kamu
- Ganti **nama** dengan nama pemilik rekening
- Nomor WA admin sudah diset ke `082297873766`

---

## ⚙️ Cara Kerja Sistem

```
User daftar → status: "pending"
                    ↓
User transfer Rp 15.000 → WA admin
                    ↓
Admin login ke admin.html → klik "Aktifkan"
                    ↓
User login → bisa akses kalkulator ✅
```

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Permission denied" Firestore | Cek Firestore Rules |
| Login gagal terus | Pastikan Email/Password auth sudah diaktifkan |
| PWA tidak bisa diinstall | Pastikan ada HTTPS (GitHub Pages sudah HTTPS) |
| Admin tidak bisa lihat semua user | Cek ADMIN_EMAIL di admin.html sudah benar |

---

## 📱 Cara Install Aplikasi di HP

**Android:**
1. Buka URL di Chrome
2. Muncul popup "Add to Home Screen" → Install
3. Atau: Menu Chrome (⋮) → "Install app"

**iPhone:**
1. Buka URL di Safari
2. Tap ikon Share (kotak dengan panah)
3. Scroll → "Add to Home Screen" → Add

---

Pertanyaan? WA: **082297873766**
