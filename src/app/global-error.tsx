"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#120b0a",
          color: "#f5f0e6",
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 640, padding: "0 1rem" }}>
          <img
            src="https://http.cat/500.jpg"
            alt="HTTP 500 Internal Server Error"
            width={640}
            height={480}
            style={{
              width: "100%",
              maxWidth: 448,
              height: "auto",
              borderRadius: 16,
              border: "1px solid #3a2a26",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            }}
          />
          <h1 style={{ marginTop: 32, fontSize: "2rem", fontWeight: 700 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: 12, color: "#c8bcb0" }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 32,
              padding: "10px 20px",
              borderRadius: 9999,
              border: "1px solid #dacc96",
              background: "transparent",
              color: "#dacc96",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}