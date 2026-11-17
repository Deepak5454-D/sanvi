export const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=${w}`

export const VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
export const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

export const P = {
  pinkOrange: '1617627143750-d86bc21e42bb',
  park: '1739429942851-9083ee185d3d',
  colorful: '1692992193981-d3d92fabd9cb',
  redWhite: '1619516388835-2b60acc4049e',
  green: '1770838447151-05a876cdee3d',
  yellowRed: '1597897569252-9df44c7de0db',
  red: '1630267693092-2ea1f7dcc9a5',
  orange: '1614940685083-c5409b57da6e',
  redGold: '1705164454907-a04fe248f675',
  purple: '1610189026205-27510cfc52f8',
  redBrown: '1610030469983-98e550d6193c',
  posing: '1727430228383-aa1fb59db8bf',
  jewel: '1673413349218-ba4de23c2958',
  bride: '1570212773364-e30cd076539e',
  headdress: '1665960212625-3c6b274222ed',
  bracelet: '1616756141603-6d37d5cde2a2',
  fabric: '1681003564665-62848f8d481e',
  textile: '1588140686379-1b76a52103dc',
}

export const SHOWROOM = img(P.fabric, 2000)

export const TICKER = ['TRY THE LOOK', 'PURE ZARI', 'BRIDAL', 'KANCHIPURAM', 'HANDWOVEN', 'TIMELESS SILK']

export const MOODS = [
  { name: 'Wedding Edit', img: P.bride },
  { name: 'Kanchipuram Icons', img: P.redGold },
  { name: 'Banarasi Heirlooms', img: P.purple },
  { name: 'Festive Classics', img: P.yellowRed },
  { name: 'Contemporary Silks', img: P.green },
  { name: 'Everyday Elegance', img: P.orange },
]

export const LOOKS = [
  { name: 'Palace Check', img: P.redBrown, price: 38500 },
  { name: 'Bengal Garden', img: P.green, price: 29800 },
  { name: 'Kanchi Rani', img: P.redGold, price: 52000 },
  { name: 'Temple Bloom', img: P.pinkOrange, price: 34500 },
  { name: 'Mango Zari', img: P.yellowRed, price: 31200 },
  { name: 'Royal Pallu', img: P.purple, price: 44900 },
  { name: 'Ivory Elephant', img: P.redWhite, price: 41000 },
  { name: 'Sunset Rekha', img: P.orange, price: 27800 },
].map((l, i) => ({ ...l, id: 'look' + i }))

export const SILKS = [
  { name: 'Palace Check', color: '#681b32', img: P.redBrown, price: 38500 },
  { name: 'Bengal Garden', color: '#2f5d50', img: P.green, price: 29800 },
  { name: 'Kanchi Rani', color: '#c6a15b', img: P.redGold, price: 52000 },
  { name: 'Ivory Elephant', color: '#d9c7a3', img: P.redWhite, price: 41000 },
  { name: 'Temple Bloom', color: '#c9577a', img: P.pinkOrange, price: 34500 },
  { name: 'Royal Pallu', color: '#3b2a6b', img: P.purple, price: 44900 },
].map((s, i) => ({ ...s, id: 'silk' + i }))

export type Piece = { id: string; name: string; price: number; cats: string[]; front: string; back: string; kind: 'saree' | 'blouse' }
export const FILTERS = ['All Pieces', 'Silk Sarees', 'Half Sarees', 'Blouses', 'Checked Sarees', 'Zari & Brocade']
export const PIECES: Piece[] = [
  { name: 'Kanchi Rani', price: 52000, cats: ['Silk Sarees', 'Zari & Brocade'], front: P.redGold, back: P.jewel, kind: 'saree' as const },
  { name: 'Palace Check', price: 38500, cats: ['Silk Sarees', 'Checked Sarees'], front: P.redBrown, back: P.red, kind: 'saree' as const },
  { name: 'Bengal Garden', price: 29800, cats: ['Silk Sarees'], front: P.green, back: P.park, kind: 'saree' as const },
  { name: 'Mango Pavadai', price: 18900, cats: ['Half Sarees'], front: P.yellowRed, back: P.colorful, kind: 'saree' as const },
  { name: 'Gold Zari Blouse', price: 6400, cats: ['Blouses', 'Zari & Brocade'], front: P.posing, back: P.headdress, kind: 'blouse' as const },
  { name: 'Temple Border', price: 44900, cats: ['Silk Sarees', 'Zari & Brocade'], front: P.purple, back: P.pinkOrange, kind: 'saree' as const },
  { name: 'Tartan Silk', price: 33200, cats: ['Silk Sarees', 'Checked Sarees'], front: P.redWhite, back: P.orange, kind: 'saree' as const },
  { name: 'Rose Langa', price: 16500, cats: ['Half Sarees'], front: P.pinkOrange, back: P.bride, kind: 'saree' as const },
  { name: 'Ivory Brocade Blouse', price: 5800, cats: ['Blouses', 'Zari & Brocade'], front: P.bride, back: P.jewel, kind: 'blouse' as const },
].map((p, i) => ({ ...p, id: 'rack' + i }))

export const REELS = [
  { title: 'The First Drape', fabric: 'Kanchipuram Silk', loc: 'Kanchipuram', dur: '0:24', img: P.redGold },
  { title: 'Temple Morning', fabric: 'Pure Zari', loc: 'Madurai', dur: '0:18', img: P.pinkOrange },
  { title: 'Muhurtham', fabric: 'Bridal Brocade', loc: 'Chennai', dur: '0:31', img: P.bride },
  { title: 'Garden Rani', fabric: 'Soft Silk', loc: 'Mysuru', dur: '0:22', img: P.green },
  { title: 'Golden Hour', fabric: 'Tissue Silk', loc: 'Pondicherry', dur: '0:27', img: P.orange },
]
