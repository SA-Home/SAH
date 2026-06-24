import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { getPosts } from "@/lib/wordpress";

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">
          Latest Articles
        </h1>

        <div className="grid gap-6">
          {posts.map((post: any) => (
            <ArticleCard
              key={post.id}
              title={post.title.rendered}
              excerpt={post.excerpt.rendered}
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}