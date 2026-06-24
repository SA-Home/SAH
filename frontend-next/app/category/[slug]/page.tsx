import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterForm from "@/components/NewsletterForm";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/wordpress";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const description = category.description || `Browse ${category.name} articles from SA Homeschooling & Beyond.`;

  return {
    title: category.name,
    description,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | SA Homeschooling & Beyond`,
      description,
      url: `/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, { page: pageParam }] = await Promise.all([params, searchParams]);
  const page = Math.max(Number(pageParam ?? "1"), 1);
  const { category, posts, totalPages } = await getPostsByCategory(slug, page, 9);

  if (!category) notFound();

  return (
    <div className="education-page">
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
            <h1>{category.name}</h1>
            <p>{category.description || `Browse the latest ${category.name} stories from SA Homeschooling & Beyond.`}</p>
          </div>
        </section>

        <section className="education-content-grid education-featured-modern">
          <section className="news-section education-featured-list" aria-labelledby="category-archive-title">
            <div className="section-rule" />
            <h2 id="category-archive-title">Latest {category.name} Articles</h2>
            <div className="education-archive-grid">
              {posts.map((post) => (
                <ArticleCard post={post} key={post.id} />
              ))}
            </div>
            <nav className="post-navigation" aria-label={`${category.name} pagination`}>
              {page > 1 ? <Link href={`/category/${category.slug}?page=${page - 1}`}>Previous page</Link> : <span />}
              {page < totalPages ? <Link href={`/category/${category.slug}?page=${page + 1}`}>Next page</Link> : <span />}
            </nav>
          </section>

          <aside className="education-sidebar">
            <NewsletterForm idPrefix={`category-${category.slug}`} className="sidebar-newsletter labeled" />
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
