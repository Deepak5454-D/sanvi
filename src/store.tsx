import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type BagItem = { id: string; name: string; price: number; qty: number; size?: string }
type Ctx = {
  bag: BagItem[]
  count: number
  wish: Set<string>
  toast: string | null
  bagOpen: boolean
  setBagOpen: (v: boolean) => void
  add: (item: Omit<BagItem, 'qty'>) => void
  addMany: (items: Omit<BagItem, 'qty'>[], label: string) => void
  remove: (id: string) => void
  toggleWish: (id: string) => void
}
const C = createContext<Ctx>(null!)
export const useStore = () => useContext(C)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagItem[]>([])
  const [wish, setWish] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  const [bagOpen, setBagOpen] = useState(false)

  const say = useCallback((m: string) => {
    setToast(m)
    window.clearTimeout((say as any).t)
    ;(say as any).t = window.setTimeout(() => setToast(null), 2200)
  }, [])
  const put = (b: BagItem[], item: Omit<BagItem, 'qty'>) => {
    const i = b.findIndex((x) => x.id === item.id && x.size === item.size)
    if (i >= 0) return b.map((x, k) => (k === i ? { ...x, qty: x.qty + 1 } : x))
    return [...b, { ...item, qty: 1 }]
  }
  const add: Ctx['add'] = (item) => { setBag((b) => put(b, item)); say(`${item.name} added to bag`) }
  const addMany: Ctx['addMany'] = (items, label) => { setBag((b) => items.reduce(put, b)); say(label) }
  const remove = (id: string) => setBag((b) => b.filter((x) => x.id + (x.size ?? '') !== id))
  const toggleWish = (id: string) =>
    setWish((w) => { const n = new Set(w); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <C.Provider value={{ bag, count: bag.reduce((a, b) => a + b.qty, 0), wish, toast, bagOpen, setBagOpen, add, addMany, remove, toggleWish }}>
      {children}
    </C.Provider>
  )
}
