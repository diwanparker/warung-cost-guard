# Panduan Arsitektur & Setup Langflow untuk SIAGA

Sistem **SIAGA** membagi proses eksekusi menjadi 3 alur kerja modular (*flows*) di **Langflow**.

---

## 1. Pembagian Alur Kerja (Workflows)

```text
┌─────────────────────────────────────────────────────────────┐
│ FLOW A: Warning Retrieval Flow                             │
│ Input Lokasi ─> Fetch BMKG CAP ─> Parse XML ─> Location &   │
│                 Temporal Filter ─> Output Structured Warning │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FLOW B: Action Planner Flow                                 │
│ Warning Object + Role Context ─> Vector/SOP Retrieval ─>     │
│                 Safety Validation ─> Output Action Plan     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FLOW C: Confirmed Action Dispatcher                         │
│ Action Plan + Confirmed Boolean ─> Gatekeeper Check ─>      │
│                 Composio / Gmail / Task Notification        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Rincian Komponen Node Langflow

### FLOW A — Warning Retrieval
* **Chat Input**: Menerima parameter lokasi pengguna (`province`, `city`, `district`).
* **Custom Python / API Request Component**: Mengirim HTTP GET ke endpoint CAP BMKG (`/alerts/nowcast/id`).
* **XML Parser Component**: Mengurai tag XML `<alert>`, `<info>`, `<area>`, `<effective>`, `<expires>`.
* **Python Filter Function**: Memeriksa `now >= effective && now <= expires` dan kecocokan string wilayah.
* **Chat Output**: Mengirimkan objek JSON terstruktur status peringatan.

### FLOW B — Action Planner
* **Input Node**: Menerima objek hasil dari Flow A dan peran pengguna (`role`).
* **Astra DB / In-Memory Vector Store**: Menyimpan embedding dokumen SOP penanggulangan bencana kampus (Hujan Lebat, Kilat, Angin Kencang, Outdoor Event).
* **LLM Model (Google Gemini / IBM Granite)**: Mengintegrasikan klausul SOP ke dalam format checklist 3 prioritas:
  * Prioritas Utama (Tindakan Segera)
  * Tindakan Pendukung Fasilitas
  * Pengawasan Berkala (Monitoring)
* **Safety Guardrail Node**: Memverifikasi bahwa rekomendasi tidak mengarang data cuaca dan menyematkan `requiresConfirmation: true`.

### FLOW C — Confirmed Action
* **Input Node**: Menerima payload konfirmasi (`confirmed: boolean`, `recipients: list`, `message: string`).
* **Conditional Router Node**:
  * Jika `confirmed == false` $\rightarrow$ Hentikan alur seketika, kembalikan status *Cancelled*.
  * Jika `confirmed == true` $\rightarrow$ Lanjutkan ke external action tools.
* **External Action Tools (Composio)**:
  * **Gmail / Webhook Tool**: Mengirimkan email broadcast darurat.
  * **Google Calendar Tool**: Membuat blok acara pemantauan cuaca darurat.

---

## 3. Ekspor & Integrasi ke Bob via MCP
Di aplikasi Langflow:
1. Buka flow yang telah dibuat.
2. Klik tombol **MCP Server** di pojok kanan atas.
3. Klik **Generate API Key**.
4. Salin endpoint JSON MCP untuk ditempelkan ke konfigurasi MCP IBM Bob.
