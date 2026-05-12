export const album = {
  artistName: "Mara Vale",
  albumTitle: "Night Signal",
  releaseTagline: "A cinematic indie record for long drives, late rooms, and voices caught between stations.",
  coverArt: "/cover-art/night-signal.png",
  defaultDonation: 15,
  story:
    "Night Signal was written in borrowed studios and quiet apartments after midnight. Every donation goes directly into finishing the next run of music, sessions, artwork, and independent distribution.",
  artistNote:
    "Choose the amount that feels right. Once Stripe confirms the payment, the full album ZIP unlocks instantly and the same private link lands in your inbox.",
  tracks: [
    {
      number: "01",
      title: "Low Sun Frequency",
      length: "3:42",
      previewPath: "/previews/01-low-sun-frequency.wav",
    },
    {
      number: "02",
      title: "Glass Harbor",
      length: "4:18",
      previewPath: "/previews/02-glass-harbor.wav",
    },
    {
      number: "03",
      title: "Static Bloom",
      length: "3:56",
      previewPath: "/previews/03-static-bloom.wav",
    },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://example.com/instagram" },
    { label: "Bandcamp", href: "https://example.com/bandcamp" },
    { label: "YouTube", href: "https://example.com/youtube" },
  ],
} as const;
