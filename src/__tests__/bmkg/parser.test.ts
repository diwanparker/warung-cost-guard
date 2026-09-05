import { describe, it, expect } from "vitest";
import { parseCapXml } from "@/lib/bmkg/parser";

const SAMPLE_CAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>BMKG-2026-09-05-001</identifier>
  <sender>info@bmkg.go.id</sender>
  <sent>2026-09-05T13:00:00+07:00</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>Peringatan Dini Cuaca Ekstrem</event>
    <urgency>Expected</urgency>
    <severity>Severe</severity>
    <certainty>Likely</certainty>
    <effective>2026-09-05T13:05:00+07:00</effective>
    <expires>2026-09-05T16:00:00+07:00</expires>
    <senderName>Badan Meteorologi Klimatologi dan Geofisika</senderName>
    <headline>Peringatan Dini Cuaca Jawa Timur</headline>
    <description>Berpotensi terjadi Hujan Lebat disertai Kilat/Petir dan Angin Kencang di wilayah Kota Surabaya: Sukolilo, Rungkut, Gubeng, Mulyorejo.</description>
    <web>https://signature.bmkg.go.id/alert/001</web>
    <area>
      <areaDesc>Kota Surabaya (Kec. Sukolilo, Kec. Rungkut, Kec. Gubeng), Sidoarjo (Kec. Waru)</areaDesc>
      <polygon>-7.28,112.78 -7.30,112.82 -7.32,112.79 -7.28,112.78</polygon>
    </area>
  </info>
</alert>`;

const MALFORMED_XML = `<alert><info><event>Broken`;

describe("BMKG CAP XML Parser", () => {
  it("parses valid CAP XML into structured BmkgWarning objects", () => {
    const warnings = parseCapXml(SAMPLE_CAP_XML);
    expect(warnings).toHaveLength(1);

    const w = warnings[0];
    expect(w.id).toBe("BMKG-2026-09-05-001");
    expect(w.event).toBe("Peringatan Dini Cuaca Ekstrem");
    expect(w.headline).toBe("Peringatan Dini Cuaca Jawa Timur");
    expect(w.senderName).toBe("Badan Meteorologi Klimatologi dan Geofisika");
    expect(w.severity).toBe("Severe");
    expect(w.effective).toBeInstanceOf(Date);
    expect(w.expires).toBeInstanceOf(Date);
    expect(w.expires.getTime()).toBeGreaterThan(w.effective.getTime());
    expect(w.areas).toContain("Kota Surabaya (Kec. Sukolilo, Kec. Rungkut, Kec. Gubeng), Sidoarjo (Kec. Waru)");
    expect(w.polygon).toBe("-7.28,112.78 -7.30,112.82 -7.32,112.79 -7.28,112.78");
    expect(w.sourceUrl).toBe("https://signature.bmkg.go.id/alert/001");
  });

  it("handles malformed XML gracefully without throwing", () => {
    const warnings = parseCapXml(MALFORMED_XML);
    expect(warnings).toEqual([]);
  });

  it("handles empty or blank XML gracefully", () => {
    expect(parseCapXml("")).toEqual([]);
    expect(parseCapXml("   ")).toEqual([]);
  });

  it("handles feed with multiple alerts or alerts with multiple areas", () => {
    const multiXml = `<?xml version="1.0" encoding="UTF-8"?>
    <alerts>
      <alert>
        <identifier>ALERT-1</identifier>
        <sent>2026-09-05T10:00:00+07:00</sent>
        <info>
          <event>Hujan Sedang</event>
          <headline>Info 1</headline>
          <description>Desc 1</description>
          <effective>2026-09-05T10:00:00+07:00</effective>
          <expires>2026-09-05T12:00:00+07:00</expires>
          <area><areaDesc>Wilayah A</areaDesc></area>
          <area><areaDesc>Wilayah B</areaDesc></area>
        </info>
      </alert>
    </alerts>`;

    const warnings = parseCapXml(multiXml);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].areas).toEqual(["Wilayah A", "Wilayah B"]);
  });
});
