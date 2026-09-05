import { XMLParser, XMLValidator } from "fast-xml-parser";
import type { BmkgWarning } from "@/types/bmkg";

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
  isArray: (name) => {
    return ["alert", "info", "area"].includes(name);
  },
});

function safeDate(val: unknown, fallback: Date = new Date()): Date {
  if (!val) return fallback;
  const d = new Date(String(val));
  return isNaN(d.getTime()) ? fallback : d;
}

export function parseCapXml(xml: string): BmkgWarning[] {
  if (!xml || typeof xml !== "string" || !xml.trim()) {
    return [];
  }

  // Defensive validation: ensure XML is syntactically well-formed
  const isValid = XMLValidator.validate(xml);
  if (isValid !== true) {
    return [];
  }

  try {
    const parsed = parser.parse(xml);
    if (!parsed) return [];

    let alertNodes: unknown[] = [];
    if (parsed.alert) {
      alertNodes = Array.isArray(parsed.alert) ? parsed.alert : [parsed.alert];
    } else if (parsed.alerts && parsed.alerts.alert) {
      alertNodes = Array.isArray(parsed.alerts.alert)
        ? parsed.alerts.alert
        : [parsed.alerts.alert];
    } else if (parsed["feed"] && parsed["feed"]["entry"]) {
      alertNodes = Array.isArray(parsed["feed"]["entry"])
        ? parsed["feed"]["entry"]
        : [parsed["feed"]["entry"]];
    }

    const results: BmkgWarning[] = [];

    for (const alert of alertNodes) {
      if (!alert || typeof alert !== "object") continue;
      const rawAlert = alert as Record<string, unknown>;

      const id = String(
        rawAlert.identifier || rawAlert.id || `BMKG-${Date.now()}`
      );
      const sent = safeDate(rawAlert.sent);

      const infoNodes = rawAlert.info
        ? Array.isArray(rawAlert.info)
          ? rawAlert.info
          : [rawAlert.info]
        : [];

      for (const info of infoNodes) {
        if (!info || typeof info !== "object") continue;
        const rawInfo = info as Record<string, unknown>;

        const event = String(rawInfo.event || "Peringatan Dini Cuaca");
        const headline = String(rawInfo.headline || event);
        const description = String(rawInfo.description || "");
        const senderName = String(
          rawInfo.senderName ||
            rawAlert.sender ||
            "Badan Meteorologi Klimatologi dan Geofisika (BMKG)"
        );
        const severity = rawInfo.severity ? String(rawInfo.severity) : undefined;
        const urgency = rawInfo.urgency ? String(rawInfo.urgency) : undefined;
        const certainty = rawInfo.certainty
          ? String(rawInfo.certainty)
          : undefined;
        const sourceUrl = rawInfo.web ? String(rawInfo.web) : undefined;

        const effective = safeDate(rawInfo.effective, sent);
        const expires = safeDate(
          rawInfo.expires,
          new Date(effective.getTime() + 3 * 3600 * 1000)
        );

        // Extract areas and polygon
        const areas: string[] = [];
        let polygon: string | undefined;

        const areaNodes = rawInfo.area
          ? Array.isArray(rawInfo.area)
            ? rawInfo.area
            : [rawInfo.area]
          : [];

        for (const area of areaNodes) {
          if (!area || typeof area !== "object") continue;
          const rawArea = area as Record<string, unknown>;
          if (rawArea.areaDesc) {
            areas.push(String(rawArea.areaDesc));
          }
          if (rawArea.polygon && !polygon) {
            polygon = String(rawArea.polygon);
          }
        }

        results.push({
          id,
          event,
          headline,
          description,
          effective,
          expires,
          senderName,
          areas,
          polygon,
          sourceUrl,
          severity,
          urgency,
          certainty,
          sent,
        });
      }
    }

    return results;
  } catch (err) {
    console.error("Error parsing CAP XML:", err);
    return [];
  }
}
