import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const framesDir = path.join(process.cwd(), 'public', 'frame')
    // NATURAL numeric sort — the new sequence is "frame (1).webp" … "frame (480).webp"
    // (unpadded), so a plain lexicographic .sort() would order 1,10,100,2,…
    // We key off the first run of digits in each name, falling back to a
    // numeric-aware locale compare so any padded/legacy naming still works.
    const numOf = (s: string) => {
      const m = s.match(/\d+/)
      return m ? parseInt(m[0], 10) : Number.MAX_SAFE_INTEGER
    }
    const files = fs.readdirSync(framesDir)
      .filter((f: string) => /\.(webp|jpg|jpeg|png|gif)$/i.test(f))
      .sort((a, b) => (numOf(a) - numOf(b)) || a.localeCompare(b, undefined, { numeric: true }))

    console.log(`[API /frames] Found ${files.length} files in public/frame/`)

    return NextResponse.json({ files, count: files.length })
  } catch (err) {
    console.error('[API /frames] Error reading frame folder:', err)
    return NextResponse.json({ error: String(err), files: [], count: 0 }, { status: 500 })
  }
}
