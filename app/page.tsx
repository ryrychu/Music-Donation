import { Calendar, Disc3, Music2 } from "lucide-react";

import { DonationPanel } from "@/components/DonationPanel";
import { album } from "@/lib/album";

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" style={{ "--hero-image": `url(${album.coverArt})` } as React.CSSProperties}>
        <div className="hero-inner">
          <header className="artist-bar">
            <a href="/" aria-label={`${album.artistName} home`}>
              {album.artistName}
            </a>
            <nav className="socials" aria-label="Artist links">
              {album.socialLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </header>

          <div className="hero-grid">
            <div className="hero-copy">
              <p className="release-label">Digital album release</p>
              <h1>{album.albumTitle}</h1>
              <p className="tagline">{album.releaseTagline}</p>
              <div className="hero-meta" aria-label="Release details">
                <span className="meta-pill">
                  <Disc3 size={16} aria-hidden="true" /> Full ZIP download
                </span>
                <span className="meta-pill">
                  <Music2 size={16} aria-hidden="true" /> Preview tracks
                </span>
                <span className="meta-pill">
                  <Calendar size={16} aria-hidden="true" /> Independent release
                </span>
              </div>
            </div>

            <DonationPanel />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="story-heading">
        <div className="section-inner story-grid">
          <div>
            <p className="eyebrow">Artist Note</p>
            <h2 id="story-heading">Music carried by listeners.</h2>
          </div>
          <div className="story-copy">
            <p>{album.story}</p>
            <p>{album.artistNote}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tracks-heading">
        <div className="section-inner">
          <p className="eyebrow">Preview</p>
          <h2 id="tracks-heading">Tracks</h2>
          <div className="track-list">
            {album.tracks.map((track) => (
              <article className="track" key={track.number}>
                <div className="track-heading">
                  <span className="track-number">{track.number}</span>
                  <h3 className="track-title">{track.title}</h3>
                  <span className="track-length">{track.length}</span>
                </div>
                <audio controls preload="metadata" src={track.previewPath}>
                  <a href={track.previewPath}>Play preview</a>
                </audio>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
