# SIAGA — BMKG Warning-to-Action Copilot
> **Hacktiv8 x IBM SkillsBuild National Hackathon 2026**  
> **Tema:** Pelayanan Publik (*Public Services*)  
> **Integrasi Utama:** IBM Bob + Langflow + Model Context Protocol (MCP)

---

## 1. Project Overview
**SIAGA** (*Sistem Informasi & Aksi Tanggap Kebencanaan*) adalah AI Copilot kesiapsiagaan darurat yang mengubah data peringatan dini cuaca resmi dari **Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)** menjadi rencana tindakan operasional konkret berbasis lokasi geografis (*location-aware*) dan peran pengguna (*role-aware*).

SIAGA memadukan keunggulan **IBM Bob** sebagai agen antarmuka percakapan alami pengguna, **Langflow** sebagai orkestrator alur logika kerja (*workflow logic engine*), dan **Model Context Protocol (MCP)** sebagai kontrak standar integrasi alat bantu AI.

---

## 2. Problem Statement
Informasi peringatan dini cuaca resmi BMKG sering kali diumumkan dalam format narasi teks atau feed teknis (contoh: *"Potensi hujan sedang-lebat disertai kilat dan angin kencang di Kota Surabaya"*). Di lapangan, para pengelola fasilitas dan institusi menghadapi kendala kritis:
1. **Apakah peringatan ini benar-benar berdampak ke kecamatan/lokasi saya?**
2. **Apakah peringatan ini masih aktif atau sudah kedaluwarsa?**
3. **Sebagai pengelola kampus/sekolah/security, apa tindakan konkret yang harus saya ambil detik ini?**
4. **Siapa saja pihak lapangan yang wajib segera dihubungi?**

Kesenjangan antara **Informasi $\rightarrow$ Pemahaman $\rightarrow$ Keputusan $\rightarrow$ Tindakan** sering kali memicu respons yang terlambat atau salah sasaran.

---

## 3. Target Users (Fokus MVP)
Untuk MVP pertama pada hackathon nasional ini, SIAGA berfokus secara mendalam pada:
* **Tim Operasional & Fasilitas Kampus/Sekolah di Indonesia**
  * Koordinator Operasional Kampus / Sarpras
  * Petugas Keamanan (*Security*) Kampus
  * Panitia Penyelenggara Kegiatan Luar Ruangan (*Event Organizer*)
  * Staf Pengawas / Guru Piket Sekolah

*(Arsitektur dirancang terbuka untuk dapat diekspansi ke segmen RT/RW, kawasan industri, dan armada logistik).*

---

## 4. Solusi yang Diberikan
SIAGA menutup celah respon bencana hidrometeorologi melalui 4 pilar:
1. **Validasi Geografis & Temporal Deterministik**: Memverifikasi kecocokan wilayah hingga level kecamatan dan mencocokkan waktu aktif (*effective* & *expires*) secara programatis tanpa halusinasi AI.
2. **Atribusi Sumber Resmi (Authentic BMKG Preservation)**: Menjaga integritas data asli BMKG, mencantumkan stempel waktu WIB, dan menyertakan tautan resmi.
3. **Penerjemahan Tindakan Berbasis SOP (Actionable Checklist)**: Mengambil klausul dari Standar Operasional Prosedur (SOP) mitigasi bencana yang sah untuk menghasilkan checklist terstruktur: *Prioritas Utama*, *Tindakan Fasilitas*, dan *Monitoring*.
4. **Gerbang Konfirmasi Manusia (Human-in-the-Loop)**: Mencegah otomatisasi serampangan; setiap aksi eksternal (notifikasi darurat / dispatch tugas) wajib disetujui pengguna manusia.

---

## 5. Mengapa SIAGA Bukan Sekadar "Chatbot Cuaca Biasa"?
* ❌ **Chatbot Biasa**: Menggunakan LLM untuk meramal cuaca secara mandiri, sering berhalusinasi, dan hanya menghasilkan ringkasan teks pasif.
* ✅ **SIAGA Copilot**:
  * **Zero Forecasting Hallucination**: SIAGA tidak pernah meramal cuaca sendiri. Seluruh data meteorologi murni berasal dari BMKG CAP feed.
  * **Deterministic Business Logic**: Perhitungan kedaluwarsa jam dan kecocokan kecamatan dilakukan oleh kode teruji, bukan tebakan probabilitas LLM.
  * **Prescriptive Action Plan**: Mengubah peringatan menjadi daftar tugas operasional yang dapat ditandai selesai (*completed*).
  * **Strict Safety Gatekeeper**: Tidak pernah menyatakan kondisi *"100% aman"* tanpa data yang valid.

---

## 6. Arsitektur Sistem

```text
                                 PENGGUNA
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │   SIAGA Web Application     │
                     │    (Next.js 15 App Router)  │
                     └──────────────┬──────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
   ┌─────────────────┐                             ┌─────────────────┐
   │     IBM BOB     │                             │  Dashboard UI   │
   │ (Agent Dialog)  │                             │ & Quick Status  │
   └────────┬────────┘                             └────────┬────────┘
            │                                               │
            │ (MCP Protocol)                                │ (REST API)
            ▼                                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                         LANGFLOW WORKFLOWS                         │
│  ┌───────────────────────┐ ┌───────────────────┐ ┌───────────────┐ │
│  │ Flow A: BMKG CAP Feed │ │ Flow B: SOP RAG   │ │ Flow C: Action│ │
│  │ & Location Matching   │ │ & Checklist Gen   │ │ Dispatcher    │ │
│  └───────────────────────┘ └───────────────────┘ └───────────────┘ │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │
      ┌───────────────────────────┴───────────────────────────┐
      ▼                                                       ▼
┌───────────────┐                                     ┌───────────────┐
│ Feed CAP BMKG │                                     │ Konfirmasi    │
│ (Open Data)   │                                     │ Manusia (HITL)│
└───────────────┘                                     └───────┬───────┘
                                                              │ (Disetujui)
                                                              ▼
                                                      ┌───────────────┐
                                                      │ Tim Lapangan  │
                                                      │ (Email/Task)  │
                                                      └───────────────┘
```

---

## 7. Peran IBM Bob
IBM Bob berfungsi sebagai **Persona Percakapan Utama**:
* Menjadi agen percakapan ramah dan profesional yang menyapa pengguna.
* Memahami konteks lokasi dan peran operasional pengguna melalui interaksi dialog.
* Mengidentifikasi kebutuhan eksekusi dan memanggil tool MCP yang relevan.
* Menjelaskan hasil analisis tindakan secara transparan dan meminta otorisasi pengguna.

---

## 8. Peran MCP (Model Context Protocol)
MCP bertindak sebagai **kontrak standar terbuka** antara IBM Bob dan sistem backend SIAGA / Langflow. Dengan MCP:
* Bob tidak perlu meng-hardcode logika scraping atau bisnis cuaca.
* Bob mengeksekusi fungsi backend sebagai alat (*tool calling*) dengan skema input/output Zod yang tervalidasi ketat.

---

## 9. Peran Langflow
Langflow bertindak sebagai **Mesin Alur Kerja (Workflow Engine)**:
* Memisahkan logika eksekusi dari prompt percakapan.
* **Flow A (Warning Retrieval)**: Mengambil CAP XML BMKG, membersihkan string geografis, dan menyaring waktu.
* **Flow B (Action Planner)**: Mencari dokumen SOP mitigasi yang relevan (RAG) dan menyusun checklist 3 tingkat prioritas.
* **Flow C (Confirmed Action)**: Menjadi gatekeeper yang mengecek otorisasi manusia sebelum mengirimkan pesan melalui Composio/Gmail.

---

## 10. Integrasi BMKG CAP (Common Alerting Protocol)
* Mengonsumsi endpoint XML standar CAP OASIS v1.2 resmi BMKG (`signature.bmkg.go.id/alert`).
* Mengurai tag `<identifier>`, `<event>`, `<headline>`, `<description>`, `<effective>`, `<expires>`, `<area>`, dan `<polygon>`.
* Melakukan normalisasi string administratif (mengeliminasi *"Kec."*, *"Kabupaten"*, perbedaan spasi dan tanda baca).
* Melakukan validasi temporal zona waktu WIB (UTC+7).

---

## 11. Tiga Tool Utama MCP

| Nama Tool | Fungsi | Parameter Input Kunci | Parameter Output Kunci |
| :--- | :--- | :--- | :--- |
| `get_active_bmkg_warning` | Mengambil & mencocokkan warning BMKG aktif | `province`, `city`, `district` | `matched`, `status`, `event`, `effective`, `expires`, `reason` |
| `build_role_action_plan` | Menyusun checklist SOP sesuai peran & konteks | `warning`, `role`, `context` | `summary`, `priority_actions`, `recommended_actions`, `do_not_do` |
| `notify_confirmed_team` | Menjalankan notifikasi ke tim eksternal | `confirmed` *(wajib true)*, `recipients`, `message` | `success`, `channel`, `recipient_count`, `timestamp` |

---

## 12. Prinsip Responsible AI (10 Aturan Emas SIAGA)
1. **Zero Fabrication**: Tidak pernah mengarang data cuaca jika BMKG tidak aktif/offline.
2. **Preserve Severity**: Tidak mengubah tingkat keparahan (*severity*) resmi BMKG.
3. **Mandatory Timestamps**: Selalu menampilkan waktu publikasi dan kedaluwarsa WIB.
4. **Never Say "100% Safe"**: Menyatakan *"Tidak ditemukan peringatan aktif yang cocok"*, bukan *"Cuaca aman"*.
5. **No Alert on Missing Data**: Menolak membuat rekomendasi darurat jika sumber primer tidak valid.
6. **Mandatory Human-in-the-Loop**: Tindakan eksternal memerlukan konfirmasi tombol eksplisit.
7. **Role Boundary**: Menampilkan label pembeda: *Informasi Resmi BMKG* vs *Rekomendasi Tindakan SIAGA*.
8. **Minimal Privacy**: Hanya menyimpan parameter lokasi institusional, tanpa pelacakan data pribadi berlebih.
9. **Secure Secrets**: Kunci API disimpan eksklusif pada variabel server `.env`.
10. **Explainable Matching**: Selalu menyertakan penjelasan transparan *"Mengapa peringatan ini relevan bagi Anda?"*.

---

## 13. Skenario Uji & Demo Mode
Untuk keandalan penjurian saat live demo atau ketika BMKG sedang tidak mengeluarkan peringatan aktif, sistem dilengkapi **Mode Demo** interaktif di bagian atas antarmuka:
* **Skenario A (Peringatan Aktif Sukolilo)**: Simulasi peringatan hujan lebat + petir yang cocok dengan kampus PENS/ITS di Sukolilo, Surabaya.
* **Skenario B (Lokasi Tidak Cocok)**: Peringatan aktif di wilayah lain (Banyuwangi/Jember) diuji terhadap lokasi Sukolilo.
* **Skenario C (Kedaluwarsa)**: Peringatan yang masa berlakunya telah terlewati.
* **Skenario D (Layanan BMKG Down)**: Simulasi kegagalan koneksi API, memverifikasi sistem menolak membuat peringatan palsu.
* **Live Feed BMKG**: Mengambil data live real-time dari server BMKG secara langsung.

Setiap data simulasi secara transparan diberi tanda **MODE DEMO: DATA SIMULASI**.

---

## 14. Instalasi & Setup

### Prasyarat
* Node.js v18+ atau v24+
* npm v10+

### Langkah Instalasi
```bash
# 1. Masuk ke direktori project siaga
cd siaga

# 2. Instal seluruh dependensi
npm install

# 3. Buat file konfigurasi lingkungan
cp .env.example .env.local
```

---

## 15. Variabel Lingkungan (`.env.local`)
```env
BMKG_CAP_FEED_URL=https://signature.bmkg.go.id/alert
LANGFLOW_BASE_URL=http://localhost:7860
LANGFLOW_API_KEY=
LANGFLOW_FLOW_ID_WARNING=
LANGFLOW_FLOW_ID_ACTION_PLAN=
DEMO_MODE=true
NOTIFICATION_PROVIDER=mock
BMKG_CACHE_TTL_SECONDS=300
```

---

## 16. Cara Menjalankan Aplikasi

### Mode Pengembangan (Dev Server)
```bash
npm run dev
```
Akses di browser: `http://localhost:3000`

### Menjalankan Unit Test (25 Tests)
```bash
npm test
```

### Menjalankan Linter & Pengecekan Tipe
```bash
npm run lint
npx tsc --noEmit
```

### Membangun Versi Produksi
```bash
npm run build
npm start
```

---

## 17. Alur Cerita Demo Pitching (2–3 Menit)
1. **Buka Dashboard**: Terlihat lokasi aktif *Sukolilo, Surabaya*.
2. **Peringatan BMKG Terdeteksi**: Kartu status peringatan dini aktif berwarna amber muncul dengan stempel *Sumber: BMKG*.
3. **Buka IBM Bob Copilot**: Pengguna menanyakan *"Apakah kegiatan outdoor kampus masih bisa dilanjutkan?"*.
4. **Bob Mengeksekusi Tool MCP**: Bob menjalankan `get_active_bmkg_warning` lalu meminta klarifikasi peran pengguna.
5. **Pilih Peran "Panitia Event"**: Bob memanggil `build_role_action_plan` dengan konteks outdoor event.
6. **Checklist SOP Terbentuk**: Menampilkan langkah penghentian acara lapangan, pemutusan listrik panggung terbuka, dan evakuasi ke gedung utama.
7. **Permintaan Pengiriman Notifikasi**: Pengguna mengklik *"Kirim Notifikasi ke Tim"*.
8. **Muncul Modal Konfirmasi**: Pengguna memverifikasi daftar tim keamanan & sarpras penerima pesan.
9. **Pengguna Menekan "Konfirmasi & Kirim"**: Tool `notify_confirmed_team` berjalan dan status log audit bertuliskan:
   `✓ Tim Notified | ✓ Action Plan Created | ● Monitoring Active`.

---

## 18. Batasan Sistem Saat Ini (*Known Limitations*)
* Pencocokan geografis saat ini berbasis hierarki teks administratif (Provinsi, Kota/Kabupaten, Kecamatan). Polygon geospasial telah diparsing namun belum dirender ke peta interaktif GIS.
* Kanal notifikasi default menggunakan adapter `mock` yang siap dihubungkan ke penyedia SMTP Email atau WhatsApp Gateway riil.

---

## 19. Rencana Pengembangan Mendatang (*Future Roadmap*)
* **Integrasi Peta Spasial Geometris**: Visualisasi poligon batas bahaya langsung pada layer OpenStreetMap/Leaflet.
* **Integrasi WhatsApp Business API**: Pengiriman broadcast darurat langsung ke grup koordinasi relawan bencana RT/RW.
* **Multi-Segment Support**: Templat SOP terdedikasi untuk operasional logistik pelabuhan dan kawasan pabrik industri berat.

---

## 20. Lisensi & Hak Cipta
Dikembangkan untuk **Hacktiv8 x IBM SkillsBuild National Hackathon 2026**. Data cuaca merupakan data terbuka publik bersumber dari **Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) Republik Indonesia**.
