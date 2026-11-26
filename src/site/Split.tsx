/*
 * Big headlines are split into letters so they can arrive one by one. Each line is a mask
 * (.line, overflow hidden); inside it, words never break apart (.w) and each letter is a .ch.
 * Screen readers get the plain sentence (aria-label) and skip the letter spans.
 */
export function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <span className="line" key={line} aria-label={line} role="text">
          <span aria-hidden>
            {line.split(' ').map((word, wi, arr) => (
              <span className="w" key={wi}>
                {[...word].map((c, ci) => <span className="ch" key={ci}>{c}</span>)}
                {wi < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  )
}
