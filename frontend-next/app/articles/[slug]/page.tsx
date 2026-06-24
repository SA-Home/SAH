import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterForm from "@/components/NewsletterForm";
import {
  formatPostDate,
  getFeaturedImage,
  getPostAuthor,
  getPostBySlug,
  getPostCategories,
  getPostExcerpt,
  getPostTitle,
  getPosts,
  getPrimaryCategory,
  stripHtml,
} from "@/lib/wordpress";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const image = getFeaturedImage(post);
  const title = getPostTitle(post);
  const description = getPostExcerpt(post);

  return {
    title,
    description,
    alternates: {
      canonical: `/articles/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/articles/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [getPostAuthor(post)],
      images: [
        {
          url: image.src,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const image = getFeaturedImage(post);
  const categories = getPostCategories(post);
  const related = await getPosts({
    perPage: 3,
    categories: categories[0]?.id,
    exclude: post.id,
  });

  return (
    <div className="recipe-page article-page">
      <Header />

      <section className="recipe-hero article-hero">
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} priority />
        <div className="recipe-hero-overlay">
          <div className="section-rule" />
          <p>{categories.map((category) => category.name).join(", ") || getPrimaryCategory(post)}</p>
          <h1>{getPostTitle(post)}</h1>
          <span>
            by <Link href="#">{getPostAuthor(post)}</Link> &nbsp;&nbsp; {formatPostDate(post.date)}
          </span>
        </div>
      </section>

      <main className="recipe-layout article-layout">
        <article className="recipe-article article-body">
          <div className="intro-box">
            <p>{getPostExcerpt(post)}</p>
          </div>

          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

          <div className="article-ad-slot google-ad-slot google-ad-slot--leaderboard" aria-label="Advertisement" />

          <section className="author-bio">
            <div className="author-avatar author-photo" aria-hidden="true" />
            <div>
              <h2>
                {getPostAuthor(post)} <span>Author</span>
              </h2>
              <p>
                {stripHtml(post._embedded?.author?.[0]?.description || "") ||
                  `${getPostAuthor(post)} writes for SA Homeschooling & Beyond.`}
              </p>
              <Link href="#">More by {getPostAuthor(post)}</Link>
            </div>
          </section>

          {related.length ? (
            <section className="education-archive-section" aria-labelledby="related-title">
              <div className="section-heading">
                <span className="kicker">Related Articles</span>
                <h2 id="related-title">More stories for you</h2>
              </div>
              <div className="education-archive-grid">
                {related.map((relatedPost) => (
                  <ArticleCard post={relatedPost} key={relatedPost.id} />
                ))}
              </div>
            </section>
          ) : null}

          <NewsletterForm idPrefix="article-bottom" className="sidebar-newsletter labeled" />
        </article>

        <aside className="recipe-sidebar article-sidebar">
          <div className="article-side-ad google-ad-slot google-ad-slot--medium-rect" aria-label="Advertisement" />
          <section className="latest-widget">
            <h2>Latest Stories</h2>
            {related.map((relatedPost) => (
              <Link href={`/articles/${relatedPost.slug}`} key={relatedPost.id}>
                {getPostTitle(relatedPost)}
              </Link>
            ))}
          </section>
          <NewsletterForm idPrefix="article" className="sidebar-newsletter labeled" />
          <div className="article-side-ad google-ad-slot google-ad-slot--medium-rect" aria-label="Advertisement" />
        </aside>
      </main>

      <Footer />
    </div>
  );
}
