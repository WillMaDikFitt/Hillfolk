/** Shared keyboard state for car + walker (only one active at a time). */
export const KEYS = new Set()

let bound = 0

function onDown(e) {
  KEYS.add(e.code)
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
}

function onUp(e) {
  KEYS.delete(e.code)
}

function onBlur() {
  KEYS.clear()
}

export function bindKeys() {
  if (bound === 0) {
    window.addEventListener('keydown', onDown, { passive: false })
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', onBlur)
  }
  bound += 1
  return () => {
    bound = Math.max(0, bound - 1)
    if (bound === 0) {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', onBlur)
      KEYS.clear()
    }
  }
}

export function pressed(...codes) {
  return codes.some((c) => KEYS.has(c))
}
