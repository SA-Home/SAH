import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterForm from "@/components/NewsletterForm";
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

const listings = [
  {
    logo: "/images/directory-praxis.svg",
    name: "Praxis School - A Student-Centred Online IEB School",
    description: "Praxis Online School is part of a group of experienced providers providing excellence in Education.",
  },
  {
    logo: "/images/directory-bellavista.svg",
    name: "Bellavista S.H.A.R.E",
    description:
      "Bellavista S.H.A.R.E. harnesses the capacity of staff and education thought leaders to improve educational delivery in Southern Africa.",
  },
  {
    logo: "/images/directory-conquesta.svg",
    name: "Conquesta Academic Annual School Olympiads",
    description:
      "Annual multiple choice Olympiads for grades 1-9 students across South Africa, Namibia, Botswana and eSwatini.",
  },
  {
    logo: "/images/directory-answer-series.svg",
    name: "The Answer Series",
    description:
      "South Africa's leading provider of study guides, supporting learners, parents, teachers, and tutors for more than 50 years.",
  },
  {
    logo: "/images/directory-cambridge.svg",
    name: "Cambridge",
    description:
      "Trusted learning resources that bring together local curriculum expertise and international best practice for homeschoolers.",
  },
];

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
        </div>
      </section>

      <main className="directory-layout">
        <section className="directory-list" aria-label="Partner listings">
          {listings.map((listing) => (
            <article className="directory-card" key={listing.name}>
              <Image className="directory-logo" src={listing.logo} alt={`${listing.name} logo`} width={220} height={120} />
              <h2>{listing.name}</h2>
              <p>{listing.description}</p>
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
