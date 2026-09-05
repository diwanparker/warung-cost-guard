export interface BmkgRawEarthquake {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Dirasakan?: string;
  Shakemap?: string;
}

export interface EarthquakeData {
  id: string;
  date: string;
  time: string;
  dateTime: string;
  coordinates: string;
  latitude: string;
  longitude: string;
  magnitude: number;
  depth: string;
  region: string;
  potential: string;
  felt?: string;
  shakemapUrl?: string;
  isTsunamiPotential: boolean;
  isSignificant: boolean; // magnitude >= 5.0
  source: "BMKG";
}
