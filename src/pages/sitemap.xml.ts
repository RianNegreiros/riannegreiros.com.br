import { fetchSanityData, queries } from '@/lib'
import type { APIContext } from 'astro'

const STATIC_ROUTES = ['/', '/blog', '/projects', '/resume']

export async function GET(context: APIContext) {
  const posts = await fetchSanityData<any>(queries.sitemap)

  const baseUrl = context.site!.href.replace(/\/$/, '')
  const today = new Date().toISOString().split('T')[0]

  const staticUrls = STATIC_ROUTES.map(
    (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
  ).join('')

  type SitemapPost = {
    slug: string
    language: 'pt' | 'en'
    translationSlug?: string | null
    firstPublishedDate: string
    updatedAt?: string
  }

  const pathFor = (lang: 'pt' | 'en', slug: string) =>
    lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`

  const blogUrls = posts
    .map((post: SitemapPost) => {
      const lastmod = post.updatedAt ?? post.firstPublishedDate
      const ageMs = Date.now() - new Date(lastmod).getTime()
      const priority = ageMs < 90 * 24 * 60 * 60 * 1000 ? '0.9' : '0.8'

      let alternates = ''
      if (post.translationSlug) {
        const ptPath =
          post.language === 'pt'
            ? pathFor('pt', post.slug)
            : pathFor('pt', post.translationSlug)
        const enPath =
          post.language === 'en'
            ? pathFor('en', post.slug)
            : pathFor('en', post.translationSlug)
        alternates = `
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${baseUrl}${ptPath}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${enPath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${ptPath}" />`
      }

      return `
  <url>
    <loc>${baseUrl}${pathFor(post.language, post.slug)}</loc>
    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>${alternates}
  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${blogUrls}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
