export type UserRole =
  | "campus_operations"
  | "campus_security"
  | "event_organizer"
  | "school_operations"
  | "factory_operations"
  | "warehouse_operations"
  | "logistics"
  | "community_leader";

export interface UserRoleInfo {
  id: UserRole;
  label: string;
  description: string;
  category: "campus" | "school" | "industry" | "community";
}

export const USER_ROLES: UserRoleInfo[] = [
  {
    id: "campus_operations",
    label: "Operasional Kampus",
    description: "Pengelola fasilitas, gedung, dan kegiatan umum kampus",
    category: "campus",
  },
  {
    id: "campus_security",
    label: "Keamanan / Security Kampus",
    description: "Petugas pengamanan gerbang, patroli, dan evakuasi darurat",
    category: "campus",
  },
  {
    id: "event_organizer",
    label: "Panitia / Penyelenggara Acara",
    description: "Koordinator kegiatan outdoor, panggung, dan keramaian massa",
    category: "campus",
  },
  {
    id: "school_operations",
    label: "Operasional Sekolah",
    description: "Guru dan staf piket pengawas kepulangan/aktivitas siswa",
    category: "school",
  },
  {
    id: "factory_operations",
    label: "Operasional Pabrik",
    description: "Pengawas keselamatan kerja lapangan dan area produksi terbuka",
    category: "industry",
  },
  {
    id: "warehouse_operations",
    label: "Operasional Gudang",
    description: "Penanggung jawab muatan, bongkar muat, dan kebocoran atap",
    category: "industry",
  },
  {
    id: "logistics",
    label: "Logistik & Pengiriman",
    description: "Armada pengantaran dan kurir rute jalan raya",
    category: "industry",
  },
  {
    id: "community_leader",
    label: "Pengurus Lingkungan (RT/RW)",
    description: "Penyambung informasi kesiapsiagaan warga lokal",
    category: "community",
  },
];

export interface UserLocation {
  province: string;
  city: string;
  district: string;
}
