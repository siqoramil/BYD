export const NAV_LINKS = [
  { id: 'models', label: 'Модели' },
  { id: 'battery', label: 'Технологии' },
  { id: 'configurator', label: 'Конфигуратор' },
  { id: 'finance', label: 'Кредит' },
  { id: 'showroom', label: 'Салон' },
] as const

/**
 * Showroom contacts — PLACEHOLDERS. Replace with the real dealer's data before going live.
 */
export const SHOWROOM = {
  city: 'Ташкент',
  /** prepositional case: «в Ташкенте» */
  cityIn: 'Ташкенте',
  address: 'г. Ташкент, укажите адрес, д. 1',
  phone: '+998 00 000 00 00',
  phoneHref: 'tel:+998000000000',
  email: 'info@example.uz',
  hours: [
    { days: 'Пн – Сб', time: '09:00 – 20:00' },
    { days: 'Воскресенье', time: '10:00 – 18:00' },
  ],
  mapUrl: 'https://maps.google.com/?q=Tashkent',
} as const

/** Illustrative annual loan rate used by the calculator. */
export const LOAN_ANNUAL_RATE = 0.22
