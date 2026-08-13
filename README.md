# CopyGen Landing Page

Landing page buat jual tool generator caption/script sebagai produk digital.

## Sebelum deploy — WAJIB DIGANTI

Buka `src/App.jsx`, cari baris ini (ada 1x, dipakai di beberapa tombol):

```
const waLink = "https://wa.me/6281234567890?text=...
```

Ganti `6281234567890` dengan nomor WhatsApp kamu (format: kode negara tanpa `+` atau `0` di depan, misal nomor `0812xxxxxxx` jadi `62812xxxxxxx`).

Ganti juga harga di bagian `Rp99.000` sesuai yang kamu mau jual.

## Coba di laptop dulu (opsional tapi disarankan)

Butuh Node.js terinstall (download di nodejs.org, pilih versi LTS).

```bash
npm install
npm run dev
```

Buka link yang muncul di terminal (biasanya `http://localhost:5173`) buat lihat hasilnya di browser.

## Deploy ke Vercel (gratis)

1. Bikin akun di https://vercel.com (bisa langsung login pakai akun GitHub)
2. Push folder ini ke repo GitHub baru:
   ```bash
   git init
   git add .
   git commit -m "init copygen landing"
   git branch -M main
   git remote add origin <link-repo-github-kamu>
   git push -u origin main
   ```
3. Di dashboard Vercel, klik **Add New Project** → pilih repo yang barusan di-push → klik **Deploy**
4. Tunggu 1-2 menit, Vercel kasih link (misal `copygen-landing.vercel.app`) — itu yang dipasang di Meta Ads

## Kalau belum familiar Git/GitHub

- Bisa upload folder ini langsung ke GitHub lewat web (drag & drop file di repo baru), gak wajib pakai command line
- Atau pakai Netlify Drop (https://app.netlify.com/drop) — tinggal jalanin `npm run build` di laptop, lalu drag folder `dist` yang muncul ke halaman itu, langsung dapet link
