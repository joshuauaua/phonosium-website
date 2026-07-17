# Testing Guide

This project uses [Vitest](https://vitest.dev/) with React Testing Library for unit and integration testing.

## Prerequisites

- Node.js 18+ recommended
- npm 8+

## Installation

Install dependencies before running tests:

```bash
npm install
```

If you encounter peer dependency conflicts, use:

```bash
npm install --legacy-peer-deps
```

## Running Tests

### Watch Mode (Development)

Run tests in watch mode, re-running on file changes:

```bash
npm test
```

### Single Run (CI/Production)

Run all tests once and exit:

```bash
npm run test:run
```

### Interactive UI

Launch Vitest's web UI for interactive test exploration:

```bash
npm run test:ui
```

### Coverage Reports

Generate test coverage report:

```bash
npm run test:coverage
```

Coverage reports are saved to `coverage/` directory. Open `coverage/index.html` in a browser to view detailed coverage.

## Testing Philosophy

### What to Test

- **Component Rendering**: Verify components render without errors
- **User Interactions**: Test button clicks, form submissions, navigation
- **State Management**: Verify state updates and side effects (localStorage, DOM attributes)
- **Conditional Logic**: Test branches, filters, computed values
- **Accessibility**: Verify ARIA labels, roles, keyboard navigation

### What NOT to Test

- **Implementation Details**: Avoid testing internal state or private methods
- **Third-Party Libraries**: Don't test React Router, Vite, etc.
- **Styling**: Visual appearance is verified manually; test structural changes only
- **Static Data**: No need to test hardcoded arrays unless they involve logic

### When to Write Tests

- **New Features**: Always include tests for new components or functions
- **Bug Fixes**: Add regression tests to prevent reoccurrence
- **Refactoring**: Ensure existing tests still pass; add tests if coverage gaps exist

## Writing Tests

### Basic Component Test

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />)
    expect(screen.getByRole('heading')).toHaveTextContent('Hello')
  })
})
```

### Testing User Interactions

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testing Components with React Router

Wrap components that use `<Link>` or routing hooks in `<BrowserRouter>`:

```javascript
import { BrowserRouter } from 'react-router-dom'

render(
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>
)
```

### Mocking localStorage

The test environment includes a localStorage mock. To set initial values:

```javascript
beforeEach(() => {
  localStorage.setItem('theme', 'dark')
})

afterEach(() => {
  localStorage.clear()
})
```

## Test Configuration

Test setup is defined in:

- **vitest.config.js**: Main configuration (jsdom environment, setupFiles)
- **src/test/setup.js**: Global test setup (matchers, mocks, cleanup)

### Current Mocks

- **window.matchMedia**: Mocked to prevent errors in components using media queries

## CI Integration

To run tests in CI pipelines:

```bash
npm ci
npm run test:run
```

Exit code will be non-zero if tests fail, allowing CI to catch failures.

## Coverage Thresholds

Current coverage targets (not enforced, but recommended):

- **Statements**: 70%
- **Branches**: 65%
- **Functions**: 70%
- **Lines**: 70%

Focus on testing critical paths and user-facing features over achieving 100% coverage.

## Troubleshooting

### Tests Timeout

Increase timeout in `vitest.config.js`:

```javascript
test: {
  testTimeout: 10000, // 10 seconds
}
```

### Mock Not Working

Ensure mocks are defined in `src/test/setup.js` before tests run, or use `vi.mock()` at the top of your test file.

### Component Not Rendering

Check if the component requires providers (Router, Context). Wrap in necessary providers during render.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
