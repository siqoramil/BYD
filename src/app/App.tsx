import { MotionConfig } from 'motion/react'
import { HomePage } from '@/pages/home'
import './styles/index.css'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HomePage />
    </MotionConfig>
  )
}
