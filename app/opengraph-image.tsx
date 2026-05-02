import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: "#F8FAFC",
          color: "#0F172A",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 26, color: "#0F766E", marginBottom: 18 }}>ClinicRelay</div>
        <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 700, maxWidth: 980 }}>Fill cancelled slots faster.</div>
        <div style={{ fontSize: 30, color: "#334155", marginTop: 24, maxWidth: 980 }}>
          Waitlist matching, staff confirmation loops, and policy-safe scheduling.
        </div>
      </div>
    ),
    size,
  );
}
