"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

type DownloadButtonProps = {
  token: string;
};

export function DownloadButton({ token }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/download/${encodeURIComponent(token)}`, {
        method: "POST",
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setError(payload.error || "Download could not be prepared.");
        setIsLoading(false);
        return;
      }

      window.location.assign(payload.url);
    } catch {
      setError("Download could not be prepared.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <button className="primary-button" disabled={isLoading} type="button" onClick={handleDownload}>
        {isLoading ? <Loader2 className="spinner" size={20} aria-hidden="true" /> : <Download size={20} aria-hidden="true" />}
        Download Album ZIP
      </button>
      {error ? <p className="error-text">{error}</p> : null}
    </>
  );
}
