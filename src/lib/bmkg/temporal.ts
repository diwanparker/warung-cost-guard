import type { BmkgWarning, WarningStatus } from "@/types/bmkg";

export function getWarningStatus(
  warning: BmkgWarning,
  now: Date = new Date()
): WarningStatus {
  const currentTime = now.getTime();
  const effectiveTime = warning.effective.getTime();
  const expiresTime = warning.expires.getTime();

  if (currentTime > expiresTime) {
    return "expired";
  }

  if (currentTime < effectiveTime) {
    return "upcoming";
  }

  return "active";
}

export function formatWibTime(date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formatter.format(date).replace(".", ":");
  } catch {
    // Fallback manual offset for UTC+7
    const wibMs = date.getTime() + 7 * 3600 * 1000;
    const wibDate = new Date(wibMs);
    const h = String(wibDate.getUTCHours()).padStart(2, "0");
    const m = String(wibDate.getUTCMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
}

export function formatWibRange(effective: Date, expires: Date): string {
  return `${formatWibTime(effective)} – ${formatWibTime(expires)} WIB`;
}

export function getTimeRemaining(
  expires: Date,
  now: Date = new Date()
): { minutes: number; expired: boolean; text: string } {
  const diffMs = expires.getTime() - now.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes <= 0) {
    return {
      minutes: 0,
      expired: true,
      text: "Peringatan telah berakhir",
    };
  }

  if (minutes < 60) {
    return {
      minutes,
      expired: false,
      text: `${minutes} menit tersisa`,
    };
  }

  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return {
    minutes,
    expired: false,
    text:
      remainingMins > 0
        ? `${hours} jam ${remainingMins} menit tersisa`
        : `${hours} jam tersisa`,
  };
}
