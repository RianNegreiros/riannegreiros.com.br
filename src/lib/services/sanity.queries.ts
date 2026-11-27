const PT = `coalesce(language, 'pt') == 'pt'`

const TRANSLATION = `"translation": select(
        language == 'en' => translationOf->{ "slug": slug.current },
        *[_type == 'post' && language == 'en' && translationOf._ref == ^._id][0]{ "slug": slug.current }
      )`

export const queries = {
  posts: {
    list: (start: number, end: number, searchQuery?: string) => {
      const baseFilter = `_type == 'post' && ${PT} && defined(firstPublishedDate)`
      let query = `*[${baseFilter}`

      if (searchQuery) {
        query += ` && (title match $searchQuery || overview match $searchQuery)]`
      } else {
        query += ']'
      }

      query += ` | order(firstPublishedDate desc) [${start}...${end}] {
        _id,
        title,
        overview,
        "slug": slug.current,
        firstPublishedDate
      }`

      return {
        query,
        params: searchQuery ? { searchQuery: `*${searchQuery}*` } : {},
      }
    },
    bySlug: `*[_type == 'post' && coalesce(language, 'pt') == $lang && slug.current == $slug][0]{
      _id,
      title,
      "language": coalesce(language, 'pt'),
      ${TRANSLATION},
      firstPublishedDate,
      updatedAt,
      "slug": slug.current,
      overview,
      image{
        asset->{
          _id,
          url,
          metadata{
            lqip,
            dimensions
          }
        }
      },
        content[]{
          ...,
          asset->{
            _id,
            url,
            metadata{
              dimensions
            }
          }
        },
      "headings": content[_type == "block" && style match "h*"]{
        "text": pt::text(@),
        "level": style
      }
    }`,
    count: `count(*[_type == 'post' && ${PT} && defined(firstPublishedDate)])`,
  },
  projects: {
    list: `*[_type == 'project'] | order(_createdAt desc) {
      _id,
      title,
      link,
      description,
      tags,
      image,
      "createdAt": _createdAt
    }`,
  },
  portfolio: {
    search: (searchParam: string) => ({
      query: `*[_type in ['post', 'project'] && ${PT} && defined(title) && (title match $searchQuery || overview match $searchQuery || description match $searchQuery)]{
        _id,
        _type,
        title,
        "slug": slug.current,
        overview,
        description,
        firstPublishedDate,
        _createdAt
      } | order(coalesce(firstPublishedDate, _createdAt) desc)`,
      params: { searchQuery: `*${searchParam}*` },
    }),
    count: `count(*[_type in ['post', 'project'] && ${PT} && defined(title)])`,
    timeline: (start: number, limit: number) => ({
      query: `*[_type in ["post", "project"] && ${PT} && defined(title) && (_type == "project" || defined(firstPublishedDate))] | order(coalesce(firstPublishedDate, _createdAt) desc) [$start...$end] {
        _id,
        _type,
        title,
        "slug": slug.current,
        overview,
        description,
        link,
        "displayDate": coalesce(firstPublishedDate, _createdAt),
        _createdAt
      }`,
      params: { start, end: start + limit },
    }),
  },
  rss: `
    *[_type == 'post' && ${PT} && defined(slug.current) && defined(firstPublishedDate)]
    | order(firstPublishedDate desc) {
      title,
      "slug": slug.current,
      overview,
      firstPublishedDate,
      image{
        asset->{
          url
        }
      },
      content[]{
        ...,
        asset->{
          _id,
          url,
          metadata{
            dimensions
          }
        }
      }
    }
  `,
  sitemap: `
    *[_type == 'post' && defined(slug.current) && defined(firstPublishedDate)]
    | order(firstPublishedDate desc) {
      "slug": slug.current,
      "language": coalesce(language, 'pt'),
      "translationSlug": select(
        language == 'en' => translationOf->slug.current,
        *[_type == 'post' && language == 'en' && translationOf._ref == ^._id][0].slug.current
      ),
      firstPublishedDate,
      updatedAt
    }
  `,
}
