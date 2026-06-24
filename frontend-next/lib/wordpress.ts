const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? "https://sahomeschooling.com/wp-json";

export type WPAuthor = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  link?: string;
  avatar_urls?: Record<string, string>;
};

export type WPCategory = {
  id: number;
  count: number;
  name: string;
  slug: string;
  description?: string;
  link?: string;
};

export type WPMedia = {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, { source_url: string; width: number; height: number }>;
  };
};

export type WPPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  author: number;
  featured_media: number;
  categories: number[];
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPCategory[][];
  };
};

export type PaginatedPosts = {
  posts: WPPost[];
  total: number;
  totalPages: number;
};

type GetPostsOptions = {
  perPage?: number;
  page?: number;
  categories?: number | number[];
  exclude?: number | number[];
  search?: string;
};

const revalidate = 3600;

const categoryAliases: Record<string, string> = {
  education: "newspack-featured",
  parenting: "partner",
  "ask-dalena": "newspack-ask-dalena",
  "cooking-bonding": "cooking-and-bonding",
};

function resolveCategorySlug(slug: string) {
  return categoryAliases[slug] ?? slug;
}

function normalizeCategory(category: WPCategory): WPCategory {
  return {
    ...category,
    name: decodeHtml(category.name),
    description: stripHtml(category.description ?? ""),
  };
}

function apiUrl(path: string, params: Record<string, string | number | undefined> = {}) {
  const url = new URL(`${WP_API.replace(/\/$/, "")}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function wpFetch<T>(path: string, params?: Record<string, string | number | undefined>) {
  const res = await fetch(apiUrl(path, params), { next: { revalidate } });

  if (!res.ok) {
    throw new Error(`WordPress request failed: ${path}`);
  }

  return res.json() as Promise<T>;
}

async function wpFetchPaginated(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<PaginatedPosts> {
  const res = await fetch(apiUrl(path, params), { next: { revalidate } });

  if (!res.ok) {
    throw new Error(`WordPress request failed: ${path}`);
  }

  return {
    posts: (await res.json()) as WPPost[],
    total: Number(res.headers.get("x-wp-total") ?? 0),
    totalPages: Number(res.headers.get("x-wp-totalpages") ?? 0),
  };
}

function listParam(value?: number | number[]) {
  return Array.isArray(value) ? value.join(",") : value;
}

export async function getPosts(options: GetPostsOptions = {}) {
  return wpFetch<WPPost[]>("/wp/v2/posts", {
    _embed: 1,
    per_page: options.perPage ?? 10,
    page: options.page ?? 1,
    categories: listParam(options.categories),
    exclude: listParam(options.exclude),
    search: options.search,
  });
}

export async function getPaginatedPosts(options: GetPostsOptions = {}) {
  return wpFetchPaginated("/wp/v2/posts", {
    _embed: 1,
    per_page: options.perPage ?? 10,
    page: options.page ?? 1,
    categories: listParam(options.categories),
    exclude: listParam(options.exclude),
    search: options.search,
  });
}

export async function getPostBySlug(slug: string) {
  const posts = await wpFetch<WPPost[]>("/wp/v2/posts", {
    _embed: 1,
    slug: encodeURIComponent(slug),
    per_page: 1,
  });

  return posts[0] ?? null;
}

export async function getCategories() {
  const categories = await wpFetch<WPCategory[]>("/wp/v2/categories", {
    per_page: 100,
    orderby: "count",
    order: "desc",
  });

  return categories.map(normalizeCategory);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await wpFetch<WPCategory[]>("/wp/v2/categories", {
    slug: encodeURIComponent(resolveCategorySlug(slug)),
    per_page: 1,
  });

  return categories[0] ? normalizeCategory(categories[0]) : null;
}

export async function getPostsByCategory(slug: string, page = 1, perPage = 9) {
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { category: null, posts: [], total: 0, totalPages: 0 };
  }

  const result = await getPaginatedPosts({
    categories: category.id,
    page,
    perPage,
  });

  return { category, ...result };
}

export async function getAuthors() {
  return wpFetch<WPAuthor[]>("/wp/v2/users", {
    per_page: 100,
  });
}

export function decodeHtml(value = "") {
  return value
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function stripHtml(value = "") {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

export function getPostTitle(post: WPPost) {
  return decodeHtml(post.title.rendered);
}

export function getPostExcerpt(post: WPPost, fallbackLength = 170) {
  const excerpt = stripHtml(post.excerpt.rendered);

  if (excerpt) return excerpt;

  return `${stripHtml(post.content.rendered).slice(0, fallbackLength).trim()}...`;
}

export function getPostAuthor(post: WPPost) {
  return post._embedded?.author?.[0]?.name ?? "SA Homeschooling";
}

export function getPostCategories(post: WPPost) {
  return (post._embedded?.["wp:term"]?.[0] ?? []).map(normalizeCategory);
}

export function getPrimaryCategory(post: WPPost) {
  return getPostCategories(post)[0]?.name ?? "SA Homeschooling";
}

export function getFeaturedImage(post: WPPost) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;

  return {
    src:
      sizes?.large?.source_url ??
      sizes?.medium_large?.source_url ??
      sizes?.full?.source_url ??
      media?.source_url ??
      "/images/hero-placeholder.svg",
    alt: media?.alt_text || getPostTitle(post),
    width: sizes?.large?.width ?? media?.media_details?.width ?? 1200,
    height: sizes?.large?.height ?? media?.media_details?.height ?? 800,
  };
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
