import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Magazines",
  description: "Read SA Homeschooling & Beyond magazine issues directly from the website.",
  alternates: {
    canonical: "/magazines",
  },
  openGraph: {
    title: "Magazines | SA Homeschooling & Beyond",
    description: "Read SA Homeschooling & Beyond magazine issues directly from the website.",
    url: "/magazines",
  },
};

const magazines = [
  ["SA Homeschooling December 2025", "sa-homeschooling-december-2025.pdf", 18],
  ["SA Homeschooling Spring 2025", "sa-homeschooling-spring-2025.pdf", 35],
  ["SA Homeschooling Winter 2025", "sa-homeschooling-winter-2025.pdf", 24],
  ["SA Homeschooling Issue 1 2025", "sa-homeschooling-issue-1-2025.pdf", 42],
  ["SA Homeschooling Summer 2024", "sa-homeschooling-summer-2024.pdf", 24],
  ["SA Homeschooling Spring 2024", "sa-homeschooling-spring-2024.pdf", 42],
  ["SA Homeschooling Winter 2024", "sa-homeschooling-winter-2024.pdf", 48],
  ["SA Homeschooling Autumn 2024", "sa-homeschooling-autumn-2024.pdf", 48],
  ["SA Homeschooling Issue 16 Summer 2023", "sa-homeschooling-issue-16-summer-2023.pdf", 42],
  ["SA Homeschooling Issue 15 Spring 2023", "sa-homeschooling-issue-15-spring-2023.pdf", 46],
  ["SA Homeschooling Issue 14 Winter 2023", "sa-homeschooling-issue-14-winter-2023.pdf", 54],
  ["SA Homeschooling Issue 13 Autumn 2023", "sa-homeschooling-issue-13-autumn-2023.pdf", 56],
] as const;

export default function MagazinesPage() {
  return (
    <div className="magazines-page">
      <Header />

      <section className="simple-hero magazines-hero-image">
        <Image
          src="/images/magazines-hero-real.png"
          alt="Open notebook and pencils in a quiet study space"
          width={1600}
          height={900}
          priority
        />
        <div>
          <span className="kicker">Magazines</span>
          <h1>Explore Our Magazines</h1>
          <p>
            Read SA Homeschooling &amp; Beyond issues directly from the website, with magazine previews and built-in page
            controls.
          </p>
        </div>
      </section>

      <main className="magazines-main">
        <section className="magazine-intro-grid" aria-label="Featured magazine descriptions">
          <p>
            The <strong><em>SA Homeschooling December 2025 issue</em></strong> is dedicated to empowering parents for a
            successful academic year ahead, focusing on essential developmental, educational, and planning topics.
          </p>
          <p>
            The <strong>Spring 2025 issue of SA Homeschooling and Beyond</strong> explores key topics shaping modern
            homeschooling in South Africa, from mathematics and AI in education to practical family lifestyle content.
          </p>
        </section>

        <section className="magazine-grid" aria-label="Magazine library">
          {magazines.map(([title, file, pages]) => (
            <article className="magazine-card" key={file}>
              <a
                className="magazine-preview magazine-open"
                href={`/magazines/${file}`}
                aria-label={`Open ${title}`}
                target="_blank"
                rel="noreferrer"
              >
                <iframe
                  src={`/magazines/${file}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  title={`${title} cover preview`}
                  loading="lazy"
                />
                <span className="magazine-preview-fallback">{title}</span>
              </a>
              <a className="magazine-toolbar magazine-open" href={`/magazines/${file}`} target="_blank" rel="noreferrer">
                <span>1/{pages}</span>
                <span>Grid</span>
                <span>+</span>
                <span>-</span>
                <span>Full</span>
                <span>Share</span>
              </a>
              <p>{title} is available to read online as part of the SA Homeschooling &amp; Beyond archive.</p>
            </article>
          ))}
        </section>

        <div className="magazine-bottom-ad" aria-label="Advertisement">
          <div id="ad-magazines-bottom" className="google-ad-slot google-ad-slot--leaderboard" data-ad-unit="newspack_magazines_bottom" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
