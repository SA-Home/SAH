import type { Metadata } from "next";
import Image from "next/image";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MagazineCard from "@/components/MagazineCard";
import { getMagazinePosts } from "@/lib/wordpress";

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

export default async function MagazinesPage() {
  const magazines = await getMagazinePosts();
  const introIssues = magazines.slice(0, 2);

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
        <AdBanner placement="magazine-top" wrapClassName="magazine-bottom-ad" />

        <section className="magazine-intro-grid" aria-label="Featured magazine descriptions">
          {introIssues.length ? (
            introIssues.map((issue) => (
              <p key={issue.id}>
                <strong>{issue.title}</strong> {issue.description}
              </p>
            ))
          ) : (
            <p>
              The SA Homeschooling &amp; Beyond magazine archive is being prepared. Please check back soon for the
              latest online issues.
            </p>
          )}
        </section>

        <section className="magazine-grid" aria-label="Magazine library">
          {magazines.length ? (
            magazines.map((issue) => <MagazineCard issue={issue} key={`${issue.id}-${issue.slug}`} />)
          ) : (
            <p className="archive-loading">Magazine issues are temporarily unavailable.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
