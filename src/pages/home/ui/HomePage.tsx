import { BatteryParallax } from '@/widgets/battery-parallax'
import { Configurator } from '@/widgets/configurator'
import { Finance } from '@/widgets/finance'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { Hero } from '@/widgets/hero'
import { ModelsShowcase } from '@/widgets/models-showcase'
import { Showroom } from '@/widgets/showroom'
import { TechFeatures } from '@/widgets/tech-features'
import { TestDriveSection } from '@/widgets/test-drive'
import { OpenTestDriveButton, TestDriveModal } from '@/features/book-test-drive'
import { Car3DModal } from '@/features/view-car-3d'

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ModelsShowcase />
        <BatteryParallax />
        <Configurator />
        <TechFeatures />
        <Finance />
        <TestDriveSection />
        <Showroom />
      </main>
      <Footer />
      <Car3DModal
        renderActions={(car, close) => (
          <OpenTestDriveButton carId={car.id} onClickCapture={close}>
            Записаться на тест‑драйв
          </OpenTestDriveButton>
        )}
      />
      <TestDriveModal />
    </>
  )
}
