import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CategorySection from "@/components/CategorySection";
import FeaturedPosts from "@/components/FeaturedPosts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsletterForm from "@/components/NewsletterForm";
import { getCategories, getFeaturedImage, getPostExcerpt, getPostTitle, getPosts, getPostsByCategory } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "SA Homeschooling & Beyond",
  description:
    "Education, parenting, development, magazine, and directory resources for South African homeschool families.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SA Homeschooling & Beyond",
    description:
      "Education, parenting, development, magazine, and directory resources for South African homeschool families.",
    url: "/",
  },
};

export default async function Home() {
  const [posts, categories] = await Promise.all([getPosts({ perPage: 12 }), getCategories()]);
  const sectionCategories = categories.filter((category) => category.slug !== "uncategorized").slice(0, 2);
  const categorySections = await Promise.all(
    sectionCategories.map((category) => getPostsByCategory(category.slug, 1, 3)),
  );

  return (
    <div className="home-page modern-home">
      <div className="ad-strip top-ad home-menu-ad" aria-label="Advertisement">
        <div id="ad-home-above-menu" className="google-ad-slot google-ad-slot--leaderboard" data-ad-unit="newspack_home_above_menu" />
      </div>

      <Header />

      <main>
        <Hero posts={posts.slice(0, 5)} />

        <div className="home-ad-row modern-ad-row" aria-label="Advertisement">
          <div id="ad-after-hero" className="google-ad-slot google-ad-slot--leaderboard" data-ad-unit="newspack_after_hero" />
        </div>

        <FeaturedPosts posts={posts.slice(5, 8)} />

        <section className="home-section home-section--soft" aria-labelledby="guides-title">
          <div className="home-split">
            <div>
              <div className="section-heading">
                <span className="kicker">Guides</span>
                <h2 id="guides-title">Education pathways, learning support, and future planning</h2>
              </div>
              <div className="article-stack">
                {posts.slice(8, 11).map((post) => {
                  const image = getFeaturedImage(post);

                  return (
                    <Link className="article-row-modern" href={`/articles/${post.slug}`} key={post.id}>
                      <Image src={image.src} alt="" width={160} height={110} />
                      <span>
                        <strong>{getPostTitle(post)}</strong>
                        <em>{getPostExcerpt(post)}</em>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <aside className="newsletter-card">
              <NewsletterForm
                idPrefix="home"
                className="newsletter-card-form"
                title="Fresh stories in your inbox"
                showKicker
              />
            </aside>
          </div>
        </section>

        {categorySections.map((section) =>
          section.category ? (
            <CategorySection category={section.category} posts={section.posts} key={section.category.id} />
          ) : null,
        )}

        <section className="home-section home-section--white" aria-labelledby="resources-title">
          <div className="section-heading">
            <span className="kicker">Resources</span>
            <h2 id="resources-title">Magazines, directory listings, and family activities</h2>
          </div>

          <div className="resource-grid">
            <Link className="resource-card resource-card--magazine" href="/magazines">
              <span className="kicker">Magazines</span>
              <h3>Browse the SA Homeschooling magazine archive</h3>
              <p>Open uploaded PDF issues in the built-in reader and move through pages from the website.</p>
            </Link>
            <Link className="resource-card resource-card--directory" href="/directory">
              <span className="kicker">Directory</span>
              <h3>Find learning providers and education resources</h3>
              <p>Explore schools, resource centres, olympiads, study guides, and curriculum support.</p>
            </Link>
            <Link className="resource-card resource-card--recipes" href="/category/cooking-bonding">
              <span className="kicker">Parenting</span>
              <h3>Cook, connect, and learn together</h3>
              <p>Family-friendly recipes that double as practical homeschool activities.</p>
            </Link>
          </div>
        </section>

        <div className="home-ad-row modern-ad-row" aria-label="Advertisement">
          <div id="ad-footer-wide" className="google-ad-slot google-ad-slot--leaderboard" data-ad-unit="newspack_home_footer" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
