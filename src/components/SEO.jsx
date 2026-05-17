import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, image, path = '' }) {
  const siteUrl = 'https://phonosium.com'
  const fullUrl = `${siteUrl}${path}`
  const ogImage = image || `${siteUrl}/og-image.png`

  return (
    <Helmet>
      <title>{title} | Phonosium</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={`${title} | Phonosium`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={`${title} | Phonosium`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  )
}
