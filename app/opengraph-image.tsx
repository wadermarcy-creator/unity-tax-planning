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
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 52%, #111827 100%)",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-170px",
            left: "-120px",
            width: "520px",
            height: "520px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(37, 99, 235, 0.42) 0%, rgba(37, 99, 235, 0) 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "-180px",
            bottom: "-210px",
            width: "620px",
            height: "620px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(124, 58, 237, 0.24) 0%, rgba(124, 58, 237, 0) 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "72px",
            right: "76px",
            width: "280px",
            height: "430px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "30px",
            borderRadius: "34px",
            border: "2px solid rgba(96, 165, 250, 0.45)",
            background: "rgba(15, 23, 42, 0.78)",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "12px",
                borderRadius: "9999px",
                background: "rgba(96, 165, 250, 0.85)",
              }}
            />

            <div
              style={{
                width: "72%",
                height: "12px",
                borderRadius: "9999px",
                background: "rgba(148, 163, 184, 0.42)",
              }}
            />

            <div
              style={{
                width: "88%",
                height: "12px",
                borderRadius: "9999px",
                background: "rgba(148, 163, 184, 0.32)",
              }}
            />

            <div
              style={{
                width: "64%",
                height: "12px",
                borderRadius: "9999px",
                background: "rgba(148, 163, 184, 0.32)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 18px",
                borderRadius: "18px",
                background: "rgba(30, 41, 59, 0.9)",
              }}
            >
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#cbd5e1",
                }}
              >
                Income
              </span>

              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 900,
                  color: "#60a5fa",
                }}
              >
                Reviewed
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 18px",
                borderRadius: "18px",
                background: "rgba(30, 41, 59, 0.9)",
              }}
            >
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#cbd5e1",
                }}
              >
                Deductions
              </span>

              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 900,
                  color: "#60a5fa",
                }}
              >
                Reviewed
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 18px",
                borderRadius: "18px",
                background: "rgba(30, 41, 59, 0.9)",
              }}
            >
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#cbd5e1",
                }}
              >
                Opportunities
              </span>

              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 900,
                  color: "#86efac",
                }}
              >
                Identified
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "66px 74px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "22px",
                background:
                  "linear-gradient(135deg, #60a5fa 0%, #2563eb 55%, #1e40af 100%)",
                boxShadow: "0 18px 42px rgba(37, 99, 235, 0.35)",
              }}
            >
              <span
                style={{
                  fontSize: "38px",
                  fontWeight: 900,
                  letterSpacing: "-0.06em",
                }}
              >
                U
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <span
                style={{
                  fontSize: "31px",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              >
                UNITY
              </span>

              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  letterSpacing: "0.24em",
                  color: "#93c5fd",
                }}
              >
                TAX PLANNING
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "760px",
              marginTop: "8px",
            }}
          >
            <span
              style={{
                marginBottom: "22px",
                fontSize: "17px",
                fontWeight: 900,
                letterSpacing: "0.22em",
                color: "#93c5fd",
              }}
            >
              TAX PLANNING BEFORE IT BECOMES TAX HISTORY
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: "70px",
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: "-0.045em",
              }}
            >
              Your tax return shows what happened.
            </h1>

            <h2
              style={{
                margin: "14px 0 0",
                fontSize: "55px",
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.035em",
                color: "#60a5fa",
              }}
            >
              We help identify what may have been missed.
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 24px",
                borderRadius: "9999px",
                background: "#2563eb",
                fontSize: "18px",
                fontWeight: 900,
                boxShadow: "0 16px 36px rgba(37, 99, 235, 0.3)",
              }}
            >
              Start a Tax Blind Spot Review
            </div>

            <span
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#94a3b8",
              }}
            >
              UnityTaxPlanning.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}