import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import AdBanner from "@/components/AdBanner";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterForm from "@/components/NewsletterForm";
import {
  formatPostDate,
  getFeaturedImage,
  getPostAuthor,
  getPostExcerpt,
  getPostTitle,
  getPosts,
  getPostsByCategory,
  getPrimaryCategory,
  type WPPost,
} from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "SA Homeschooling & Beyond",
  description:
    "Education, parenting, development, magazine, and partner resources for South African homeschool families.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SA Homeschooling & Beyond",
    description:
      "Education, parenting, development, magazine, and partner resources for South African homeschool families.",
    url: "/",
  },
};

export default async function Home() {
  const categoryConfigs = [
    {
      slug: "education",
      name: "Education",
      description: "Education stories and guides",
    },
    {
      slug: "parenting",
      name: "Parenting",
      description: "Parenting stories and support",
    },
    {
      slug: "development",
      name: "Development",
      description: "Development stories and guides",
    },
    {
      slug: "cooking-bonding",
      name: "Cooking & Bonding",
      description: "Cooking and bonding stories",
    },
  ];
  const [posts, ...categorySections] = await Promise.all([
    getPosts({ perPage: 12 }),
    ...categoryConfigs.map((category) => getPostsByCategory(category.slug, 1, 3)),
  ]);

  return (
    <div className="home-page modern-home">
      <AdBanner placement="home-top" wrapClassName="ad-strip top-ad home-menu-ad" />

      <Header />

      <main>
        <section className="home-editorial-showcase" aria-label="Featured homeschool stories">
          {posts[3] ? <HomeLeadStory post={posts[3]} /> : null}

          <div className="home-card-row">
            {posts.slice(4, 7).map((post) => (
              <HomeImageTile post={post} key={post.id} />
            ))}
          </div>

          <section className="home-top-stories-panel" aria-labelledby="home-top-stories-title">
            <div className="section-rule" />
            <h2 id="home-top-stories-title">Top stories</h2>
            {posts.length ? (
              <div className="home-top-stories-grid">
                {posts.slice(0, 5).map((post) => (
                  <HomeTopStory post={post} key={post.id} />
                ))}
              </div>
            ) : (
              <p className="archive-loading">Latest stories are temporarily unavailable. Please check back soon.</p>
            )}
          </section>
        </section>

        <AdBanner placement="home-middle" wrapClassName="home-ad-row modern-ad-row" />

        <section className="home-section home-section--soft" aria-labelledby="guides-title">
          <div className="home-split home-guides-grid">
            <div className="section-heading home-guides-heading">
              <h2 id="guides-title">Education pathways, learning support, and future planning</h2>
            </div>

            <aside className="newsletter-card">
              <NewsletterForm
                idPrefix="home"
                className="newsletter-card-form"
                title="Fresh stories in your inbox"
                showKicker
              />
            </aside>

            <div className="article-stack home-guides-articles">
              {posts.length ? (
                posts.slice(8, 11).map((post) => {
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
                })
              ) : (
                <p className="archive-loading">Education guides will appear here as soon as WordPress is reachable.</p>
              )}
            </div>
          </div>
        </section>

        {categorySections.map((section, index) => {
          const config = categoryConfigs[index];

          return section.category ? (
            <Fragment key={config.slug}>
              <CategorySection
                category={{
                  ...section.category,
                  slug: config.slug,
                  name: config.name,
                  description: config.description,
                }}
                posts={section.posts}
              />
              {index < categorySections.length - 1 ? (
                <AdBanner
                  placement="home-middle"
                  idSuffix={`category-${config.slug}`}
                  wrapClassName="home-ad-row modern-ad-row home-category-ad"
                />
              ) : null}
            </Fragment>
          ) : null;
        })}

        <section className="home-section home-section--white" aria-labelledby="resources-title">
          <div className="section-heading">
            <span className="kicker">Resources</span>
            <h2 id="resources-title">Magazines, partners, and family activities</h2>
          </div>

          <div className="resource-grid">
            <Link className="resource-card resource-card--magazine" href="/magazines">
              <span className="kicker">Magazines</span>
              <h3>Browse the SA Homeschooling magazine archive</h3>
              <p>Open uploaded PDF issues in the built-in reader and move through pages from the website.</p>
            </Link>
            <Link className="resource-card resource-card--directory" href="/directory">
              <span className="kicker">Partners</span>
              <h3>Find learning providers and education partners</h3>
              <p>Explore schools, resource centres, olympiads, study guides, and curriculum support partners.</p>
            </Link>
            <Link className="resource-card resource-card--recipes" href="/category/cooking-bonding">
              <span className="kicker">Parenting</span>
              <h3>Cook, connect, and learn together</h3>
              <p>Family-friendly recipes that double as practical homeschool activities.</p>
            </Link>
          </div>
        </section>

        <AdBanner placement="home-bottom" wrapClassName="home-ad-row modern-ad-row" />
      </main>

      <Footer />
    </div>
  );
}

function HomeLeadStory({ post }: { post: WPPost }) {
  const image = getFeaturedImage(post);

  return (
    <article className="home-lead-story home-lead-story--compact">
      <Link href={`/articles/${post.slug}`}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} />
        <div className="home-lead-copy">
          <h2>{getPostTitle(post)}</h2>
          <p>by {getPostAuthor(post)}</p>
        </div>
      </Link>
    </article>
  );
}

function HomeImageTile({ post }: { post: WPPost }) {
  const image = getFeaturedImage(post);

  return (
    <Link className="home-image-tile" href={`/articles/${post.slug}`}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} />
      <h3>{getPostTitle(post)}</h3>
    </Link>
  );
}

function HomeTopStory({ post }: { post: WPPost }) {
  const image = getFeaturedImage(post);

  return (
    <Link className="home-top-story" href={`/articles/${post.slug}`}>
      <Image src={image.src} alt="" width={92} height={68} />
      <span>
        <strong>{getPostTitle(post)}</strong>
        <em>
          {getPrimaryCategory(post)} / by {getPostAuthor(post)} / {formatPostDate(post.date)}
        </em>
      </span>
    </Link>
  );
}
