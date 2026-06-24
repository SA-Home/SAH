import Image from "next/image";
import Link from "next/link";
import { getFeaturedImage, getPostExcerpt, getPostTitle, type WPCategory, type WPPost } from "@/lib/wordpress";

type CategorySectionProps = {
  category: WPCategory;
  posts: WPPost[];
};

export default function CategorySection({ category, posts }: CategorySectionProps) {
  if (!posts.length) return null;

  return (
    <section className="home-section home-section--soft" aria-labelledby={`${category.slug}-title`}>
      <div className="home-split">
        <div>
          <div className="section-heading">
            <span className="kicker">{category.name}</span>
            <h2 id={`${category.slug}-title`}>{category.description || `${category.name} stories and guides`}</h2>
          </div>
          <div className="article-stack">
            {posts.slice(0, 3).map((post) => {
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

        <Link className="resource-card resource-card--directory" href={`/category/${category.slug}`}>
          <span className="kicker">{category.name}</span>
          <h3>More {category.name} stories</h3>
          <p>Browse the full archive of SA Homeschooling articles in this section.</p>
        </Link>
      </div>
    </section>
  );
}
