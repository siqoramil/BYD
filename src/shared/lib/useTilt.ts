import type { PointerEvent } from 'react'
import { useMotionTemplate, useMotionValue, useSpring } from 'motion/react'

/** 3D hover tilt with a moving glare highlight. */
export function useTilt(maxDeg = 10) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const rotateX = useSpring(rx, { stiffness: 220, damping: 20 })
  const rotateY = useSpring(ry, { stiffness: 220, damping: 20 })
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.14), transparent 45%)`

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * maxDeg * 2)
    rx.set(-(py - 0.5) * maxDeg * 2)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const onPointerLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return { rotateX, rotateY, glare, handlers: { onPointerMove, onPointerLeave } }
}
