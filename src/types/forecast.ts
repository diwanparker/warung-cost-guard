export interface WeatherInterval {
  datetime: string;
  localDatetime: string;
  timeFormatted: string; // e.g. "15:00 WIB"
  dateFormatted: string; // e.g. "05 Sep"
  temperature: number; // Celsius
  humidity: number; // %
  weatherDesc: string;
  weatherCode: number;
  windSpeed: number; // km/h
  windDirection: string;
  cloudCover: number; // %
  visibility: string;
  iconUrl: string;
}

export interface LocationForecast {
  province: string;
  city: string;
  district: string;
  village: string;
  adm4: string;
  current: WeatherInterval | null;
  intervals: WeatherInterval[];
  source: "BMKG";
}
