# Panduan Konfigurasi MCP (Model Context Protocol) untuk IBM Bob

Dokumen ini menjelaskan bagaimana **IBM Bob** terhubung ke workflow **SIAGA** melalui protokol standar **MCP (Model Context Protocol)**.

---

## 1. Arsitektur Hubungan Bob & Langflow via MCP

```text
  ┌──────────────┐             MCP Tool Calls             ┌──────────────┐
  │   IBM BOB    │ ─────────────────────────────────────> │   LANGFLOW   │
  │ (Agent User) │ <───────────────────────────────────── │  (Workflow)  │
  └──────────────┘           Structured JSON              └──────────────┘
         │                                                       │
         │ (Tanya Konfirmasi)                                    │ (Retrieve SOP & Data CAP)
         ▼                                                       ▼
   [Pengguna Manusia]                                      [BMKG CAP & SOP]
```

---

## 2. Definisi 3 Tool Utama MCP

### Tool 1: `get_active_bmkg_warning`
* **Deskripsi**: Mengambil data peringatan cuaca dini BMKG yang sedang aktif dan mencocokkannya secara geografis dengan kecamatan/kota pengguna.
* **Input Schema**:
```json
{
  "province": "Jawa Timur",
  "city": "Surabaya",
  "district": "Sukolilo"
}
```
* **Output Schema**:
```json
{
  "matched": true,
  "source": "BMKG",
  "event": "Peringatan Dini Cuaca Ekstrem",
  "headline": "Peringatan Dini Cuaca Jawa Timur...",
  "description": "Berpotensi hujan lebat disertai kilat/petir...",
  "effective": "2026-09-05T06:05:00.000Z",
  "expires": "2026-09-05T09:00:00.000Z",
  "area": "Kota Surabaya (Kec. Sukolilo, Kec. Rungkut)",
  "matched_location": "Sukolilo",
  "confidence": "exact",
  "reason": "Kecamatan Sukolilo tercantum secara spesifik...",
  "status": "active"
}
```

---

### Tool 2: `build_role_action_plan`
* **Deskripsi**: Menerjemahkan data peringatan aktif menjadi checklist tindakan operasional yang spesifik terhadap peran pengguna berdasarkan basis data SOP mitigasi bencana.
* **Input Schema**:
```json
{
  "warning": { "...objek warning dari tool 1..." },
  "role": "campus_operations",
  "context": {
    "outdoor_event": true,
    "participants": 150
  }
}
```
* **Output Schema**:
```json
{
  "summary": "Rencana tindakan kesiapsiagaan darurat untuk peran Operasional Kampus...",
  "risk_context": "Peringatan BMKG aktif di Sukolilo berisiko...",
  "priority_actions": [ ... ],
  "recommended_actions": [ ... ],
  "monitoring": [ ... ],
  "do_not_do": [ ... ],
  "source_warning": "BMKG",
  "sop_sources": [ "SOP Kesiapsiagaan Cuaca Ekstrem (v1.2)" ],
  "requires_confirmation": true
}
```

---

### Tool 3: `notify_confirmed_team`
* **Deskripsi**: Menjalankan aksi eksternal (pengiriman email broadcast / dispatch notifikasi ke tim lapangan).
* **Aturan Mutlak (Responsible AI)**: Aksi **DITOLAK** jika parameter `confirmed` bernilai `false`.
* **Input Schema**:
```json
{
  "confirmed": true,
  "recipients": ["security@pens.ac.id", "sarpras@pens.ac.id"],
  "message": "Peringatan dini cuaca BMKG aktif hingga pukul 16:00 WIB. Harap sterilkan area terbuka.",
  "channel": "email"
}
```

---

## 3. Konfigurasi MCP Server di IBM Bob (Slide 58-59)

Di antarmuka **IBM Bob**:
1. Buka menu **Settings (Icon Gear) > MCP**.
2. Klik tombol **"+"** untuk menambah MCP server baru.
3. Masukkan konfigurasi JSON berikut:

```json
{
  "mcpServers": {
    "siaga-bmkg-copilot": {
      "command": "node",
      "args": [
        "--with",
        "mcp<2.0.0",
        "./scripts/mcp-server.js"
      ],
      "env": {
        "BMKG_CAP_FEED_URL": "https://signature.bmkg.go.id/alert",
        "DEMO_MODE": "true"
      }
    }
  }
}
```
