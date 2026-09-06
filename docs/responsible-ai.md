# Prinsip Responsible AI & Kepatuhan Regulasi — Warung Cost Guard

Warung Cost Guard dirancang dengan komitmen etika kecerdasan buatan dan kepatuhan hukum perdagangan Republik Indonesia:

---

## 1. Kepatuhan UU No. 5/1999 (Anti-Monopoli & Persaingan Usaha Tidak Sehat)
* **Konteks:** Pasal 5 UU No. 5/1999 melarang pelaku usaha membuat perjanjian penetapan harga (*price-fixing*) dengan pesaingnya.
* **Implementasi Sistem:** 
  - Warung Cost Guard **TIDAK PERNAH** membagikan strategi harga suatu pedagang ke pedagang lain.
  - Data yang digunakan sebagai acuan adalah data **pasar rakyat terbuka** (SP2KP Kemendag, PIHPS Bank Indonesia, Bapanas) yang dipublikasikan secara resmi untuk publik, bukan data rahasia usaha lain.
  - Rekomendasi bersifat **individual & internal** untuk menjaga kelangsungan usaha mikro pedagang secara mandiri.

---

## 2. Kepatuhan Batas Regulasi HET / HAP
* **Konteks:** Beberapa komoditas strategis memiliki Harga Eceran Tertinggi (HET) yang ditetapkan pemerintah:
  - **Minyakita:** HET Rp15.700/liter (Permendag No. 18/2024).
  - **Beras Medium SPHP:** HET Rp12.500/kg.
* **Implementasi Sistem:**
  - Mesin penentu tindakan secara otomatis mendeteksi jika pedagang hendak menaikkan harga di atas HET resmi.
  - Sistem menampilkan **Peringatan Regulasi** dan melarang sistem menyarankan kenaikan harga di atas batas hukum. Solusi diarahkan ke efisiensi modal beli dan negosiasi distributor.

---

## 3. Nol Halusinasi Finansial (Deterministic Financial Logic)
* Perhitungan laba kotor, biaya efektif perolehan (yield-adjusted), markup, dan margin persentase **tidak dilakukan oleh model bahasa (LLM)**.
* Seluruh operasi aritmatika dieksekusi oleh kalkulator TypeScript murni yang teruji dan reproducible 100%.

---

## 4. Otorisasi Manusia Wajib (Human-in-the-Loop)
* Setiap tindakan eksternal (pengiriman notifikasi negosiasi ke nomor WhatsApp/kontak supplier) **wajib melalui modal konfirmasi**.
* Pada protokol MCP `notify_supplier`, jika parameter `confirmed` bernilai `false`, sistem langsung menolak eksekusi dan mencatat pelanggaran otorisasi.

---

## 5. Transparansi & Pemisahan Informasi
Antarmuka dialog Bob Copilot dan kartu analisis selalu memisahkan secara tegas:
1. **Fakta Data Pasar** (dengan atribusi sumber: SP2KP / PIHPS / Bapanas / BPS).
2. **Hasil Perhitungan Riil** (biaya efektif dan persentase margin).
3. **Rekomendasi Tindakan AI** (maksimal 3 opsi dengan tingkat keyakinan yang transparan).
