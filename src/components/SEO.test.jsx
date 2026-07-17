import { describe, it, expect, beforeEach, afterEach } from 'vite-plus/test'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import SEO from './SEO'

describe('SEO', () => {
  let originalTitle

  beforeEach(() => {
    originalTitle = document.title
  })

  afterEach(() => {
    document.title = originalTitle
  })

  it('renders just "Phonosium" when no title prop is provided', async () => {
    render(
      <HelmetProvider>
        <SEO description="Test description" path="/" />
      </HelmetProvider>
    )

    await waitFor(() => {
      expect(document.title).toBe('Phonosium')
    })
  })

  it('renders "{title} | Phonosium" when title prop is provided', async () => {
    render(
      <HelmetProvider>
        <SEO title="About" description="Test description" path="/about" />
      </HelmetProvider>
    )

    await waitFor(() => {
      expect(document.title).toBe('About | Phonosium')
    })
  })

  it('renders with different page titles', async () => {
    const { rerender } = render(
      <HelmetProvider>
        <SEO
          title="Call for Submissions"
          description="Test description"
          path="/contribute"
        />
      </HelmetProvider>
    )

    await waitFor(() => {
      expect(document.title).toBe('Call for Submissions | Phonosium')
    })

    rerender(
      <HelmetProvider>
        <SEO
          title="404 - Page Not Found"
          description="Test description"
          path="/404"
        />
      </HelmetProvider>
    )

    await waitFor(() => {
      expect(document.title).toBe('404 - Page Not Found | Phonosium')
    })
  })

  it('includes meta tags', async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Page" description="Test description" path="/test" />
      </HelmetProvider>
    )

    await waitFor(() => {
      const ogTitle = document.querySelector('meta[property="og:title"]')
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')
      expect(ogTitle).toBeTruthy()
      expect(twitterTitle).toBeTruthy()
    })
  })
})
