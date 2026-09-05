# Panduan Skenario Demo Pitching SIAGA (2–3 Menit)

Dokumen ini memandu langkah-langkah presentasi live pitching di hadapan juri **Hacktiv8 x IBM SkillsBuild National Hackathon 2026**.

---

## Ringkasan Narasi Pitching (30 Detik Pertama)
> *"Bapak/Ibu dewan juri, peringatan dini cuaca BMKG itu akurat dan resmi. Tapi saat peringatan berbunyi: 'Hujan lebat disertai kilat di Surabaya', pertanyaan mendasar seorang pengelola kampus adalah: 'Apakah ini kena kampus saya? Dan detik ini, saya harus ngapain?'*  
> *Inilah **SIAGA** — Copilot Kesiapsiagaan Darurat yang menjembatani **Warning $\rightarrow$ Action** menggunakan integrasi **IBM Bob, Langflow, dan Model Context Protocol (MCP)** dengan prinsip Responsible AI tanpa halusinasi cuaca."*

---

## Langkah Demonstrasi Langkah demi Langkah (Scene by Scene)

### Scene 1: Membuka Dashboard Terpantau
* **Aksi**: Buka aplikasi di `http://localhost:3000`.
* **Tampilan**: Terlihat lokasi aktif terpantau: **Kec. Sukolilo, Surabaya (Jawa Timur)**.
* **Poin Penjelasan**: *"Sistem secara otomatis mengawasi feed resmi BMKG CAP untuk wilayah kampus PENS/ITS di Sukolilo."*

### Scene 2 & 3: Peringatan BMKG Terdeteksi
* **Tampilan**: Kartu peringatan dini aktif berwarna amber muncul:
  * Peristiwa: *Peringatan Dini Cuaca Ekstrem (Hujan Lebat + Petir)*
  * Periode Berlaku: *WIB* dengan hitung mundur sisa waktu
  * Lencana Resmi: *Sumber: BMKG*
  * Kotak Transparansi: *"Mengapa Peringatan Ini Relevan? Kecamatan Sukolilo tercantum secara spesifik pada daftar area terdampak BMKG."*
* **Aksi Penguji**: Klik tombol **"Lihat Rincian Asli BMKG"** untuk memperlihatkan integritas data CAP asli tanpa distorsi AI.

### Scene 4 & 5: Interaksi Alami dengan IBM Bob Copilot
* **Aksi**: Klik tombol melayang **"IBM Bob Copilot"** di pojok kanan bawah.
* **Dialog**: Pengguna mengetik atau mengklik tombol pintas:  
  *"Cek peringatan cuaca kampus saya"* atau *"Apakah kegiatan outdoor kampus masih bisa dilanjutkan?"*
* **Tampilan**:
  * Bob memanggil tool MCP `get_active_bmkg_warning()`.
  * Bob merespons dengan sopan dalam Bahasa Indonesia, menjelaskan status warning aktif, dan menanyakan peran pengguna:  
    `[Operasional Kampus] [Security] [Panitia Event / Outdoor]`

### Scene 6: Pembuatan Rencana Tindakan SOP
* **Aksi**: Klik pilihan `[Panitia Event / Outdoor]`.
* **Tampilan**:
  * Bob memanggil tool MCP `build_role_action_plan()`.
  * Checklist terstruktur langsung terisi di dashboard:
    1. **Prioritas Utama (Segera)**: Hentikan sementara acara luar ruangan dan evakuasi peserta ke aula bertingkat; putuskan aliran listrik panggung dan sound system terbuka.
    2. **Tindakan Pendukung**: Pasang terpal anti air pada peralatan audio visual bernilai tinggi.
    3. **Pengawasan**: Pantau radar cuaca dan patuhi aturan 30/30 kilat-guruh.
    4. **Hal yang Dilarang**: Dilarang berteduh di bawah tenda terpal atau menyalakan panel listrik yang basah.

### Scene 7 & 8: Permintaan Tindakan Eksternal & Gerbang Konfirmasi (HITL)
* **Aksi**: Pengguna mengklik tombol **"Kirim Notifikasi ke Tim (Butuh Konfirmasi)"** pada checklist atau di dalam panel Bob.
* **Tampilan**: Muncul modal dialog konfirmasi:
  * Peringatan tebal: *"SIAGA tidak akan mengirim pesan sebelum Anda memberikan otorisasi konfirmasi."*
  * Daftar penerima tercentang: Tim Keamanan, Koordinator Lapangan, Tim Sarpras.
  * Preview draf pesan peringatan resmi.

### Scene 9 & 10: Otorisasi & Eksekusi Dispatch
* **Aksi**: Klik tombol biru **"Konfirmasi & Kirim"**.
* **Tampilan**:
  * Modal menampilkan tanda centang hijau *Pemberitahuan Berhasil Dikirim!*.
  * Tool MCP `notify_confirmed_team()` dieksekusi dengan parameter `confirmed: true`.

### Scene 11: Status Akhir Monitoring Selesai
* **Tampilan**: Dashboard menampilkan banner hijau status eksekusi lengkap:
  `✓ Tim Lapangan Telah Dinotifikasi | ✓ Rencana Tindakan Terdaftar | ● Monitoring BMKG Aktif`
* **Poin Penutup**: *"Dengan SIAGA, dalam kurang dari 2 menit peringatan mentah BMKG berhasil diterjemahkan menjadi tindakan nyata yang terkoordinasi dan aman di lapangan."*

---

## Uji Kasus Batas (Edge Cases) untuk Dewan Juri
Tunjukkan tombol switcher skenario di baris atas untuk membuktikan sistem tahan banting:
1. **Klik "Skenario B (Lokasi Tidak Cocok)"**: Menunjukkan peringatan di Banyuwangi tidak memicu alarm palsu untuk Sukolilo. Menampilkan pesan jujur *"Tidak ditemukan peringatan aktif yang cocok"*.
2. **Klik "Skenario C (Kedaluwarsa)"**: Menunjukkan sistem mengenali peringatan yang telah habis masa berlakunya.
3. **Klik "Skenario D (BMKG Down)"**: Menunjukkan sistem melaporkan gangguan jaringan dan menolak memalsukan ramalan cuaca sendiri.
