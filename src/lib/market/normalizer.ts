const ALIAS_MAP: Record<string, string> = {
  // Ayam
  ayam: "ayam_ras",
  "daging ayam": "ayam_ras",
  "ayam ras": "ayam_ras",
  "ayam potong": "ayam_ras",
  "ayam broiler": "ayam_ras",
  "ayam negeri": "ayam_ras",

  // Cabai Rawit
  "cabai rawit": "cabai_rawit_merah",
  "cabe rawit": "cabai_rawit_merah",
  "cabai rawit merah": "cabai_rawit_merah",
  "cabe rawit merah": "cabai_rawit_merah",
  "lombok rawit": "cabai_rawit_merah",

  // Cabai Merah Keriting
  "cabai keriting": "cabai_merah_keriting",
  "cabe keriting": "cabai_merah_keriting",
  "cabai merah": "cabai_merah_keriting",
  "cabe merah keriting": "cabai_merah_keriting",

  // Bawang
  "bawang merah": "bawang_merah",
  brambang: "bawang_merah",
  "bawang putih": "bawang_putih",
  "bawang putih honan": "bawang_putih",

  // Telur
  telur: "telur_ayam_ras",
  telor: "telur_ayam_ras",
  "telur ayam": "telur_ayam_ras",
  "telor ayam": "telur_ayam_ras",

  // Minyak
  minyak: "minyak_goreng_curah",
  "minyak goreng": "minyak_goreng_curah",
  minyakita: "minyak_goreng_curah",
  "minyak curah": "minyak_goreng_curah",
  "minyak kemasan": "minyak_goreng_kemasan",

  // Beras
  beras: "beras_medium",
  "beras medium": "beras_medium",
  "beras sphp": "beras_medium",
  "beras premium": "beras_premium",

  // Gula
  gula: "gula_pasir",
  "gula pasir": "gula_pasir",

  // Sapi
  daging: "daging_sapi",
  "daging sapi": "daging_sapi",
  sapi: "daging_sapi",
};

export function normalizeCommodity(raw: string): string {
  if (!raw) return "ayam_ras";
  const clean = raw.trim().toLowerCase().replace(/[-_]+/g, " ");

  // Direct match in alias map
  if (ALIAS_MAP[clean]) {
    return ALIAS_MAP[clean];
  }

  // Substring match in alias map
  for (const [key, canonical] of Object.entries(ALIAS_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return canonical;
    }
  }

  return clean.replace(/\s+/g, "_");
}
