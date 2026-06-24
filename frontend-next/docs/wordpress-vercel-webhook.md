# WordPress to Vercel Deploy Webhook

The site uses ISR for WordPress data with a 1 hour cache window. Configure this webhook so published WordPress posts are visible immediately instead of waiting for the next scheduled revalidation.

## Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

- `VERCEL_DEPLOY_HOOK_URL`: the Deploy Hook URL from Vercel Project Settings -> Git -> Deploy Hooks.
- `WORDPRESS_WEBHOOK_SECRET`: a long random secret shared with WordPress.

## WordPress Webhook

Configure WordPress to send a `POST` request when a post is published:

```text
https://your-vercel-domain.vercel.app/api/wordpress/deploy?secret=WORDPRESS_WEBHOOK_SECRET
```

Preferred header form:

```text
x-wordpress-webhook-secret: WORDPRESS_WEBHOOK_SECRET
```

The endpoint revalidates `/`, `/articles`, `/directory`, the article path when a slug is present, and any category paths included in the payload. It then calls the Vercel Deploy Hook URL when configured.
