# Dokumentasi Model Context Protocol (MCP) — Warung Cost Guard

Sesuai standar integrasi **IBM Bob × Langflow × MCP**, Warung Cost Guard mengekspos 4 perkakas (*tools*) terstruktur dengan validasi ketat skema Zod.

---

## Daftar Perkakas MCP

| Nama Tool | Fungsi Utama | Karakteristik | Gatekeeper |
| :--- | :--- | :--- | :--- |
| `get_market_prices` | Mengambil data harga pasar lokal resmi (SP2KP, PIHPS, Bapanas) | Normalisasi komoditas & agregasi median | Otomatis |
| `calculate_margin` | Menghitung biaya efektif (yield-adjusted), laba kotor, dan margin riil | Deterministik (non-LLM) | Otomatis |
| `suggest_price_action` | Menganalisis kondisi margin, batas HET, dan rekomendasi aksi | Rule engine + RAG SOP penetapan harga | Otomatis |
| `notify_supplier` | Mengirimkan pesan negosiasi WhatsApp / draf kulakan ke supplier | Aksi eksternal | **Wajib Konfirmasi Manusia (HITL)** |

---

## 1. `get_market_prices`
Mengambil data harga pangan komparatif untuk suatu wilayah pasar rakyat.

### Skema Input:
```json
{
  "commodity": "cabai_rawit_merah",
  "city": "Surabaya",
  "date": "2026-09-06"
}
```

### Skema Output:
```json
{
  "commodity": "cabai_rawit_merah",
  "commodity_name": "Cabai Rawit Merah",
  "city": "Surabaya",
  "prices": [
    { "source": "PIHPS", "value": 62000, "marketName": "Pasar Keputran" },
    { "source": "Bapanas", "value": 61500, "marketName": "Pasar Wonokromo" },
    { "source": "SP2KP", "value": 63000, "marketName": "Pasar Pabean" }
  ],
  "median_reference": 62000,
  "min_price": 61500,
  "max_price": 63000,
  "unit": "kg",
  "source_time": "2026-09-06",
  "is_demo": true
}
```

---

## 2. `calculate_margin`
Melakukan kalkulasi biaya efektif secara reproducible tanpa halusinasi matematis LLM.

### Formula:
$$\text{Biaya Efektif} = \frac{\text{Modal Kulakan} + \text{Ongkir}}{1 - (\text{Susut \%} / 100)}$$
$$\text{Gross Margin \%} = \frac{\text{Harga Jual} - \text{Biaya Efektif}}{\text{Harga Jual}} \times 100\%$$

### Skema Input:
```json
{
  "purchase_price": 36500,
  "transport_cost": 1500,
  "waste_pct": 5,
  "selling_price": 45000
}
```

### Skema Output:
```json
{
  "purchase_price": 36500,
  "transport_cost": 1500,
  "waste_pct": 5,
  "selling_price": 45000,
  "effective_cost": 40000,
  "gross_profit": 5000,
  "gross_margin_pct": 11.11,
  "markup_pct": 12.5,
  "status": "warning"
}
```

---

## 3. `suggest_price_action`
Menyusun rekomendasi rasional berbasis SOP penetapan harga, batas HET pemerintah, dan posisi terhadap harga pasar lokal.

### Skema Input:
```json
{
  "commodity": "ayam_ras",
  "current_margin_pct": 11.11,
  "target_margin_pct": 18,
  "market_reference": 43000,
  "selling_price": 45000,
  "role": "warteg"
}
```

### Skema Output:
```json
{
  "action": "OPTIMIZE",
  "headline": "Margin Tertekan — Prioritaskan Negosiasi Supplier & Pengendalian Susut",
  "options": [
    "Minta potongan harga supplier atau cari supplier alternatif di pasar induk",
    "Tahan harga jual saat ini untuk menjaga daya saing terhadap warung sekitar",
    "Tinjau ulang biaya transportasi kulakan"
  ],
  "confidence": "medium",
  "requires_confirmation": true,
  "reasoning": "Margin (11.1%) masih di bawah target (18%), namun harga jual Anda sudah sebanding atau di atas median pasar (Rp43.000). Menaikkan harga jual berisiko kehilangan pelanggan.",
  "suggested_supplier_msg": "Halo Pak Slamet (CV Barokah), terkait kenaikan harga ayam jadi Rp36.500/kg, apakah ada potongan harga volume jika kami ambil rutin 25 kg/hari?"
}
```

---

## 4. `notify_supplier`
Menjalankan pengiriman pesan negosiasi WhatsApp / draf kulakan ke kontak supplier terpilih.

> [!CAUTION]
> **Responsible AI Hard-Gate:** Tool ini akan otomatis **GAGAL** bila parameter `confirmed` bernilai `false`. Aksi eksternal tidak boleh dieksekusi tanpa persetujuan eksplisit pedagang manusia.

### Skema Input:
```json
{
  "supplier_id": "SUP-01",
  "message": "Halo Pak Slamet, mohon konfirmasi harga ayam 25 kg untuk besok.",
  "confirmed": true,
  "channel": "whatsapp"
}
```

### Skema Output:
```json
{
  "sent": true,
  "channel": "whatsapp",
  "timestamp": "2026-09-06T16:00:00.000Z",
  "message": "Pesan negosiasi berhasil dikirimkan ke Pak Slamet (0812-3456-7890) via WHATSAPP."
}
```
