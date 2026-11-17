import { useEffect } from 'react'
import { useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'

/** Normalised window pointer position (-0.5..0.5) smoothed with a spring. */
export function useMousePosition() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 60, damping: 18, mass: 0.6 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5)
      y.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y])

  return { x: sx, y: sy }
}

/** Maps pointer position to a pixel offset — larger depth = moves more. */
export function useDepth(value: MotionValue<number>, depth: number) {
  return useTransform(value, (v) => v * depth)
}
