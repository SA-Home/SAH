import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterForm from "@/components/NewsletterForm";
import {
  getFeaturedImage,
  getPaginatedPosts,
  getPostAuthor,
  getPostExcerpt,
  getPostTitle,
  getPrimaryCategory,
} from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Education Articles",
  description:
    "Browse SA Homeschooling articles about education pathways, learning support, matric planning, parenting, and development.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Education Articles | SA Homeschooling & Beyond",
    description:
      "Browse SA Homeschooling articles about education pathways, learning support, matric planning, parenting, and development.",
    url: "/articles",
  },
};

type ArticlesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(Number(pageParam ?? "1"), 1);
  const { posts, totalPages } = await getPaginatedPosts({ page, perPage: 12 });
  const lead = posts[0];
  const secondary = posts.slice(1, 4);
  const topStories = posts.slice(4, 9);
  const weekly = posts.slice(9, 12);

  return (
    <div className="education-page">
      <div className="ad-strip top-ad" aria-label="Advertisement">
        <div id="ad-education-top" className="google-ad-slot google-ad-slot--leaderboard-sm" data-ad-unit="newspack_education_top" />
      </div>

      <Header />

      <main>
        <section className="editorial-hero page-hero">
          <Image
            src="/images/photo-desk-supplies.jpg"
            alt="Study desk with notebooks and learning supplies"
            width={1600}
            height={900}
            priority
          />
          <div>
            <h1>Education</h1>
            <p>
              Clear guidance for subject choices, matric planning, learning support, and future pathways for South
              African homeschool families.
            </p>
          </div>
        </section>

        {lead ? (
          <section className="education-top" aria-label="Education top stories">
            <div className="lead-column">
              <Link className="feature-card" href={`/articles/${lead.slug}`}>
                <Image
                  src={getFeaturedImage(lead).src}
                  alt={getFeaturedImage(lead).alt}
                  width={getFeaturedImage(lead).width}
                  height={getFeaturedImage(lead).height}
                />
                <div className="feature-overlay">
                  <h1>{getPostTitle(lead)}</h1>
                  <p>by {getPostAuthor(lead)}</p>
                </div>
              </Link>

              <div className="secondary-grid">
                {secondary.map((post) => {
                  const image = getFeaturedImage(post);

                  return (
                    <Link className="image-story" href={`/articles/${post.slug}`} key={post.id}>
                      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} />
                      <div>
                        <h2>{getPostTitle(post)}</h2>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <aside className="top-stories" aria-labelledby="education-top-stories">
              <h2 id="education-top-stories">Top stories</h2>
              {topStories.map((post) => {
                const image = getFeaturedImage(post);

                return (
                  <Link className="story-row" href={`/articles/${post.slug}`} key={post.id}>
                    <Image src={image.src} alt="" width={120} height={90} />
                    <div>
                      <h3>{getPostTitle(post)}</h3>
                      <p>by {getPostAuthor(post)}</p>
                    </div>
                  </Link>
                );
              })}
            </aside>
          </section>
        ) : null}

        <section className="weekly-section education-weekly-modern" aria-labelledby="weekly-title">
          <h2 id="weekly-title">Weekly Stories</h2>
          {weekly.map((post) => {
            const image = getFeaturedImage(post);

            return (
              <article className="wide-story education-wide-story" key={post.id}>
                <Image src={image.src} alt={image.alt} width={360} height={220} />
                <div>
                  <span>{getPrimaryCategory(post)}</span>
                  <h3>{getPostTitle(post)}</h3>
                  <p>by {getPostAuthor(post)}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="education-content-grid education-featured-modern">
          <section className="news-section education-featured-list" aria-labelledby="featured-title">
            <div className="section-rule" />
            <h2 id="featured-title">Featured</h2>
            <div className="post-list">
              {posts.slice(0, 3).map((post) => {
                const image = getFeaturedImage(post);

                return (
                  <Link className="post-row" href={`/articles/${post.slug}`} key={post.id}>
                    <Image src={image.src} alt="" width={180} height={130} />
                    <div>
                      <h3>{getPostTitle(post)}</h3>
                      <p>{getPostExcerpt(post)}</p>
                      <span className="byline">by {getPostAuthor(post)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <aside className="education-sidebar">
            <NewsletterForm idPrefix="education" className="sidebar-newsletter" />
          </aside>
        </section>

        <section className="education-archive-section" aria-labelledby="education-archive-title">
          <div className="section-heading">
            <span className="kicker">Education Archive</span>
            <h2 id="education-archive-title">All Education Stories</h2>
          </div>
          <div className="education-archive-grid">
            {posts.map((post) => (
              <ArticleCard post={post} key={post.id} />
            ))}
          </div>
          <nav className="post-navigation" aria-label="Article pagination">
            {page > 1 ? <Link href={`/articles?page=${page - 1}`}>Previous page</Link> : <span />}
            {page < totalPages ? <Link href={`/articles?page=${page + 1}`}>Next page</Link> : <span />}
          </nav>
        </section>

        <div className="final-ad-wrap education-final-ad" aria-label="Advertisement">
          <div id="ad-education-footer" className="google-ad-slot google-ad-slot--wide-banner" data-ad-unit="newspack_education_footer" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
