import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import ArticleCard from "@/components/ArticleCard";
import FeaturedMosaic from "@/components/FeaturedMosaic";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterAdStack from "@/components/NewsletterAdStack";
import ResourceCards from "@/components/ResourceCards";
import {
  getFeaturedImage,
  getPostAuthor,
  getPostTitle,
  getPostsByCategory,
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
  const [{ posts }, { posts: archivePosts, totalPages }] = await Promise.all([
    getPostsByCategory("education", 1, 12),
    getPostsByCategory("education", page, 4),
  ]);
  const weekly = posts.slice(9, 12);

  return (
    <div className="education-page education-index-page">
      <Header />

      <main>
        <FeaturedMosaic posts={posts} className="page-featured-mosaic" />

        <section className="weekly-section education-weekly-modern" aria-labelledby="weekly-title">
          <h2 id="weekly-title">Weekly Stories</h2>
          {weekly.length ? (
            weekly.map((post) => {
              const image = getFeaturedImage(post);

              return (
                <Link className="wide-story education-wide-story" href={`/articles/${post.slug}`} key={post.id}>
                  <Image src={image.src} alt={image.alt} width={360} height={220} />
                  <div>
                    <span>{getPrimaryCategory(post)}</span>
                    <h3>{getPostTitle(post)}</h3>
                    <p>by {getPostAuthor(post)}</p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="archive-loading">Weekly stories are temporarily unavailable. Please check back soon.</p>
          )}
        </section>

        <section className="education-content-grid education-featured-modern">
          <section className="education-archive-section" aria-labelledby="education-archive-title">
            <div className="section-heading">
              <span className="kicker">Education Archive</span>
              <h2 id="education-archive-title">All Education Stories</h2>
            </div>
            <div className="education-archive-grid">
              {archivePosts.map((post) => (
                <ArticleCard post={post} key={post.id} />
              ))}
            </div>
            {!archivePosts.length ? (
              <p className="archive-loading">Articles could not be loaded right now. Please check back soon.</p>
            ) : null}
            <nav className="post-navigation" aria-label="Article pagination">
              {page > 1 ? <Link href={`/articles?page=${page - 1}`}>Previous page</Link> : <span />}
              {page < totalPages ? <Link href={`/articles?page=${page + 1}`}>View More</Link> : <span />}
            </nav>
          </section>

          <aside className="education-sidebar">
            <NewsletterAdStack idPrefix="education" formClassName="sidebar-newsletter labeled" />
          </aside>
        </section>

        <AdBanner
          placement="home-bottom"
          idSuffix="education-before-resources"
          wrapClassName="archive-pagination-ad"
          variant="google-ad-slot--wide-banner"
        />

        <ResourceCards context="education" />
      </main>

      <Footer />
    </div>
  );
}
