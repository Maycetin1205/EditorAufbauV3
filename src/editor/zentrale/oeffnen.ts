// Das Datencenter gehoert der Shell. Wer es von woanders braucht (der
// Feld-Picker ohne Datenquelle, der Inspector), bittet per Ereignis darum.
const EREIGNIS = 'ff-datencenter-oeffnen'

export function oeffneDatencenter(): void {
  document.dispatchEvent(new CustomEvent(EREIGNIS))
}

export function beiDatencenterWunsch(fn: () => void): () => void {
  document.addEventListener(EREIGNIS, fn)
  return () => document.removeEventListener(EREIGNIS, fn)
}
