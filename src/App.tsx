import { StoreProvider } from './store'
import Navbar, { BagDrawer } from './components/Navbar'
import Hero from './components/Hero'
import Archive from './components/Archive'
import TryLook from './components/TryLook'
import PickSilk from './components/PickSilk'
import Rack from './components/Rack'
import { Film, Reels } from './components/Muse'
import Bridal from './components/Bridal'
import { useMotion } from './motion'
import Intro from './components/Intro'

export default function App() {
  useMotion()
  return (
    <StoreProvider>
      <Intro />
      <Navbar />
      <main>
        <Hero />
        <Archive />
        <TryLook />
        <PickSilk />
        <Rack />
        <Film />
        <Reels />
        <Bridal />
      </main>
      <BagDrawer />
    </StoreProvider>
  )
}
