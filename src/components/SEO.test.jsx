import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import SEO from './SEO'

describe('SEO', () => {
  it('renders just "Phonosium" when no title prop is provided', () => {
    const helmetContext = {}
    render(
      <HelmetProvider context={helmetContext}>
        <SEO description="Test description" path="/" />
      </HelmetProvider>
    )

    const { helmet } = helmetContext
    expect(helmet.title.toString()).toContain('Phonosium')
    expect(helmet.title.toString()).not.toContain('|')
  })

  it('renders "{title} | Phonosium" when title prop is provided', () => {
    const helmetContext = {}
    render(
      <HelmetProvider context={helmetContext}>
        <SEO title="About" description="Test description" path="/about" />
      </HelmetProvider>
    )

    const { helmet } = helmetContext
    expect(helmet.title.toString()).toContain('About | Phonosium')
  })

  it('applies title to Open Graph meta tag', () => {
    const helmetContext = {}
    render(
      <HelmetProvider context={helmetContext}>
        <SEO title="Test Page" description="Test description" path="/test" />
      </HelmetProvider>
    )

    const { helmet } = helmetContext
    const ogTitle = helmet.meta
      .toComponent()
      .find(tag => tag.props.property === 'og:title')
    expect(ogTitle).toBeDefined()
  })

  it('applies title to Twitter meta tag', () => {
    const helmetContext = {}
    render(
      <HelmetProvider context={helmetContext}>
        <SEO title="Test Page" description="Test description" path="/test" />
      </HelmetProvider>
    )

    const { helmet } = helmetContext
    const twitterTitle = helmet.meta
      .toComponent()
      .find(tag => tag.props.name === 'twitter:title')
    expect(twitterTitle).toBeDefined()
  })
})
