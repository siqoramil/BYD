
export type BodyType = 'sedan' | 'suv' | 'hatch' | 'coupe'

export interface CarColor {
  id: string
  name: string
  hex: string
}

export interface CarTrim {
  id: string
  name: string
  priceDelta: number
  rangeKm: number
  powerHp: number
  accel: number
}

export interface Car {
  id: string
  name: string
  tagline: string
  description: string
  body: BodyType
  price: number
  batteryKwh: number
  seats: number
  trims: [CarTrim, ...CarTrim[]]
  /** real photo of the model */
  photo: CarPhoto
  /** available colours; [0] is the default */
  colors: [string, ...string[]]
  /** true when `public/cars/<id>/<colour>.webp` exists for every colour */
  studio: boolean
}

export interface CarPhoto {
  /** path under commons/thumb, e.g. "3/34/File_name.jpg" */
  file: string
  author: string
  license: string
  source: string
  /** paint colour visible in the photo */
  colorId: string
  /** CSS object-position focal point */
  position?: string
}
