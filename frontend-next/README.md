# SA Homeschooling & Beyond Frontend

This is the active Next.js website for SA Homeschooling & Beyond.

The site is a headless WordPress frontend. WordPress stays responsible for editorial content, while this app renders the public website with Next.js App Router, TypeScript, React, and Tailwind CSS.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 through PostCSS
- WordPress REST API as the primary content source
- Local JSON/content fallbacks for resilience
- Google Publisher Tag ad slots
- Node.js production server through `server.js`

## Local Development

From this folder:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If dependencies are missing, run:

```bash
npm install
```

## Commands

```bash
npm run dev      # Start the local development server
npm run build    # Build the production app
npm start        # Start the custom production server
npm run lint     # Run ESLint
```

`npm start` runs:

```bash
node server.js
```

The server listens on `process.env.PORT` when provided, which is important for Hostinger-style Node.js hosting.

## Main Routes

```text
/                       Homepage
/articles               Education article archive
/articles/[slug]        Dynamic WordPress article
/category/[slug]        Dynamic WordPress category archive
/tag/[slug]             Dynamic WordPress tag archive
/authors                WordPress author listing
/authors/[slug]         WordPress author profile
/magazines              Magazine archive
/magazines/embed/[slug] DFlip/PDF magazine viewer
/directory              Partner directory
/directory/[slug]       Partner detail page
/subscribe              Newsletter page
/api/magazine-pdf       PDF proxy for allowed magazine PDFs
/api/wordpress/deploy   WordPress revalidation webhook
```

## Environment Variables

```text
NEXT_PUBLIC_WP_API_URL=https://sahomeschooling.com/wp-json
NEXT_PUBLIC_SITE_URL=https://sahomeschooling.com
NEXT_PUBLIC_GOOGLE_AD_NETWORK_CODE=23298734611
WORDPRESS_WEBHOOK_SECRET=choose-a-secure-secret
VERCEL_DEPLOY_HOOK_URL=
```

`VERCEL_DEPLOY_HOOK_URL` is optional. It is only needed when the WordPress webhook should also trigger a Vercel deployment hook.

## Important Files

```text
app/                    App Router pages and API routes
components/             Shared UI and client components
lib/wordpress.ts        WordPress data access, fallback content, helpers, ads, magazines
lib/partners.ts         Static partner directory data
data/wp-fallback-posts.json
public/images/          Site imagery and migrated assets
public/magazines/       Local magazine PDFs
public/magazine-covers/ Local magazine cover images
server.js               Custom production server
docs/architecture.md    Developer architecture guide
```

## Content Model

The site fetches posts, categories, tags, authors, media, and ad codes from the WordPress REST API configured by `NEXT_PUBLIC_WP_API_URL`.

Partners are currently local static data in `lib/partners.ts`.

Magazine issues are currently local curated data in `lib/wordpress.ts`, backed by PDFs and cover images in `public/`.

Newsletter signup forms currently store completion state in the visitor browser and show an acknowledgement. They are not yet connected to an email platform or backend submission API.

## Deployment

Deploy this `frontend-next/` directory as the Node.js app.

```bash
npm install
npm run build
npm start
```

For a broader handoff, see:

- [Architecture](docs/architecture.md)
- [Site Documentation](docs/site-documentation.md)
- [WordPress Webhook](docs/wordpress-vercel-webhook.md)
