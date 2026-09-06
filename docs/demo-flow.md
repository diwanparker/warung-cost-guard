# Panduan Alur Pitching Demo (2–3 Menit) — Warung Cost Guard

Panduan ini disusun untuk sesi live pitch / presentasi evaluasi juri **Hacktiv8 × IBM SkillsBuild National Hackathon 2026**.

---

## Urutan Demonstrasi Terstruktur

```
[1. Dashboard Overview] ──> [2. Pilih Skenario A] ──> [3. Tinjau Margin Riil]
         │                                                        │
         ▼                                                        ▼
[6. Human-in-the-Loop]  <── [5. Rekomendasi 3 Opsi] <── [4. Dialog IBM Bob]
```

---

### Menit 0:00 – 0:45: Pembukaan & Permasalahan Lapangan
1. **Buka Web App Warung Cost Guard** di browser (`http://localhost:3000`).
2. Tunjukkan **Konteks Inflasi BPS**: Kelompok Makanan & Minuman Jawa Timur mencatatkan inflasi 3,19% (y-on-y). Pedagang kecil menghadapi kenaikan modal kulakan yang cepat berubah antar pasar.
3. Klik tombol evaluasi **Skenario A (Ayam Warteg Naik)** pada bar atas.

---

### Menit 0:45 – 1:30: Perhitungan Biaya Efektif & Data Pasar Lokal
1. **Tunjukkan Kalkulator Deterministik:**
   - Modal kulakan: **Rp36.500/kg** (naik dari Rp32.000).
   - Ongkos angkut: **Rp1.500/kg**.
   - Susut pembersihan/timbangan: **5%**.
   - Biaya Efektif Nyata terhitung otomatis: **Rp40.000/kg**.
   - Harga Jual saat ini: **Rp45.000/kg** $\rightarrow$ Margin tersisa hanya **11,1%** (Status: **⚠️ Waspada**).
2. **Soroti Data Pembanding Pasar:**
   - Median pasar resmi Surabaya (PIHPS & SP2KP) berada di angka **Rp43.000/kg**.
   - Jelaskan: *"Jika pedagang langsung menaikkan harga jadi Rp48.000 tanpa cek data pasar, pembeli akan lari ke warung sebelah karena harga di pasar lokal masih Rp43.000."*

---

### Menit 1:30 – 2:15: IBM Bob Copilot & Rekomendasi Cerdas
1. Klik tombol **"Tanya Bob"** di bagian kanan atas atau di bawah kalkulator.
2. Drawer Copilot terbuka. Klik quick prompt: *"Ayam dari 32rb jadi 36.5rb, jual 45rb margin saya aman?"*
3. Bob memanggil tiga tool MCP secara transparan:
   - `calculate_margin()`
   - `get_market_prices()`
   - `suggest_price_action()`
4. Tunjukkan jawaban Bob yang terstruktur:
   - **Fakta Data Pasar**: Median pasar lokal Rp43.000.
   - **Hasil Perhitungan**: Biaya riil Rp40.000, margin 11,1%.
   - **Rekomendasi Tindakan AI**: Rekomendasi *OPTIMIZE* dengan 3 opsi konkret:
     1. Minta diskon volume ke supplier utama.
     2. Kontrol porsi olahan tanpa mengurangi rasa.
     3. Tahan harga jual saat ini untuk menjaga loyalitas pelanggan.

---

### Menit 2:15 – 3:00: Human-in-the-Loop & Kepatuhan Regulasi HET
1. Klik tombol **"Kirim Draf Negosiasi ke Supplier"**.
2. Muncul **Modal Konfirmasi Otorisasi Manusia**:
   - Menampilkan kontak **Pak Slamet (CV Barokah Unggas)**.
   - Menampilkan draf pesan WhatsApp yang telah disiapkan Bob.
   - Tunjukkan peringatan: *"Pesan tidak akan pernah dikirim tanpa persetujuan Anda."*
3. Klik **"Konfirmasi & Kirim Pesan"**:
   - Status terkirim dengan banner konfirmasi hijau.
4. *(Bonus 15 detik)* Klik **Skenario B (Minyakita HET)**:
   - Tunjukkan bagaimana sistem secara tegas mendeteksi batas HET resmi **Rp15.700/liter** (Permendag No. 18/2024), mencegah pedagang melanggar regulasi harga tertinggi.
