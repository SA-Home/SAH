import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterForm from "@/components/NewsletterForm";
import { partners } from "@/lib/partners";
import { getPosts, getPostTitle } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Partners",
  description: "Find learning providers, resource centres, study guides, and education partners for homeschool families.",
  alternates: {
    canonical: "/directory",
  },
  openGraph: {
    title: "Partners | SA Homeschooling & Beyond",
    description: "Find learning providers, resource centres, study guides, and education partners for homeschool families.",
    url: "/directory",
  },
};

export default async function DirectoryPage() {
  const latestPosts = await getPosts({ perPage: 5 });

  return (
    <div className="directory-page">
      <Header />

      <section className="directory-hero">
        <Image
          src="/images/directory-hero-real.png"
          alt="Children playing in a school courtyard with Table Mountain in the background"
          width={1600}
          height={900}
          priority
        />
        <div>
          <h1>Partners</h1>
          <p className="directory-hero-subtitle">People we partner with</p>
          <p className="directory-hero-copy">
            Explore trusted education providers, learning resources, and support services for homeschool families.
          </p>
        </div>
      </section>

      <main className="directory-layout">
        <section className="directory-list" aria-label="Partner listings">
          {partners.map((partner) => (
            <article className="directory-card" key={partner.slug}>
              <Image className="directory-logo" src={partner.logo} alt={`${partner.name} logo`} width={220} height={120} />
              <h2>{partner.name}</h2>
              <p>{partner.shortDescription}</p>
              <div className="directory-card-actions">
                <Link className="directory-readmore-link" href={`/directory/${partner.slug}`}>
                  Read more
                </Link>
                {partner.website ? (
                  <a
                    className="directory-website-link"
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${partner.name} official website`}
                  >
                    Visit Website
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </section>

        <aside className="directory-sidebar">
          <AdSlot placement="directory-top" wrapClassName="directory-ad" />

          <section className="latest-widget">
            <h2>Latest Stories</h2>
            {latestPosts.length ? (
              latestPosts.map((post) => (
                <Link href={`/articles/${post.slug}`} key={post.id}>
                  {getPostTitle(post)}
                </Link>
              ))
            ) : (
              <p>Latest stories are temporarily unavailable.</p>
            )}
          </section>

          <NewsletterForm idPrefix="directory" className="sidebar-newsletter labeled" />
        </aside>
      </main>

      <Footer />
    </div>
  );
}
