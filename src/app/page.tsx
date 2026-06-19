import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AboutExperience from '@/components/AboutExperience'
import IngredientShowcase from '@/components/IngredientShowcase'
import MenuExperience from '@/components/MenuExperience'
import SignatureExperience from '@/components/SignatureExperience'
import WhyChooseUs from '@/components/WhyChooseUs'
import CinematicEnding from '@/components/CinematicEnding'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <main className="bg-black text-white overflow-x-clip">
      <Navbar />
      {/* Hero — preserved exactly (240-frame cinematic canvas) */}
      <Hero />
      {/* Our Story */}
      <AboutExperience />
      {/* Ingredients Experience */}
      <IngredientShowcase />
      {/* Menu Experience */}
      <MenuExperience />
      {/* Signature Pizza */}
      <SignatureExperience />
      {/* Why Choose Us */}
      <WhyChooseUs />
      {/* Cinematic Pizza Scene */}
      <CinematicEnding />
      <Footer />
    </main>
  )
}
