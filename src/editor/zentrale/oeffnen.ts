// Das Datencenter gehoert der Shell; wer es von woanders braucht, bittet per
// Ereignis darum.
const EREIGNIS = 'ff-datencenter-oeffnen'

export function oeffneDatencenter(): void {
  document.dispatchEvent(new CustomEvent(EREIGNIS))
}

export function beiDatencenterWunsch(fn: () => void): () => void {
  document.addEventListener(EREIGNIS, fn)
  return () => document.removeEventListener(EREIGNIS, fn)
}
