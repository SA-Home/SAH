import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedImage,
  getPostAuthor,
  getPostTitle,
  getPrimaryCategory,
  type WPPost,
} from "@/lib/wordpress";

type FeaturedMosaicProps = {
  posts: WPPost[];
  className?: string;
};

export default function FeaturedMosaic({ posts, className = "" }: FeaturedMosaicProps) {
  const [lead, ...secondary] = posts.slice(0, 4);

  if (!lead) return null;

  const leadImage = getFeaturedImage(lead);

  return (
    <section className={`site-featured-mosaic ${className}`.trim()} aria-label="Featured stories">
      <article className="site-featured-lead">
        <Link href={`/articles/${lead.slug}`}>
          <Image src={leadImage.src} alt={leadImage.alt} width={leadImage.width} height={leadImage.height} priority />
          <div className="site-featured-copy">
            <h2>{getPostTitle(lead)}</h2>
            <p>by {getPostAuthor(lead)}</p>
          </div>
        </Link>
      </article>

      {secondary.length ? (
        <div className="site-featured-row">
          {secondary.map((post) => {
            const image = getFeaturedImage(post);

            return (
              <Link className="site-featured-tile" href={`/articles/${post.slug}`} key={post.id}>
                <Image src={image.src} alt={image.alt} width={image.width} height={image.height} />
                <span>{getPrimaryCategory(post)}</span>
                <h3>{getPostTitle(post)}</h3>
              </Link>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
