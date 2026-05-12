"use client";

import { FormEvent, useMemo, useState } from "react";
import { Heart, Loader2, LockKeyhole } from "lucide-react";

import { album } from "@/lib/album";
import {
  DEFAULT_DONATION_CENTS,
  MAX_DONATION_CENTS,
  MIN_DONATION_CENTS,
  validateDonationAmount,
} from "@/lib/donation";

const presets = [5, 15, 25, 50];

export function DonationPanel() {
  const [amount, setAmount] = useState(String(album.defaultDonation));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const validation = useMemo(() => validateDonationAmount(amount), [amount]);
  const sliderValue = validation.ok ? validation.cents / 100 : DEFAULT_DONATION_CENTS / 100;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    if (!validation.ok) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setServerError(payload.error || "Checkout could not be started.");
        setIsSubmitting(false);
        return;
      }

      window.location.assign(payload.url);
    } catch {
      setServerError("Checkout could not be started.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="donation-panel" onSubmit={handleSubmit}>
      <div className="panel-title">
        <h2>Unlock the album</h2>
        <span className="secure-note">
          <LockKeyhole size={15} aria-hidden="true" /> Stripe
        </span>
      </div>

      <label className="amount-row">
        <span className="currency-mark">$</span>
        <input
          className="amount-input"
          inputMode="decimal"
          min={MIN_DONATION_CENTS / 100}
          max={MAX_DONATION_CENTS / 100}
          step="0.01"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          aria-label="Donation amount in dollars"
        />
      </label>

      <input
        className="slider"
        type="range"
        min={MIN_DONATION_CENTS / 100}
        max={100}
        step={1}
        value={Math.min(sliderValue, 100)}
        onChange={(event) => setAmount(event.target.value)}
        aria-label="Donation amount slider"
      />
      <div className="range-labels" aria-hidden="true">
        <span>$1</span>
        <span>$100</span>
      </div>

      <div className="preset-row" aria-label="Donation presets">
        {presets.map((preset) => (
          <button
            className="preset-button"
            data-active={Number(amount) === preset}
            key={preset}
            type="button"
            onClick={() => setAmount(String(preset))}
          >
            ${preset}
          </button>
        ))}
      </div>

      <button className="primary-button" disabled={!validation.ok || isSubmitting} type="submit">
        {isSubmitting ? <Loader2 className="spinner" size={20} aria-hidden="true" /> : <Heart size={20} aria-hidden="true" />}
        Donate & Unlock Album
      </button>

      {!validation.ok ? <p className="error-text">{validation.error}</p> : null}
      {serverError ? <p className="error-text">{serverError}</p> : null}
      <p className="fine-print">One-time payment. No subscription or account required.</p>
    </form>
  );
}
