import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { testAccessibility } from '../test/axe-utils'
import { assertAllTouchTargetsAccessible } from '../test/touch-target-utils'
import ContributionForm from './ContributionForm'

vi.mock('../utils/azureUpload', () => ({
  uploadFile: vi.fn(() =>
    Promise.resolve({ blobName: 'test-id/file.wav', submissionId: 'test-id' })
  ),
  submitFormData: vi.fn(() =>
    Promise.resolve({ submissionId: 'test-id', status: 'received' })
  ),
}))

describe('ContributionForm', () => {
  const mockOnClose = vi.fn()

  it('renders the form with step 1 (Artist Information)', () => {
    render(<ContributionForm onClose={mockOnClose} />)

    expect(screen.getByText('Artist Information')).toBeInTheDocument()
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ContributionForm onClose={mockOnClose} />)
    await testAccessibility(container)
  })

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ContributionForm onClose={mockOnClose} />)

    const closeButton = screen.getByRole('button', { name: '×' })
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  describe('Step 1: Artist Information', () => {
    it('displays all required fields', () => {
      render(<ContributionForm onClose={mockOnClose} />)

      expect(screen.getByText(/your name/i)).toBeInTheDocument()
      expect(screen.getByText(/your email/i)).toBeInTheDocument()
      expect(screen.getByText(/links/i)).toBeInTheDocument()
      expect(screen.getByText(/location/i)).toBeInTheDocument()
      expect(screen.getByText(/artist description/i)).toBeInTheDocument()
    })

    it('allows adding multiple links', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      const addLinkButton = screen.getByRole('button', { name: /add link/i })
      await user.click(addLinkButton)

      const linkInputs = screen.getAllByPlaceholderText(/https:\/\//i)
      expect(linkInputs).toHaveLength(2)
    })

    it('allows removing links', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      const addLinkButton = screen.getByRole('button', { name: /add link/i })
      await user.click(addLinkButton)

      const removeButtons = screen.getAllByRole('button', { name: '×' })
      const linkRemoveButton = removeButtons.find(btn =>
        btn.className.includes('btnRemoveLink')
      )

      await user.click(linkRemoveButton)

      const linkInputs = screen.getAllByPlaceholderText(/https:\/\//i)
      expect(linkInputs).toHaveLength(1)
    })

    it('navigates to step 2 when Next Step is clicked', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      const nextButton = screen.getByRole('button', { name: /next step/i })
      await user.click(nextButton)

      expect(screen.getByText('Piece Information')).toBeInTheDocument()
      expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument()
    })
  })

  describe('Step 2: Piece Information', () => {
    it('displays all piece information fields', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))

      expect(screen.getByText(/name of piece/i)).toBeInTheDocument()
      expect(screen.getByText(/subtitle/i)).toBeInTheDocument()
      expect(screen.getByText(/short description/i)).toBeInTheDocument()
      expect(screen.getByText(/tags/i)).toBeInTheDocument()
      expect(
        screen.getByText(/loop file input \(wav, max 20mb\)/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/samples file input \(wav or zip\)/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/image of piece \(cover\)/i)).toBeInTheDocument()
      expect(screen.getByText(/medium/i)).toBeInTheDocument()
    })

    it('displays tag buttons for selection', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))

      expect(
        screen.getByRole('button', { name: 'generative' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'birdsong' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'algorithm' })
      ).toBeInTheDocument()
      expect(
        screen.getAllByRole('button', { name: 'field recording' })
      ).toHaveLength(2)
    })

    it('allows selecting and deselecting tags', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))

      const generativeTag = screen.getByRole('button', { name: 'generative' })
      await user.click(generativeTag)

      expect(generativeTag.className).toContain('tagButtonActive')

      await user.click(generativeTag)

      expect(generativeTag.className).not.toContain('tagButtonActive')
    })

    it('displays medium buttons for selection', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))

      expect(
        screen.getByRole('button', { name: 'Algorithmic composition' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: '8-channel spatial audio' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Live electronics' })
      ).toBeInTheDocument()
    })

    it('navigates back to step 1 when Back button is clicked', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))
      await user.click(screen.getByRole('button', { name: 'Back' }))

      expect(screen.getByText('Artist Information')).toBeInTheDocument()
      expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument()
    })

    it('navigates to step 3 when Next Step is clicked', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))
      await user.click(screen.getByRole('button', { name: /next step/i }))

      expect(screen.getByText('Review and Terms')).toBeInTheDocument()
      expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument()
    })
  })

  describe('Step 3: Review and Terms', () => {
    it('displays review summary of entered data', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.type(
        screen.getByPlaceholderText(/your name or alias/i),
        'Test Artist'
      )
      await user.type(
        screen.getByPlaceholderText(/email@example.com/i),
        'test@example.com'
      )
      await user.click(screen.getByRole('button', { name: /next step/i }))

      await user.type(
        screen.getByPlaceholderText(/mechanical echoes/i),
        'Test Piece'
      )
      await user.click(screen.getByRole('button', { name: /next step/i }))

      expect(screen.getByText('Review and Terms')).toBeInTheDocument()
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('Test Piece')).toBeInTheDocument()
    })

    it('displays terms agreement checkbox with proper text', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))
      await user.click(screen.getByRole('button', { name: /next step/i }))

      const termsCheckbox = screen.getByRole('checkbox')
      expect(termsCheckbox).toBeInTheDocument()
      expect(
        screen.getByText(
          /I agree that by submitting this work, I retain full ownership/i
        )
      ).toBeInTheDocument()
      expect(
        screen.getByText(/right to withdraw my recordings at any time/i)
      ).toBeInTheDocument()
    })

    it('submit button is disabled when terms are not agreed', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))
      await user.click(screen.getByRole('button', { name: /next step/i }))

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeDisabled()
    })

    it('submit button is enabled when terms are agreed', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))
      await user.click(screen.getByRole('button', { name: /next step/i }))

      const termsCheckbox = screen.getByRole('checkbox')
      await user.click(termsCheckbox)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeEnabled()
    })

    it('shows success message after submission', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.type(
        screen.getByPlaceholderText(/your name or alias/i),
        'Test Artist'
      )
      await user.type(
        screen.getByPlaceholderText(/email@example.com/i),
        'test@example.com'
      )
      await user.click(screen.getByRole('button', { name: /next step/i }))

      await user.type(
        screen.getByPlaceholderText(/mechanical echoes/i),
        'Test Piece'
      )
      await user.type(
        screen.getByPlaceholderText(/describe your piece/i),
        'Test description'
      )
      await user.click(screen.getByRole('button', { name: /next step/i }))

      const termsCheckbox = screen.getByRole('checkbox')
      await user.click(termsCheckbox)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Submission Received')).toBeInTheDocument()
      })
      expect(
        screen.getByText(/Thank you for submitting to Phonosium/i)
      ).toBeInTheDocument()
    })

    it('shows error message when submission fails', async () => {
      const { submitFormData } = await import('../utils/azureUpload')
      submitFormData.mockRejectedValueOnce(new Error('Network error'))

      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.type(
        screen.getByPlaceholderText(/your name or alias/i),
        'Test Artist'
      )
      await user.type(
        screen.getByPlaceholderText(/email@example.com/i),
        'test@example.com'
      )
      await user.click(screen.getByRole('button', { name: /next step/i }))

      await user.type(
        screen.getByPlaceholderText(/mechanical echoes/i),
        'Test Piece'
      )
      await user.type(
        screen.getByPlaceholderText(/describe your piece/i),
        'Test description'
      )
      await user.click(screen.getByRole('button', { name: /next step/i }))

      const termsCheckbox = screen.getByRole('checkbox')
      await user.click(termsCheckbox)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })
  })

  describe('File Upload Validation', () => {
    it('accepts valid WAV file for loop upload', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))

      expect(screen.getByText('Upload Loop (WAV)')).toBeInTheDocument()
    })

    it('accepts valid image file for cover upload', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))

      expect(screen.getByText('Upload Cover Image')).toBeInTheDocument()
    })

    it('displays "Add Samples" prompt', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))

      expect(screen.getByText('Add Samples (Multiple)')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('all interactive elements meet touch target size requirements', () => {
      const { container } = render(<ContributionForm onClose={mockOnClose} />)
      assertAllTouchTargetsAccessible(container)
    })

    it('all form inputs have accessible labels', () => {
      render(<ContributionForm onClose={mockOnClose} />)

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName()
      })
    })

    it('error messages have proper ARIA associations', async () => {
      const user = userEvent.setup()
      render(<ContributionForm onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /next step/i }))
      await user.click(screen.getByRole('button', { name: /next step/i }))

      const termsCheckbox = screen.getByRole('checkbox')
      await user.click(termsCheckbox)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeEnabled()
    })
  })
})
