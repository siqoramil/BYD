/**
 * 3D models (glTF binary) per car id.
 *
 * To add a model: put the file into `public/models/` and add an entry here.
 * `paint` lists the material names that carry the body colour — they get re-tinted
 * when the user picks a colour (open the .glb in https://gltf.report to find the names).
 */
export interface CarModel3D {
  url: string
  /** names of the body-paint materials */
  paint: string[]
  /** rotation around the vertical axis (radians) so that the car faces the camera */
  yaw?: number
  author: string
  license: string
  source: string
}

export const CAR_MODELS: Record<string, CarModel3D | undefined> = {
  seal: {
    url: '/models/byd-seal.glb',
    paint: ['Car_Paint'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2024-byd-seal-2e82d2aaaa3d47debf39b1160d3fe376',
  },
  // Song Plus is sold as "Seal U" outside China — same car
  'song-plus': {
    url: '/models/2024_byd_seal_u.glb',
    paint: ['CarPaint'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2024-byd-seal-u-dda5d96fa79e42c290a279168126f247',
  },
  // Seal 5 DM-i is sold as "Chazor" in Uzbekistan (Destroyer 05 / King elsewhere)
  chazor: {
    url: '/models/2025_byd_seal_5_dm-i_chazor_king_destroyer_05.glb',
    paint: ['CarPaint'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2025-byd-seal-5-dm-i-chazor-king-destroyer-05-c3bdefa332384e95a9fd249d0abb25c3',
  },
  'song-plus-dmi': {
    url: '/models/2024_byd_seal_u_dm-i.glb',
    paint: ['CarPaint'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2024-byd-seal-u-dm-i-e3a2ef09dcc547ccafe1687328ec05f0',
  },
  'atto-2': {
    url: '/models/2024_byd_atto_2.glb',
    paint: ['Atto2phong1SG1'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2024-byd-atto-2-2e04b67017ed49e982a1f0737eb7f0ae',
  },
  han: {
    url: '/models/2023_byd_han_dm-p.glb',
    paint: ['BYD_CARP'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2023-byd-han-dm-p-262fad42369a4a9c8c3371b7dfbc922f',
  },
  'sealion-7': {
    url: '/models/2024_byd_sealion_7.glb',
    paint: ['carpaint'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2024-byd-sealion-7-4eb4a93ae47b47f4b213dd89a0ad89f0',
  },
  seagull: {
    url: '/models/2024_byd_seagull.glb',
    paint: ['modelCP'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2024-byd-seagull-7ffd92188fcd43429545e5e0b12c416c',
  },
  'yangwang-u9': {
    url: '/models/2024_byd_yangwang_u9.glb',
    paint: ['MAT_BYD_YangWang_U9_Carpaint'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2024-byd-yangwang-u9-9f9d82e405ca4382a1c9ff442f5862c2',
  },
  tang: {
    url: '/models/2024_byd_tang.glb',
    paint: ['CarPaint'],
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    source: 'https://sketchfab.com/3d-models/2024-byd-tang-0af7ffe7b3b64d7fb9e31d4f1bac10c1',
  },
}

export const getCarModel = (carId: string) => CAR_MODELS[carId]
