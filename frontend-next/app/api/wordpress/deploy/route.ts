import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type WordPressWebhookPayload = {
  post?: {
    post_name?: string;
    post_status?: string;
    slug?: string;
    status?: string;
    categories?: string[];
  };
  slug?: string;
  status?: string;
  post_status?: string;
  categories?: string[];
};

const staticPaths = ["/", "/articles", "/directory"];

function getSecret(request: NextRequest) {
  return request.headers.get("x-wordpress-webhook-secret") ?? request.nextUrl.searchParams.get("secret");
}

function getPostSlug(payload: WordPressWebhookPayload) {
  return payload.post?.slug ?? payload.post?.post_name ?? payload.slug;
}

function getPostStatus(payload: WordPressWebhookPayload) {
  return payload.post?.status ?? payload.post?.post_status ?? payload.status ?? payload.post_status;
}

function getCategorySlugs(payload: WordPressWebhookPayload) {
  return payload.post?.categories ?? payload.categories ?? [];
}

async function triggerVercelDeployHook() {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployHookUrl) {
    return { skipped: true, reason: "VERCEL_DEPLOY_HOOK_URL is not configured" };
  }

  const response = await fetch(deployHookUrl, {
    method: "POST",
  });

  return {
    skipped: false,
    ok: response.ok,
    status: response.status,
  };
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.WORDPRESS_WEBHOOK_SECRET;

  if (!expectedSecret) {
    return NextResponse.json({ error: "WORDPRESS_WEBHOOK_SECRET is not configured" }, { status: 500 });
  }

  if (getSecret(request) !== expectedSecret) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as WordPressWebhookPayload;
  const status = getPostStatus(payload);

  if (status && status !== "publish") {
    return NextResponse.json({ revalidated: false, skipped: `Ignoring WordPress status: ${status}` });
  }

  const paths = new Set(staticPaths);
  const slug = getPostSlug(payload);

  if (slug) {
    paths.add(`/articles/${slug}`);
  }

  getCategorySlugs(payload).forEach((categorySlug) => {
    paths.add(`/category/${categorySlug}`);
  });

  paths.forEach((path) => revalidatePath(path));

  const deployHook = await triggerVercelDeployHook();

  return NextResponse.json({
    revalidated: true,
    paths: [...paths],
    deployHook,
  });
}
