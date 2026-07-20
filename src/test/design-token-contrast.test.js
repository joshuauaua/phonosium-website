import { describe, it, expect } from 'vite-plus/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tokensPath = resolve(__dirname, '../design-system/colors_and_type.css')
const tokensCss = readFileSync(tokensPath, 'utf-8')

function parseTokens(css) {
  const tokens = {}
  const declRe = /--([\w-]+):\s*([^;]+);/g
  let match
  while ((match = declRe.exec(css)) !== null) {
    tokens[match[1]] = match[2].trim()
  }
  return tokens
}

function resolveToHex(name, tokens, seen = new Set()) {
  if (seen.has(name)) {
    throw new Error(`Circular token reference detected at --${name}`)
  }
  seen.add(name)

  const value = tokens[name]
  if (!value) {
    throw new Error(`Token --${name} not found in colors_and_type.css`)
  }

  const varMatch = value.match(/^var\(\s*--([\w-]+)\s*\)$/)
  if (varMatch) {
    return resolveToHex(varMatch[1], tokens, seen)
  }

  const hexMatch = value.match(/^#([0-9a-fA-F]{6})$/)
  if (!hexMatch) {
    throw new Error(`Token --${name} did not resolve to a hex color: ${value}`)
  }
  return hexMatch[1]
}

function hexToRgb(hex) {
  return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))
}

function relativeLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(hexA, hexB) {
  const lumA = relativeLuminance(hexToRgb(hexA))
  const lumB = relativeLuminance(hexToRgb(hexB))
  const lighter = Math.max(lumA, lumB)
  const darker = Math.min(lumA, lumB)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('design token contrast', () => {
  const tokens = parseTokens(tokensCss)

  it('--ph-accent-border on --ph-bg meets the WCAG 1.4.11 non-text 3:1 minimum', () => {
    const fg = resolveToHex('ph-accent-border', tokens)
    const bg = resolveToHex('ph-bg', tokens)

    const ratio = contrastRatio(fg, bg)

    expect(ratio).toBeGreaterThanOrEqual(3.0)
  })
})
