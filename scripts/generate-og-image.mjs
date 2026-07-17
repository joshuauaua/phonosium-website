import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const svgPath = path.join(__dirname, '../public/favicon.svg')
const outputPath = path.join(__dirname, '../public/og-image.png')

// OG image dimensions
const width = 1200
const height = 630
const backgroundColor = '#FAF7F2'

// Read SVG
const svgBuffer = fs.readFileSync(svgPath)

// Calculate logo dimensions (centered, reasonable size)
const logoSize = 400
const logoX = Math.floor((width - logoSize) / 2)
const logoY = Math.floor((height - logoSize) / 2)

// Create background with logo
const svgWithBackground = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${backgroundColor}" />
  <g transform="translate(${logoX}, ${logoY}) scale(${logoSize / 48})">
    ${svgBuffer.toString().match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1]}
  </g>
</svg>
`

// Convert to PNG
sharp(Buffer.from(svgWithBackground))
  .png()
  .toFile(outputPath)
  .then(() => {
    console.log(`OG image created successfully at ${outputPath}`)
    console.log(`Dimensions: ${width}x${height}px`)
  })
  .catch(err => {
    console.error('Error generating OG image:', err)
    process.exit(1)
  })
