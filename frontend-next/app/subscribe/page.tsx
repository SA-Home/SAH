import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to SA Homeschooling & Beyond for fresh education and parenting stories in your inbox.",
  alternates: {
    canonical: "/subscribe",
  },
  openGraph: {
    title: "Newsletter | SA Homeschooling & Beyond",
    description: "Subscribe to SA Homeschooling & Beyond for fresh education and parenting stories in your inbox.",
    url: "/subscribe",
  },
};

export default function SubscribePage() {
  return (
    <div className="subscribe-page">
      <Header />

      <section className="simple-hero subscribe-hero">
        <Image
          src="/images/photo-homeschool-success.png"
          alt="Homeschool success sign on a study desk"
          width={1600}
          height={900}
          priority
        />
        <div>
          <h1>Fresh homeschool ideas in your inbox</h1>
          <p>Get practical education, parenting, and development stories for South African homeschool families.</p>
        </div>
      </section>

      <main className="newsletter-page">
        <section className="newsletter-panel">
          <NewsletterForm idPrefix="subscribe" className="compact-form" title="Newsletter" headingLevel="h1" />
        </section>

        <div className="ad-strip lower-ad" aria-label="Advertisement">
          <div id="ad-newsletter-leaderboard" className="google-ad-slot google-ad-slot--leaderboard" data-ad-unit="newspack_newsletter_footer" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
