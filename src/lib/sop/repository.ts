import type { SopDocument } from "./types";
import type { UserRole } from "@/types/user";

export const BUILTIN_SOPS: SopDocument[] = [
  {
    id: "campus-heavy-rain",
    title: "SOP Kesiapsiagaan Cuaca Ekstrem: Hujan Lebat & Genangan Kampus",
    organization: "Unit Keselamatan & Operasional Kampus",
    version: "1.2",
    lastUpdated: "2026-08-15",
    eventTypes: ["Hujan Lebat", "Hujan Sedang hingga Lebat", "Hujan Ekstrem", "Banjir"],
    roles: ["campus_operations", "campus_security", "event_organizer", "school_operations"],
    source: "Panduan Mitigasi Bencana Hidrometeorologi Kampus",
    highPriorityActions: [
      "Periksa dan bersihkan saluran drainase utama di sekitar gedung kuliah dan laboratorium berisiko genangan.",
      "Amankan perangkat elektronik dan instrumen lab di lantai dasar ke posisi minimum 30 cm di atas lantai.",
      "Informasikan tim keamanan untuk menutup akses jalur kendaraan yang berpotensi banjir/tergenang air.",
    ],
    mediumPriorityActions: [
      "Pastikan pompa submersible dan genset darurat dalam kondisi siaga (ready to use).",
      "Koordinasikan tim kebersihan untuk standby di area lobi dan lorong gedung mengantisipasi lantai licin.",
    ],
    monitoringActions: [
      "Pantau ketinggian air pada saluran pembuangan utama kampus setiap 30 menit.",
      "Monitor pembaruan status peringatan dini dari kanal resmi BMKG hingga dinyatakan berakhir.",
    ],
    doNotDo: [
      "Jangan melintasi genangan air dekat gardu listrik atau tiang kabel utilitas kampus.",
      "Jangan menyalakan panel listrik yang terindikasi basah atau terkena rembesan air.",
    ],
  },
  {
    id: "campus-lightning",
    title: "SOP Bahaya Kilat & Petir di Lingkungan Fasilitas Terbuka",
    organization: "Bagian Keselamatan Kerja & Keamanan Kampus",
    version: "2.0",
    lastUpdated: "2026-07-20",
    eventTypes: ["Petir", "Kilat", "Hujan Disertai Petir", "Kilat/Petir", "Guruh"],
    roles: ["campus_operations", "campus_security", "event_organizer", "school_operations"],
    source: "Standar Keselamatan Bahaya Petir Institusi Pendidikan (K3L)",
    highPriorityActions: [
      "Perintahkan seluruh mahasiswa, staf, dan pengunjung di lapangan terbuka untuk segera masuk ke dalam gedung bertingkat permanen.",
      "Hentikan segera segala aktivitas kerja di ketinggian, atap gedung, perancah (scaffolding), dan tiang antena kampus.",
      "Bunyikan sirine peringatan dini atau lakukan broadcast peringatan kilat ke grup keamanan lapangan.",
    ],
    mediumPriorityActions: [
      "Cabut colokan perangkat IT sensitif dan server cadangan yang tidak terhubung ke UPS berpenangkal petir surge arrester.",
      "Amankan pintu dan jendela kaca laboratorium untuk meminimalkan induksi elektromagnetik kilat dekat.",
    ],
    monitoringActions: [
      "Pantau selang waktu antara kilat dan guruh (aturan 30/30: jika jarak waktu kurang dari 30 detik, badai petir berada dalam radius bahaya).",
      "Pertahankan posisi berlindung hingga 30 menit setelah suara guruh terakhir terdengar.",
    ],
    doNotDo: [
      "Jangan berteduh di bawah pohon tunggal atau halte beratap logam tanpa dinding.",
      "Jangan berada di dekat tiang bendera, pagar kawat besi, tiang lampu lapangan, atau kolam terbuka.",
      "Jangan menggunakan telepon genggam yang terhubung kabel charger selama badai petir berlangsung.",
    ],
  },
  {
    id: "campus-strong-wind",
    title: "SOP Bahaya Angin Kencang & Pohon Tumbang",
    organization: "Subbag Sarana & Prasarana Kampus",
    version: "1.1",
    lastUpdated: "2026-08-01",
    eventTypes: ["Angin Kencang", "Puting Beliung", "Badai"],
    roles: ["campus_operations", "campus_security", "event_organizer", "logistics", "factory_operations"],
    source: "Pedoman Pengamanan Aset Terbuka & Mitigasi Bencana Daerah",
    highPriorityActions: [
      "Periksa dan sterilkan koridor jalan di bawah pepohonan besar yang berumur tua atau berpotensi patah dahan.",
      "Turunkan dan amankan spanduk besar, baliho acara, terpal panggung, dan tenda kerucut portabel.",
      "Larang parkir kendaraan bermotor di bawah pohon rindang, papan reklame, atau atap kanopi ringan.",
    ],
    mediumPriorityActions: [
      "Kunci rapat seluruh jendela kaca bertingkat dan pasang penahan pintu untuk mencegah hempasan angin kencang mendadak.",
      "Siapkan gergaji mesin (chainsaw) dan tim reaksi cepat sarpras untuk pembersihan cepat jika terjadi pohon tumbang penghalang jalan.",
    ],
    monitoringActions: [
      "Pantau kecepatan angin dan laporkan adanya kabel listrik/telepon yang kendur atau tergesek ranting pohon.",
      "Lakukan patroli keliling fasilitas luar ruangan setiap 45 menit.",
    ],
    doNotDo: [
      "Jangan berdiri atau berteduh di dekat kanopi seng, partisi seng proyek, atau kaca fasad gedung.",
      "Jangan mengoperasikan kendaraan bak terbuka atau forklift di area lapangan terbuka berangin kencang.",
    ],
  },
  {
    id: "campus-outdoor-event",
    title: "SOP Penyelenggaraan Kegiatan Luar Ruangan (Outdoor Event Contingency Plan)",
    organization: "Panitia Kegiatan Kemahasiswaan & Protokol Kampus",
    version: "2.1",
    lastUpdated: "2026-08-10",
    eventTypes: ["Hujan Lebat", "Petir", "Angin Kencang", "Cuaca Ekstrem"],
    roles: ["event_organizer", "campus_operations", "campus_security"],
    source: "Panduan Manajemen Risiko Kegiatan Keramaian Massa (Crowd Safety Protocol)",
    highPriorityActions: [
      "Aktifkan Rencana Kontinjensi B (Plan B): Hentikan sementara acara luar ruangan dan alihkan peserta ke auditorium/hall indoor.",
      "Putuskan segera pasokan daya listrik utama ke panggung terbuka, sound system, layar LED, dan instalasi penerangan panggung.",
      "Tugaskan koordinator keamanan dan medis di pintu-pintu masuk gedung penampungan indoor untuk mencegah desak-desakan massa.",
    ],
    mediumPriorityActions: [
      "Kirim broadcast pesan pengumuman darurat resmi kepada seluruh peserta acara, vendor, dan penanggung jawab teknis.",
      "Tutup dan pasang penutup terpal anti air pada seluruh instrumen peralatan sewaan audio visual bernilai tinggi.",
      "Koordinasikan dengan armada transportasi/shuttle kampus untuk penjemputan peserta yang terisolasi di pos lapangan.",
    ],
    monitoringActions: [
      "Cek perkiraan radar cuaca dan pembaruan berkala BMKG bersama komite pengarah sebelum mengambil keputusan melanjutkan atau membatalkan acara.",
      "Verifikasi bahwa tidak ada peserta atau panitia yang tertinggal di area perkemahan/lapangan terbuka.",
    ],
    doNotDo: [
      "Jangan membiarkan peserta tetap berkumpul di bawah tenda tratak saat terjadi angin kencang atau kilat.",
      "Jangan menyalakan sound system kembali sebelum seluruh kabel dan soket listrik dipastikan benar-benar kering dan diuji aman.",
      "Jangan menyebarkan informasi pembatalan/penundaan yang belum disahkan oleh Ketua Pelaksana atau Satgas K3.",
    ],
  },
];

export function findRelevantSops(
  eventOrDescription: string,
  role: UserRole,
  context?: { outdoor_event?: boolean }
): SopDocument[] {
  const normalizedText = (eventOrDescription || "").toLowerCase();

  return BUILTIN_SOPS.filter((sop) => {
    // If role explicitly matches
    const roleMatch = sop.roles.includes(role);

    // If context says outdoor_event, include outdoor event SOP
    if (context?.outdoor_event && sop.id === "campus-outdoor-event") {
      return true;
    }

    // Check event types
    const eventMatch = sop.eventTypes.some((ev) =>
      normalizedText.includes(ev.toLowerCase())
    );

    return roleMatch && eventMatch;
  });
}
