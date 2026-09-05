# Prinsip & Implementasi Responsible AI pada SIAGA

Proyek **SIAGA** menerapkan prinsip **Responsible AI** sebagai fitur inti kode, bukan sekadar pelengkap dokumen. Sistem penanggulangan bencana hidrometeorologi menyangkut keselamatan jiwa dan aset institusi, sehingga setiap keputusan AI harus dapat dipertanggungjawabkan (*accountable*), transparan, dan aman.

---

## 1. Sepuluh Aturan Emas Responsible AI SIAGA

### Aturan 1: Pantangan Halusinasi Prakiraan Cuaca (*Zero Weather Fabrication*)
* **Masalah**: Model bahasa (LLM) cenderung percaya diri mengarang suhu, kecepatan angin, atau waktu hujan jika ditanya.
* **Implementasi Kode**: Logika cuaca diisolasi di `src/lib/bmkg/client.ts`. Jika respons API BMKG kosong atau terjadi gangguan jaringan, sistem mengembalikan status `unavailable` dan menolak memproduksi peringatan cuaca tiruan.

### Aturan 2: Integritas & Keaslian Data BMKG (*Source Fidelity*)
* **Masalah**: AI sering meringkas informasi dengan mengubah terminologi keparahan (*severity*).
* **Implementasi Kode**: Nilai keparahan (*Severity: Severe/Moderate*) dan deskripsi narasi asli BMKG dipertahankan apa adanya. Pengguna dapat membuka dialog **"Lihat Rincian Asli BMKG"** untuk melihat teks dokumen resmi tanpa modifikasi AI.

### Aturan 3: Visibilitas Sumber dan Batas Waktu (*Mandatory Attribution & Timestamps*)
* Setiap tampilan kartu peringatan wajib menyematkan:
  * Lencana **Sumber: BMKG**
  * Waktu penerbitan (*sent*)
  * Periode berlaku (*effective* hingga *expires* dalam format WIB resmi UTC+7)
  * Hitung mundur sisa waktu berlaku

### Aturan 4: Larangan Menyatakan "100% Aman" (*No False Safety Declarations*)
* **Bahaya**: Menyatakan *"Cuaca hari ini aman"* dapat membuat operator teledor saat terjadi fenomena cuaca mendadak di luar radar.
* **Implementasi Kode**: Fungsi `validateActionPlanSafety()` di `src/lib/actions/safety.ts` memindai rencana tindakan dan menolak klaim absolut *"pasti aman"*. Sebagai gantinya, sistem menyatakan secara objektif:  
  > *"Tidak ditemukan peringatan aktif yang cocok pada data resmi BMKG yang berhasil diperiksa saat ini."*

### Aturan 5: Gerbang Otorisasi Konfirmasi Manusia (*Human-in-the-Loop Gate*)
* **Bahaya**: Mengirim email darurat atau sirene secara otomatis tanpa validasi manusia dapat memicu kepanikan massal (*false alarm*).
* **Implementasi Kode**: Endpoint `/api/notify` dan tool MCP `notify_confirmed_team` memiliki pemeriksaan ketat:
  ```ts
  if (!request.confirmed) {
    return { success: false, message: "Dibatalkan: Konfirmasi otorisasi manusia tidak diberikan." };
  }
  ```
  Aksi notifikasi eksternal mustahil terjadi tanpa penekanan tombol konfirmasi oleh manusia pada modal dialog.

### Aturan 6: Penandaan Jelas Data Demo (*Transparent Synthetic Data Labeling*)
* Ketika dijalankan dalam mode simulasi, seluruh data sintetis secara terang benderang dilabeli dengan lencana berwarna ungu: **MODE DEMO: DATA SIMULASI**. Sistem tidak pernah memalsukan data simulasi seolah-olah peringatan nyata.

### Aturan 7: Pemisahan Jelas antara Peringatan Resmi vs Rekomendasi Tindakan
* Antarmuka membedakan dengan tegas:
  * **Peringatan Resmi (BMKG)**: Fakta kejadian cuaca.
  * **Rekomendasi Tindakan (SIAGA SOP)**: Saran langkah penanganan berdasarkan dokumen K3L institusi.

### Aturan 8: Penjelasan Transparansi (*Explainability: "Mengapa Relevan?"*)
* Sistem tidak menyembunyikan alasan pemilihan warning. Pada setiap kartu ditampilkan kotak penjelasan transparan mengenai alasan kecocokan administratif wilayah kecamatan dan kota.

### Aturan 9: Pengumpulan Data Pribadi Minimal (*Data Minimization*)
* SIAGA tidak memerlukan registrasi data pribadi sensitif pengguna. Sistem hanya memproses koordinat administratif lokasi fasilitas yang sedang dipantau.

### Aturan 10: Keamanan Kunci Rahasia (*No Client-Side Secrets*)
* Kunci API (Langflow, Composio, dll.) hanya dikelola di sisi server menggunakan enkapsulasi `.env.local` dan dilarang keras diekspos ke bundel JavaScript peramban (*client-side*).
