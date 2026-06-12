import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const framesDir = path.join(process.cwd(), 'public', 'frame')
    const files = fs.readdirSync(framesDir)
      .filter((f: string) => /\.(webp|jpg|jpeg|png|gif)$/i.test(f))
      .sort()

    console.log(`[API /frames] Found ${files.length} files in public/frame/`)
    files.forEach((f, i) => console.log(`  [${i}] /frame/${f}`))

    return NextResponse.json({ files, count: files.length })
  } catch (err) {
    console.error('[API /frames] Error reading frame folder:', err)
    return NextResponse.json({ error: String(err), files: [], count: 0 }, { status: 500 })
  }
}
