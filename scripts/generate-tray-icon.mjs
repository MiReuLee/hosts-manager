import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'hosts..png')
const outDir = path.join(root, 'resources')

async function generate() {
  // 투명 여백 제거 후 중간 사이즈로 작업 (메뉴바에서 크게 보이도록)
  const raw = await sharp(src)
    .trim()
    .resize(56, 56, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = raw.info
  const pixels = raw.data

  // 새 버퍼: 검정색 + 밝기 기반 알파 (단색 Template 아이콘)
  const newPixels = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    const r = pixels[i * channels]
    const g = pixels[i * channels + 1]
    const b = pixels[i * channels + 2]
    const a = pixels[i * channels + 3]

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b
    const opacity = a > 10 ? Math.round((1 - brightness / 255) * a) : 0

    newPixels[i * 4] = 0
    newPixels[i * 4 + 1] = 0
    newPixels[i * 4 + 2] = 0
    newPixels[i * 4 + 3] = opacity
  }

  // 18x18 (1x) — 패딩 1px 포함
  await sharp(newPixels, { raw: { width, height, channels: 4 } })
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 1, bottom: 1, left: 1, right: 1, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'tray-iconTemplate.png'))

  // 36x36 (2x) — 패딩 2px 포함
  await sharp(newPixels, { raw: { width, height, channels: 4 } })
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'tray-iconTemplate@2x.png'))

  console.log('트레이 아이콘 생성 완료!')
  console.log('  - resources/tray-iconTemplate.png (18x18)')
  console.log('  - resources/tray-iconTemplate@2x.png (36x36)')
}

generate().catch(console.error)
