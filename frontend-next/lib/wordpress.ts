const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;

export async function getPosts() {
  const res = await fetch(`${WP_API}/wp/v2/posts?_embed=1&per_page=10`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}