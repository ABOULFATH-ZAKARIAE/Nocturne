// Everything the visitor reads lives here, so copy can change without touching layout code.
// Images: /film/<name>-d.webp (16:9); the opening shot also has /film/hero-m.webp (phone, portrait).

/*
 * The brand. The page reads like a piece of music written for the night: the car is "Op. 1",
 * each section is a movement with a tempo marking, and the ending is the "coda".
 */
export const BRAND = {
  name: 'Nocturne',
  logo: ['NOCTURNE', 'Op.1'],
  nav: [['#light', 'Movements'], ['#paint', 'Key'], ['#specs', 'Tempo']] as [string, string][],
  navCta: 'Reserve',
  loading: 'Tuning the room',
  hint: 'Move the light ↗',
  marquee: ['Composed for the night — Op. 1 — 720 hp — 0–100 in 2.9 s — ', 'No badge — No noise — Only the road — '],
  footer: ['Nocturne — a design study by Zakariae Aboulfath.', 'Fictional car and brand. Images generated with Google Gemini.'],
  email: 'hello@example.com',
}

export const HERO = {
  kicker: 'Nocturne — Op. 1 “Carmine”',
  title: ['Composed', 'for the night.'],
  text: 'One car. One room. Played only for you.',
  cta: 'Reserve a private listening',
  cta2: 'Choose the key',
  image: 'hero',
}

export type Chapter = { id: string; scene: string; kicker: string; title: string[]; text: string; align: 'left' | 'right' }

export const CHAPTERS: Chapter[] = [
  { id: 'light', scene: 'headlight', kicker: 'I. Lento — Light', title: ['Two notes', 'of light.'], text: 'Full-LED blades that open the road like a first chord. Everything else waits for them.', align: 'left' },
  { id: 'wheels', scene: 'wheel', kicker: 'II. Staccato — Wheels', title: ['Forged.', 'Never cast.'], text: '21-inch monoblock wheels over carbon-ceramic brakes, balanced to the gram so every corner lands clean.', align: 'right' },
  { id: 'lines', scene: 'profile', kicker: 'III. Legato — Lines', title: ['One phrase,', 'nose to tail.'], text: 'A single line runs the length of the body. No vents for show, no breaks in the melody.', align: 'left' },
  { id: 'inside', scene: 'interior', kicker: 'IV. Solo — Inside', title: ['One instrument.', 'You.'], text: 'Hand-stitched leather, one glowing display, and a wheel shaped for your hands alone.', align: 'right' },
  { id: 'night', scene: 'drive', kicker: 'V. Presto — Night', title: ['The city rests.', "The engine doesn't."], text: 'Rain on the glass, empty avenues, and 720 horses waiting for a single cue.', align: 'left' },
]

/*
 * The film behind the page. One fixed "stage" holds every picture; each section of the page names
 * the scene it wants, and the stage dissolves from one to the next through smoke as you scroll.
 * focus = which part of the picture stays in frame when a phone crops it.
 */
export type Scene = { id: string; image: string; focus: string; phone?: boolean; fx?: 'lights' | 'sweep' | 'paint' | 'dim' | 'drive' }

export const SCENES: Scene[] = [
  { id: 'hero', image: 'hero', focus: '62% 50%', phone: true, fx: 'lights' },
  { id: 'headlight', image: 'headlight', focus: '50% 50%', fx: 'lights' },
  { id: 'wheel', image: 'wheel', focus: '45% 55%' },
  { id: 'profile', image: 'profile', focus: '50% 55%', fx: 'sweep' },
  { id: 'interior', image: 'interior', focus: '40% 50%' },
  { id: 'drive', image: 'drive', focus: '68% 55%', fx: 'drive' },
  { id: 'paint', image: 'rear-red', focus: '45% 50%', fx: 'paint' },
  { id: 'gallery', image: 'front', focus: '50% 50%', fx: 'dim' },
  { id: 'specs', image: 'profile', focus: '50% 55%', fx: 'dim' },
  { id: 'finale', image: 'front', focus: '50% 50%', fx: 'lights' },
]

export type Paint = { id: string; name: string; swatch: string; image: string }

// Same rear shot in each colour, so switching paint never moves the car.
export const PAINTS: Paint[] = [
  { id: 'carmine', name: 'Carmine Major', swatch: '#b3121f', image: 'rear-red' },
  { id: 'sapphire', name: 'Sapphire Minor', swatch: '#1d3f8f', image: 'rear-blue' },
]

export const KEY = { kicker: 'VI. Key — Colour', title: ['Choose', 'the key.'], text: 'Two finishes, each laid by hand in four coats. Same car, a different mood.' }

// The gallery strip: stills you scroll sideways through. Add a picture here and it appears.
export const GALLERY_HEAD = { kicker: 'VII. Variations', title: ['Variations', 'on a theme.'], text: 'Eight studies of one car. Keep scrolling.' }
export const GALLERY = [
  { image: 'taillight', title: 'Coda in red', note: 'One unbroken light blade' },
  { image: 'headlight', title: 'Overture', note: 'Full-LED, adaptive' },
  { image: 'wheel', title: 'Staccato', note: 'Forged, 21 inch' },
  { image: 'profile', title: 'Legato', note: 'One continuous line' },
  { image: 'rear-blue', title: 'Sapphire Minor', note: 'Hand-mixed, four coats' },
  { image: 'interior', title: 'Solo', note: 'Leather, red stitching' },
  { image: 'front', title: 'Fortissimo', note: 'Head-on, lights up' },
  { image: 'rear-red', title: 'Carmine Major', note: 'Hand-polished' },
]

export const SPECS_KICKER = 'VIII. Tempo — Numbers'
export const SPECS = [
  { value: '2.9', unit: 's', label: '0–100 km/h' },
  { value: '720', unit: 'hp', label: 'Twin-turbo V8' },
  { value: '325', unit: 'km/h', label: 'Top speed' },
]

export const FINALE = {
  title: ['The last movement', 'is yours.'],
  text: 'Private listenings after dark, by invitation. Bring one guest, or none.',
  cta: 'Reserve a private listening',
}

// right-edge index labels, in page order (section id, label)
export const INDEX: [string, string][] = [
  ['top', 'Prelude'], ['light', 'Light'], ['wheels', 'Wheels'], ['lines', 'Lines'], ['inside', 'Inside'],
  ['night', 'Night'], ['paint', 'Key'], ['gallery', 'Variations'], ['specs', 'Tempo'], ['book', 'Coda'],
]
