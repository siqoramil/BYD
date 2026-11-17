import type { CarPhoto } from './types'

const COMMONS = 'https://upload.wikimedia.org/wikipedia/commons/thumb/'

/** Wikimedia thumbnail URL (960 / 1280 / 1920 are standard cached widths). */
export function photoUrl(file: string, width: 960 | 1280 | 1920) {
  const name = file.split('/').pop()!
  return `${COMMONS}${file}/${width}px-${name}`
}

export const LICENSE_URLS: Record<string, string> = {
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY-NC-SA 4.0": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  "CC0": "https://creativecommons.org/publicdomain/zero/1.0/"
}

/**
 * ONE real base photo per model (Wikimedia Commons, free licences — credited on the page).
 * The photo is shown as-is; the selected colour is shown by name and swatch.
 */
export const BASE_PHOTOS = {
  'seal': {
    file: "2/22/%28SGP-Singapore%29_Showcar_BYD_Seal_No-plate_2024-10-24.jpg",
    author: "S5A-0043",
    license: 'CC BY 4.0',
    source: "https://commons.wikimedia.org/wiki/File:(SGP-Singapore)_Showcar_BYD_Seal_No-plate_2024-10-24.jpg",
    colorId: 'orange',
  },
  'han': {
    file: "4/4b/BYD_Han_DM_001.jpg",
    author: "Jengtingchen",
    license: 'CC BY-SA 4.0',
    source: "https://commons.wikimedia.org/wiki/File:BYD_Han_DM_001.jpg",
    colorId: 'crimson',
  },
  'song-plus': {
    file: "3/32/BYD_Song_Plus_GS_2024_%2853403880719%29.jpg",
    author: "RL GNZLZ from Chile",
    license: 'CC BY-SA 2.0',
    source: "https://commons.wikimedia.org/wiki/File:BYD_Song_Plus_GS_2024_(53403880719).jpg",
    colorId: 'crimson',
  },
  'tang': {
    file: "3/3c/BYD_Tang_II_DM_Facelift_Sanming_01_2022-08-19.jpg",
    author: "JamesYoung8167",
    license: 'CC BY-SA 4.0',
    source: "https://commons.wikimedia.org/wiki/File:BYD_Tang_II_DM_Facelift_Sanming_01_2022-08-19.jpg",
    colorId: 'crimson',
  },
  'chazor': {
    file: "9/9e/2025_BYD_Seal_5_DM-i_Premium.jpg",
    author: "Chanokchon",
    license: 'CC BY-SA 4.0',
    source: "https://commons.wikimedia.org/wiki/File:2025_BYD_Seal_5_DM-i_Premium.jpg",
    colorId: 'white',
  },
  'song-plus-dmi': {
    file: "8/88/BYD_Seal_U_DM-i_GIMS_2024_1X7A2192.jpg",
    author: "Alexander-93",
    license: 'CC BY-SA 4.0',
    source: "https://commons.wikimedia.org/wiki/File:BYD_Seal_U_DM-i_GIMS_2024_1X7A2192.jpg",
    colorId: 'grey',
  },
  'atto-2': {
    file: "5/56/BYD_Atto_2_DSC_8763.jpg",
    author: "Alexander Migl",
    license: 'CC BY-SA 4.0',
    source: "https://commons.wikimedia.org/wiki/File:BYD_Atto_2_DSC_8763.jpg",
    colorId: 'black',
  },
  'sealion-7': {
    file: "0/08/BYD_Sealion_07_EV_DSC_8264.jpg",
    author: "Alexander Migl",
    license: 'CC BY-SA 4.0',
    source: "https://commons.wikimedia.org/wiki/File:BYD_Sealion_07_EV_DSC_8264.jpg",
    colorId: 'grey',
  },
  'yangwang-u9': {
    file: "2/2a/Yangwang_U9_003.jpg",
    author: "JustAnotherCarDesigner",
    license: 'CC0',
    source: "https://commons.wikimedia.org/wiki/File:Yangwang_U9_003.jpg",
    colorId: 'crimson',
  },
  'seagull': {
    file: "f/f6/BYD_Seagull_EV_Sprout_Green_-_front.jpg",
    author: "Ethan Llamas",
    license: 'CC BY-SA 4.0',
    source: "https://commons.wikimedia.org/wiki/File:BYD_Seagull_EV_Sprout_Green_-_front.jpg",
    colorId: 'lime',
  },
} satisfies Record<string, CarPhoto>
