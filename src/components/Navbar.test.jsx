import { describe, it, expect } from 'vite-plus/test'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { testAccessibility } from '../test/axe-utils'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    await testAccessibility(container)
  })
})
