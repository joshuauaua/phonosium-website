import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InstallationList from './InstallationList'

const mockInstallations = [
  {
    id: 1,
    title: 'Test Installation 1',
    artist: { name: 'Artist One' },
    year: 2024,
    duration: '10:00',
    isActive: true,
  },
  {
    id: 2,
    title: 'Test Installation 2',
    artist: { name: 'Artist Two' },
    year: 2023,
    duration: '15:30',
    isActive: true,
  },
  {
    id: 3,
    title: 'Test Installation 3',
    artist: { name: 'Artist Three' },
    year: 2025,
    duration: '20:45',
    isActive: false,
  },
]

describe('InstallationList', () => {
  it('renders list of installations', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={null} onSelect={handleSelect} />)

    expect(screen.getByText('Test Installation 1')).toBeInTheDocument()
    expect(screen.getByText('Test Installation 2')).toBeInTheDocument()
    expect(screen.getByText('Test Installation 3')).toBeInTheDocument()
  })

  it('displays correct number of installations', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={null} onSelect={handleSelect} />)

    expect(screen.getByText('3')).toBeInTheDocument() // count badge
  })

  it('displays "Library" heading', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={null} onSelect={handleSelect} />)

    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('calls onSelect with correct id when installation is clicked', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={null} onSelect={handleSelect} />)

    const button = screen.getByRole('button', { name: /Select Test Installation 1/i })
    await user.click(button)

    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith(1)
  })

  it('displays "Playing" tag for selected installation', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={2} onSelect={handleSelect} />)

    const playingTag = screen.getByText('Playing')
    expect(playingTag).toBeInTheDocument()
  })

  it('does not display "Playing" tag when no installation is selected', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={null} onSelect={handleSelect} />)

    const playingTag = screen.queryByText('Playing')
    expect(playingTag).not.toBeInTheDocument()
  })

  it('formats installation numbers with leading zero', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={null} onSelect={handleSelect} />)

    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
  })

  it('displays artist name, year, and duration for each installation', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={null} onSelect={handleSelect} />)

    expect(screen.getByText('Artist One')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('10:00')).toBeInTheDocument()

    expect(screen.getByText('Artist Two')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('15:30')).toBeInTheDocument()
  })

  it('sets aria-pressed to true for selected installation', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={2} onSelect={handleSelect} />)

    const selectedButton = screen.getByRole('button', { name: /Select Test Installation 2/i })
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('sets aria-pressed to false for non-selected installations', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={mockInstallations} selectedId={2} onSelect={handleSelect} />)

    const notSelectedButton = screen.getByRole('button', { name: /Select Test Installation 1/i })
    expect(notSelectedButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders empty list when no installations provided', () => {
    const handleSelect = vi.fn()
    render(<InstallationList installations={[]} selectedId={null} onSelect={handleSelect} />)

    expect(screen.getByText('0')).toBeInTheDocument() // count badge
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
