import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "18px",
          background:
            "linear-gradient(135deg, rgb(96, 165, 250) 0%, rgb(37, 99, 235) 55%, rgb(30, 64, 175) 100%)",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.35)",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "34px",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          U
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}