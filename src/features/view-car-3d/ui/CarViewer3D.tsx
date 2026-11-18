import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { CarModel3D } from '@/entities/car'
import { BydLoader } from '@/shared/ui'

interface CarViewer3DProps {
  model: CarModel3D
  /** body colour, e.g. "#c4122b" */
  colorHex: string
}

type Status = 'loading' | 'ready' | 'error'

/** Soft blob shadow under the car (cheaper and cleaner than real shadow maps). */
function createGroundShadow(width: number, depth: number) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(0,0,0,0.55)')
  g.addColorStop(0.55, 'rgba(0,0,0,0.28)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
  )
  mesh.rotation.x = -Math.PI / 2
  return mesh
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.geometry.dispose()
    for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      for (const v of Object.values(m)) if (v instanceof THREE.Texture) v.dispose()
      m.dispose()
    }
  })
}

/** Interactive WebGL viewer: drag to orbit, wheel / pinch to zoom. Loaded lazily (three.js is a separate chunk). */
export default function CarViewer3D({ model, colorHex }: CarViewer3DProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const paintRef = useRef<THREE.MeshStandardMaterial[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [progress, setProgress] = useState<number | null>(0)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setStatus('error')
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.className = 'block h-full w-full touch-none cursor-grab active:cursor-grabbing outline-none'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minPolarAngle = Math.PI * 0.12
    controls.maxPolarAngle = Math.PI * 0.49
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.1
    controls.addEventListener('start', () => (controls.autoRotate = false))

    // how far the camera must be so that the car fits the current viewport at any orbit angle:
    // horizontally the widest silhouette is the footprint diagonal, vertically — the height
    let halfW = 0
    let halfH = 0
    const fitDistance = () => {
      const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
      return Math.max(halfH / tanV, halfW / (tanV * camera.aspect)) * 1.12 + halfW * 0.5
    }

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (halfW) {
        // keep the car framed when the viewport shape changes
        const d = fitDistance()
        controls.minDistance = d * 0.6
        controls.maxDistance = d * 1.6
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    let root: THREE.Object3D | undefined
    loader.load(
      model.url,
      (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene)
          return
        }
        root = gltf.scene
        root.rotation.y = model.yaw ?? 0
        root.updateMatrixWorld(true)

        // centre the car on the origin, wheels on the ground plane
        const box = new THREE.Box3().setFromObject(root)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        root.position.x -= center.x
        root.position.z -= center.z
        root.position.y -= box.min.y
        scene.add(root)

        const shadow = createGroundShadow(size.x * 1.45, size.z * 1.3)
        shadow.position.y = size.y * 0.003
        scene.add(shadow)

        const paint = new Set(model.paint)
        const found = new Set<THREE.MeshStandardMaterial>()
        root.traverse((o) => {
          const mesh = o as THREE.Mesh
          if (!mesh.isMesh) return
          for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            if (paint.has(m.name)) found.add(m as THREE.MeshStandardMaterial)
          }
        })
        paintRef.current = [...found]

        halfW = Math.hypot(size.x, size.z) / 2
        halfH = size.y / 2
        const d = fitDistance()
        const target = new THREE.Vector3(0, size.y * 0.42, 0)
        camera.near = d / 100
        camera.far = d * 20
        camera.position.copy(target).add(new THREE.Vector3(0.78, 0.3, 1).normalize().multiplyScalar(d))
        camera.updateProjectionMatrix()
        controls.target.copy(target)
        controls.minDistance = d * 0.6
        controls.maxDistance = d * 1.6
        controls.update()
        setStatus('ready')
      },
      (e) => {
        const total = model.bytes ?? (e.lengthComputable ? e.total : 0)
        // the download is ~96% of the wait — the rest is parsing and GPU upload
        setProgress(total > 0 ? Math.min(e.loaded / total, 1) * 0.96 : null)
      },
      () => !disposed && setStatus('error'),
    )

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      if (root) disposeObject(root)
      paintRef.current = []
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [model])

  // repaint the body when the colour changes (or when the model has just arrived)
  useEffect(() => {
    if (status !== 'ready') return
    for (const m of paintRef.current) m.color.set(colorHex)
  }, [colorHex, status])

  return (
    <div className="absolute inset-0">
      <div
        ref={hostRef}
        className={'absolute inset-0 transition-opacity duration-700 ' + (status === 'ready' ? 'opacity-100' : 'opacity-0')}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 grid place-items-center">
          <BydLoader progress={progress} label="Загружаем 3D‑модель" />
        </div>
      )}
      {status === 'error' && (
        <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted">
          Не удалось загрузить 3D‑модель. Проверьте соединение или поддержку WebGL в браузере.
        </p>
      )}
    </div>
  )
}
