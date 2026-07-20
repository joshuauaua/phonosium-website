import { describe, it, expect } from 'vite-plus/test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { testAccessibility } from '../test/axe-utils'
import ExpandableSection from './ExpandableSection'

describe('ExpandableSection', () => {
  describe('rendering', () => {
    it('renders the section number and title in the header button', () => {
      render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      expect(screen.getByText('1. Getting Started')).toBeInTheDocument()
    })

    it('renders children inside the content area', () => {
      render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Some child content</p>
        </ExpandableSection>
      )

      expect(screen.getByText('Some child content')).toBeInTheDocument()
    })

    it('has aria-hidden="true" on the content panel when collapsed', () => {
      const { container } = render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      const contentPanel = container.querySelector('[aria-hidden]')
      expect(contentPanel).toHaveAttribute('aria-hidden', 'true')
    })

    it('has aria-expanded="false" on the button when collapsed', () => {
      render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'false'
      )
    })

    it('shows the chevron-down icon when collapsed', () => {
      const { container } = render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      const polyline = container.querySelector('polyline')
      expect(polyline).toHaveAttribute('points', '6 9 12 15 18 9')
    })

    it('does not apply the expanded class to the content wrapper when collapsed', () => {
      const { container } = render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      const contentPanel = container.querySelector('[aria-hidden]')
      expect(contentPanel.className).not.toMatch(/expanded/)
    })
  })

  describe('click interaction', () => {
    it('expands the content when the header button is clicked', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      await user.click(screen.getByRole('button'))

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true'
      )
      const contentPanel = container.querySelector('[aria-hidden]')
      expect(contentPanel).toHaveAttribute('aria-hidden', 'false')
      expect(contentPanel.className).toMatch(/expanded/)
    })

    it('collapses the content when clicked again', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      const button = screen.getByRole('button')
      await user.click(button)
      await user.click(button)

      expect(button).toHaveAttribute('aria-expanded', 'false')
      const contentPanel = container.querySelector('[aria-hidden]')
      expect(contentPanel).toHaveAttribute('aria-hidden', 'true')
      expect(contentPanel.className).not.toMatch(/expanded/)
    })

    it('shows chevron-up icon when expanded and chevron-down when collapsed again', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      const button = screen.getByRole('button')
      await user.click(button)

      expect(container.querySelector('polyline')).toHaveAttribute(
        'points',
        '18 15 12 9 6 15'
      )

      await user.click(button)

      expect(container.querySelector('polyline')).toHaveAttribute(
        'points',
        '6 9 12 15 18 9'
      )
    })
  })

  describe('keyboard interaction', () => {
    it('toggles expansion when Enter is pressed on the button', async () => {
      const user = userEvent.setup()
      render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')

      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('toggles expansion when Space is pressed on the button', async () => {
      const user = userEvent.setup()
      render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard(' ')

      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('does not toggle expansion for other keys such as Tab', async () => {
      const user = userEvent.setup()
      render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Tab}')

      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('accessibility', () => {
    it('has no axe violations when collapsed', async () => {
      const { container } = render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      await testAccessibility(container, {
        rules: {
          region: { enabled: false },
          'landmark-one-main': { enabled: false },
        },
      })
    })

    it('has no axe violations when expanded', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <ExpandableSection number={1} title="Getting Started">
          <p>Content</p>
        </ExpandableSection>
      )

      await user.click(screen.getByRole('button'))

      await testAccessibility(container, {
        rules: {
          region: { enabled: false },
          'landmark-one-main': { enabled: false },
        },
      })
    })
  })
})
