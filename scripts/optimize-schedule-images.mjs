import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { installations } from '../src/data/installations.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')
const outputDir = path.join(publicDir, 'images/schedule')

// The schedule cover renders in a fixed 300x300 box with object-fit: cover, so
// square derivatives at 1x and 2x are the most a browser can ever paint. The
// masters in public/images are the source of truth and stay untouched.
const BOX = 300
const SCALES = [1, 2]
const QUALITY = 78

fs.mkdirSync(outputDir, { recursive: true })

const derivativeName = (source, scale) =>
  `${path.basename(source, path.extname(source))}-${BOX * scale}.webp`

let totalBefore = 0
let totalAfter = 0

for (const inst of installations) {
  if (!inst.imageSource) continue

  const sourcePath = path.join(publicDir, inst.imageSource)
  if (!fs.existsSync(sourcePath)) {
    console.error(`Missing master image for "${inst.title}": ${sourcePath}`)
    process.exit(1)
  }

  totalBefore += fs.statSync(sourcePath).size

  for (const scale of SCALES) {
    const edge = BOX * scale
    const outputPath = path.join(
      outputDir,
      derivativeName(inst.imageSource, scale)
    )

    await sharp(sourcePath)
      .resize(edge, edge, { fit: 'cover', position: 'centre' })
      .webp({ quality: QUALITY })
      .toFile(outputPath)

    totalAfter += fs.statSync(outputPath).size
  }

  console.log(`${inst.title} → ${derivativeName(inst.imageSource, 1)} (+ @2x)`)
}

const mb = bytes => (bytes / 1048576).toFixed(2)
console.log(
  `\nSchedule covers: ${mb(totalBefore)}MB of masters → ${mb(totalAfter)}MB shipped`
)
