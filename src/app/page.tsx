import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Story from '@/components/Story'
import About from '@/components/About'
import Gallery from '@/components/Gallery'
import Menu from '@/components/Menu'
import Locations from '@/components/Locations'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Story />
      <About />
      <Gallery />
      <Menu />
      <Locations />
      <Footer />
    </main>
  )
}
