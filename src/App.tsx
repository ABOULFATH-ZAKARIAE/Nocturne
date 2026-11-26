import { Fragment, useState } from 'react'
import { useSmoothScroll } from './site/useSmoothScroll'
import { Nav } from './site/Nav'
import { Stage } from './site/Stage'
import { Hero } from './site/Hero'
import { ChapterSection } from './site/ChapterSection'
import { PaintSection } from './site/PaintSection'
import { Gallery } from './site/Gallery'
import { Marquee } from './site/Marquee'
import { Preloader } from './site/Preloader'
import { Cursor } from './site/Cursor'
import { ChapterIndex } from './site/ChapterIndex'
import { Specs } from './site/Specs'
import { Finale } from './site/Finale'
import { CHAPTERS, PAINTS } from './site/content'

/*
 * Nocturne Op. 1 — a cinematic scroll page. Every picture is an AI-generated still (Google Gemini).
 * The pictures live in one fixed Stage behind the page and dissolve into each other as you scroll;
 * the sections in <main> only carry the words and tell the Stage which scene to show (data-scene).
 */
export default function App() {
  useSmoothScroll()
  const [paint, setPaint] = useState(PAINTS[0])
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        {CHAPTERS.map((c) => (
          <Fragment key={c.id}>
            <ChapterSection c={c} />
            {c.id === 'night' && <Marquee />}
          </Fragment>
        ))}
        <PaintSection paint={paint} setPaint={setPaint} />
        <Gallery />
        <Specs />
        <Finale />
      </main>
      <Stage paint={paint} />
      <ChapterIndex />
      <Cursor />
      <div className="grain" aria-hidden />
      <Preloader />
    </>
  )
}
