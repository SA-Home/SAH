const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? "https://sahomeschooling.com/wp-json";

export type WPAuthor = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  email?: string;
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

export type WPPage = {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content: { rendered: string };
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
  };
};

export type PaginatedPosts = {
  posts: WPPost[];
  total: number;
  totalPages: number;
};

export type MagazineIssue = {
  id: string;
  slug: string;
  title: string;
  issueNumber?: string;
  description: string;
  pdfUrl?: string;
  embedUrl?: string;
  dflipId?: string;
  dflipOption?: DFlipOption;
  coverImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  sourcePost?: WPPost;
};

export type DFlipOption = {
  id?: number | string;
  source?: string;
  outline?: unknown[];
  overwritePDFOutline?: boolean;
  pageSize?: string;
  slug?: string;
  wpOptions?: string;
  thumb?: string;
  thumbnail?: string;
  title?: string;
  [key: string]: unknown;
};

export type AdPlacement =
  | "home-top"
  | "home-middle"
  | "home-bottom"
  | "article-top"
  | "article-inline"
  | "article-sidebar"
  | "category-top"
  | "magazine-top"
  | "directory-top"
  | "subscribe-bottom";

export type SiteAd = {
  id: string;
  placement: AdPlacement;
  dataUnit: string;
  sizeClass: string;
  html?: string;
};

type WPAdCode = {
  id: number;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string };
  meta?: Record<string, unknown>;
  acf?: Record<string, unknown>;
};

type GetPostsOptions = {
  perPage?: number;
  page?: number;
  categories?: number | number[];
  exclude?: number | number[];
  search?: string;
  embed?: string | number;
};

const revalidate = 3600;

const categoryAliases: Record<string, string> = {
  education: "newspack-featured",
  parenting: "partner",
  "ask-dalena": "newspack-ask-dalena",
  "cooking-bonding": "cooking-and-bonding",
};

const fallbackAds: Record<AdPlacement, SiteAd> = {
  "home-top": {
    id: "ad-home-above-menu",
    placement: "home-top",
    dataUnit: "newspack_home_above_menu",
    sizeClass: "google-ad-slot--leaderboard",
  },
  "home-middle": {
    id: "ad-after-hero",
    placement: "home-middle",
    dataUnit: "newspack_after_hero",
    sizeClass: "google-ad-slot--leaderboard",
  },
  "home-bottom": {
    id: "ad-footer-wide",
    placement: "home-bottom",
    dataUnit: "newspack_home_footer",
    sizeClass: "google-ad-slot--leaderboard",
  },
  "article-top": {
    id: "ad-article-top",
    placement: "article-top",
    dataUnit: "newspack_article_top",
    sizeClass: "google-ad-slot--leaderboard-sm",
  },
  "article-inline": {
    id: "ad-article-inline",
    placement: "article-inline",
    dataUnit: "newspack_article_inline",
    sizeClass: "google-ad-slot--leaderboard",
  },
  "article-sidebar": {
    id: "ad-article-sidebar",
    placement: "article-sidebar",
    dataUnit: "newspack_article_sidebar",
    sizeClass: "google-ad-slot--medium-rect",
  },
  "category-top": {
    id: "ad-category-top",
    placement: "category-top",
    dataUnit: "newspack_education_top",
    sizeClass: "google-ad-slot--leaderboard-sm",
  },
  "magazine-top": {
    id: "ad-magazines-bottom",
    placement: "magazine-top",
    dataUnit: "newspack_magazines_bottom",
    sizeClass: "google-ad-slot--leaderboard",
  },
  "directory-top": {
    id: "ad-directory-sidebar",
    placement: "directory-top",
    dataUnit: "newspack_directory_sidebar",
    sizeClass: "google-ad-slot--directory-rect",
    html: `
      <div class="directory-ad-placeholder">
        <span>Advertisement</span>
        <strong>Reach homeschool families</strong>
        <p>Showcase your learning resources, services, or events to South African parents.</p>
      </div>
    `,
  },
  "subscribe-bottom": {
    id: "ad-newsletter-leaderboard",
    placement: "subscribe-bottom",
    dataUnit: "newspack_newsletter_footer",
    sizeClass: "google-ad-slot--leaderboard",
  },
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function logWordPressError(context: string, error: unknown) {
  console.warn(`[wordpress] ${context}: ${getErrorMessage(error)}`);
}

function emptyPaginatedPosts(): PaginatedPosts {
  return {
    posts: [],
    total: 0,
    totalPages: 0,
  };
}

async function wpFetch<T>(path: string, params?: Record<string, string | number | undefined>) {
  const url = apiUrl(path, params);
  let res: Response;

  try {
    res = await fetch(url, { next: { revalidate } });
  } catch (error) {
    throw new Error(`WordPress request failed: ${url} (${getErrorMessage(error)})`);
  }

  if (!res.ok) {
    throw new Error(`WordPress request failed (${res.status} ${res.statusText}): ${url}`);
  }

  return res.json() as Promise<T>;
}

async function wpFetchPaginated(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<PaginatedPosts> {
  const url = apiUrl(path, params);
  let res: Response;

  try {
    res = await fetch(url, { next: { revalidate } });
  } catch (error) {
    throw new Error(`WordPress request failed: ${url} (${getErrorMessage(error)})`);
  }

  if (!res.ok) {
    throw new Error(`WordPress request failed (${res.status} ${res.statusText}): ${url}`);
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
  try {
    return await wpFetch<WPPost[]>("/wp/v2/posts", {
      _embed: options.embed ?? 1,
      per_page: options.perPage ?? 10,
      page: options.page ?? 1,
      categories: listParam(options.categories),
      exclude: listParam(options.exclude),
      search: options.search,
    });
  } catch (error) {
    logWordPressError("getPosts failed", error);
    return [];
  }
}

export async function getPaginatedPosts(options: GetPostsOptions = {}) {
  try {
    return await wpFetchPaginated("/wp/v2/posts", {
      _embed: 1,
      per_page: options.perPage ?? 10,
      page: options.page ?? 1,
      categories: listParam(options.categories),
      exclude: listParam(options.exclude),
      search: options.search,
    });
  } catch (error) {
    logWordPressError("getPaginatedPosts failed", error);
    return emptyPaginatedPosts();
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const posts = await wpFetch<WPPost[]>("/wp/v2/posts", {
      _embed: 1,
      slug: encodeURIComponent(slug),
      per_page: 1,
    });

    return posts[0] ?? null;
  } catch (error) {
    logWordPressError(`getPostBySlug failed for "${slug}"`, error);
    return null;
  }
}

export async function getCategories() {
  try {
    const categories = await wpFetch<WPCategory[]>("/wp/v2/categories", {
      per_page: 100,
      orderby: "count",
      order: "desc",
    });

    return categories.map(normalizeCategory);
  } catch (error) {
    logWordPressError("getCategories failed", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const categories = await wpFetch<WPCategory[]>("/wp/v2/categories", {
      slug: encodeURIComponent(resolveCategorySlug(slug)),
      per_page: 1,
    });

    return categories[0] ? normalizeCategory(categories[0]) : null;
  } catch (error) {
    logWordPressError(`getCategoryBySlug failed for "${slug}"`, error);
    return null;
  }
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
  try {
    const authors = await wpFetch<WPAuthor[]>("/wp/v2/users", {
      per_page: 100,
    });

    return authors.map(normalizeAuthor);
  } catch (error) {
    logWordPressError("getAuthors failed", error);
    return [];
  }
}

export async function getAuthorBySlug(slug: string) {
  try {
    const authors = await wpFetch<WPAuthor[]>("/wp/v2/users", {
      slug: encodeURIComponent(slug),
      per_page: 1,
    });

    return authors[0] ? normalizeAuthor(authors[0]) : null;
  } catch (error) {
    logWordPressError(`getAuthorBySlug failed for "${slug}"`, error);
    return null;
  }
}

export async function getPostsByAuthor(authorId: number, perPage = 12) {
  try {
    return await wpFetch<WPPost[]>("/wp/v2/posts", {
      _embed: 1,
      author: authorId,
      per_page: perPage,
    });
  } catch (error) {
    logWordPressError(`getPostsByAuthor failed for "${authorId}"`, error);
    return [];
  }
}

export async function getMagazineEmbedData() {
  const page = await getMagazineWordPressPage();

  if (!page) return [];

  return parseDFlipIssues(page.content.rendered);
}

export async function getMagazinePosts() {
  const [embedResult, postResult] = await Promise.allSettled([
    getMagazineEmbedData(),
    getMagazineRelatedPosts(),
  ]);
  const embedIssues = embedResult.status === "fulfilled" ? embedResult.value : [];
  const posts = postResult.status === "fulfilled" ? postResult.value : [];
  const usedPostIds = new Set<number>();

  const issues = embedIssues.map((issue) => {
    const matchedPost = findMagazinePost(issue, posts);

    if (matchedPost) usedPostIds.add(matchedPost.id);

    return {
      ...issue,
      title: matchedPost ? getPostTitle(matchedPost) : issue.title,
      description: matchedPost ? getPostExcerpt(matchedPost) : issue.description,
      coverImage: matchedPost ? getFeaturedImage(matchedPost) : issue.coverImage,
      sourcePost: matchedPost,
    };
  });

  posts
    .filter((post) => !usedPostIds.has(post.id))
    .forEach((post) => {
      const pdfUrl = extractFirstPdfUrl(post.content.rendered);

      issues.push({
        id: String(post.id),
        slug: post.slug,
        title: getPostTitle(post),
        issueNumber: extractIssueNumber(`${getPostTitle(post)} ${post.slug}`),
        description: getPostExcerpt(post),
        pdfUrl,
        embedUrl: pdfUrl,
        coverImage: getFeaturedImage(post),
        sourcePost: post,
      });
    });

  return dedupeMagazineIssues(issues);
}

export async function getMagazineBySlug(slug: string) {
  const issues = await getMagazinePosts();

  return issues.find((issue) => issue.slug === slug || issue.sourcePost?.slug === slug) ?? null;
}

export async function getAds() {
  const ads = { ...fallbackAds };

  try {
    const wpAds = await wpFetch<WPAdCode[]>("/wp/v2/newspack_ad_codes", {
      per_page: 100,
    });

    wpAds.forEach((wpAd) => {
      const placement = resolveAdPlacement(wpAd);

      if (!placement) return;

      const fallback = ads[placement];

      ads[placement] = {
        ...fallback,
        id: `wp-ad-${wpAd.id}`,
        html: sanitizeAdHtml(wpAd.content?.rendered ?? ""),
      };
    });
  } catch (error) {
    logWordPressError("getAds failed", error);
    return Object.values(ads);
  }

  return Object.values(ads);
}

export async function getAdByPlacement(placement: AdPlacement) {
  const ads = await getAds();

  return ads.find((ad) => ad.placement === placement) ?? fallbackAds[placement];
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

export function getPostAuthorSlug(post: WPPost) {
  return post._embedded?.author?.[0]?.slug ?? "";
}

export function getPostAuthorProfile(post: WPPost) {
  const author = post._embedded?.author?.[0];

  return author ? normalizeAuthor(author) : null;
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

function normalizeAuthor(author: WPAuthor): WPAuthor {
  return {
    ...author,
    name: decodeHtml(author.name),
    description: stripHtml(author.description ?? ""),
  };
}

export function getAuthorBio(author: WPAuthor | null | undefined) {
  return author?.description || "SA Homeschooling contributor.";
}

export function getAuthorAvatar(author: WPAuthor | null | undefined) {
  const avatars = author?.avatar_urls;
  const src = avatars?.["192"] ?? avatars?.["96"] ?? avatars?.["48"] ?? avatars?.["24"];

  return src
    ? {
        src,
        alt: author?.name ? `${author.name} profile image` : "Author profile image",
      }
    : null;
}

export function getAuthorEmail(author: WPAuthor | null | undefined) {
  return author?.email || null;
}

async function getMagazineWordPressPage() {
  try {
    const pages = await wpFetch<WPPage[]>("/wp/v2/pages", {
      _embed: 1,
      slug: "magazine",
      per_page: 1,
    });

    if (pages[0]) return pages[0];

    return await wpFetch<WPPage>("/wp/v2/pages/1788", {
      _embed: 1,
    });
  } catch (error) {
    logWordPressError("getMagazineWordPressPage failed", error);
    return null;
  }
}

async function getMagazineRelatedPosts() {
  const [magazineResult, issueResult] = await Promise.allSettled([
    getPosts({ perPage: 20, search: "magazine", embed: "wp:featuredmedia" }),
    getPosts({ perPage: 20, search: "issue", embed: "wp:featuredmedia" }),
  ]);
  const posts = [
    ...(magazineResult.status === "fulfilled" ? magazineResult.value : []),
    ...(issueResult.status === "fulfilled" ? issueResult.value : []),
  ];
  const seen = new Set<number>();

  return posts
    .filter((post) => {
      const haystack = `${post.slug} ${getPostTitle(post)} ${getPostExcerpt(post)} ${stripHtml(post.content.rendered)}`.toLowerCase();
      const isMagazine = haystack.includes("magazine") || haystack.includes("issue") || haystack.includes(".pdf");

      if (!isMagazine || seen.has(post.id)) return false;

      seen.add(post.id);
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function parseDFlipIssues(content: string): MagazineIssue[] {
  const paragraphs = Array.from(content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map((match) => stripHtml(match[1]))
    .filter((text) => text.length > 40);
  const scriptMatches = Array.from(
    content.matchAll(/window\.(df_option_\d+)\s*=\s*({[\s\S]*?})\s*;\s*if\s*\(window\.DFLIP/g),
  );

  return scriptMatches
    .map((match, index) => {
      const option = parseDFlipOption(match[2]);
      const pdfUrl = normalizePublicUrl(option?.source);
      const slug = option?.slug || slugFromUrl(pdfUrl) || `magazine-${option?.id ?? index + 1}`;
      const title = option?.title && option.title !== slug ? decodeHtml(option.title) : titleFromSlug(slug);
      const description =
        paragraphs[index] || `${title} is available to read online as part of the SA Homeschooling & Beyond archive.`;
      const coverUrl = normalizePublicUrl(option?.thumb || option?.thumbnail);

      return {
        id: String(option?.id ?? slug),
        slug,
        title,
        issueNumber: extractIssueNumber(`${title} ${slug} ${pdfUrl ?? ""}`),
        description,
        pdfUrl,
        embedUrl: `/magazines/embed/${slug}`,
        dflipId: String(option?.id ?? slug),
        dflipOption: option ?? undefined,
        coverImage: coverUrl
          ? {
              src: coverUrl,
              alt: `${title} cover`,
              width: 800,
              height: 1100,
            }
          : undefined,
      };
    })
    .filter((issue) => issue.pdfUrl || issue.embedUrl);
}

function parseDFlipOption(value: string) {
  try {
    return JSON.parse(value) as DFlipOption;
  } catch {
    return null;
  }
}

function findMagazinePost(issue: MagazineIssue, posts: WPPost[]) {
  const issueText = normalizeText(`${issue.slug} ${issue.title} ${issue.pdfUrl ?? ""}`);

  return posts.find((post) => {
    const postText = normalizeText(`${post.slug} ${getPostTitle(post)} ${getPostExcerpt(post)} ${post.content.rendered}`);

    return postText.includes(issueText) || issueText.includes(post.slug) || sharesMagazineDate(issueText, postText);
  });
}

function dedupeMagazineIssues(issues: MagazineIssue[]) {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = issue.pdfUrl || issue.slug;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function sharesMagazineDate(a: string, b: string) {
  const year = a.match(/20\d{2}/)?.[0];

  if (!year || !b.includes(year)) return false;

  const seasons = ["summer", "spring", "winter", "autumn", "march", "april", "february", "june", "december"];

  return seasons.some((season) => a.includes(season) && b.includes(season));
}

function extractFirstPdfUrl(value: string) {
  return normalizePublicUrl(value.match(/https?:\/\/[^"'\s<>]+\.pdf/gi)?.[0]);
}

function normalizePublicUrl(value?: string) {
  if (!value) return undefined;

  const cleaned = decodeHtml(value).replace(/\\\//g, "/").trim();

  try {
    const url = new URL(cleaned, "https://sahomeschooling.com");

    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return undefined;
  }

  return undefined;
}

function slugFromUrl(value?: string) {
  if (!value) return "";

  const filename = value.split("/").pop()?.replace(/\.pdf(\?.*)?$/i, "") ?? "";

  return filename.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => (part.length <= 3 ? part.toUpperCase() : `${part[0].toUpperCase()}${part.slice(1)}`))
    .join(" ");
}

function extractIssueNumber(value: string) {
  return value.match(/issue[-_\s]*(\d+)/i)?.[1];
}

function normalizeText(value: string) {
  return stripHtml(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function resolveAdPlacement(ad: WPAdCode): AdPlacement | null {
  const haystack = normalizeText(`${ad.slug} ${ad.title.rendered} ${ad.content?.rendered ?? ""}`);
  const direct = Object.keys(fallbackAds).find((placement) => haystack.includes(placement.replace("-", " ")));

  if (direct) return direct as AdPlacement;

  const dataUnit = Object.values(fallbackAds).find((fallback) => haystack.includes(normalizeText(fallback.dataUnit)));

  return dataUnit?.placement ?? null;
}

function sanitizeAdHtml(html: string) {
  if (!html || /<script/i.test(html)) return undefined;

  return html
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();
}
