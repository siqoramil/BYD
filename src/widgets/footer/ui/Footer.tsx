import { CARS, LICENSE_URLS } from '@/entities/car'
import { NAV_LINKS, SHOWROOM } from '@/shared/config/site'
import { scrollToSection } from '@/shared/lib'
import { Container, Logo } from '@/shared/ui'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-fg/8 py-14">
      <Container className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-muted">
            Build Your Dreams. Электромобили, сервис и финансирование — в {SHOWROOM.cityIn}.
          </p>
        </div>
        <nav className="grid content-start gap-2 text-sm">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-fg/40">Разделы</p>
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => scrollToSection(l.id)} className="w-fit cursor-pointer text-fg/70 hover:text-fg">
              {l.label}
            </button>
          ))}
        </nav>
        <div className="grid content-start gap-2 text-sm text-fg/70">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-fg/40">Контакты</p>
          <a href={SHOWROOM.phoneHref} className="hover:text-fg">{SHOWROOM.phone}</a>
          <a href={`mailto:${SHOWROOM.email}`} className="hover:text-fg">{SHOWROOM.email}</a>
          <span>{SHOWROOM.address}</span>
        </div>
      </Container>
      <Container className="mt-12 text-[11px] leading-relaxed text-fg/35">
        Фотографии — Wikimedia Commons (свободные лицензии):{' '}
        {CARS.map((c) => ({ car: c, photo: c.photo })).map((v, i, all) => (
          <span key={v.photo.file}>
            BYD {v.car.name} —{' '}
            <a href={v.photo.source} target="_blank" rel="noreferrer" className="hover:text-fg">
              {v.photo.author}
            </a>{' '}
            (
            <a href={LICENSE_URLS[v.photo.license]} target="_blank" rel="noreferrer" className="hover:text-fg">
              {v.photo.license}
            </a>
            ){i < all.length - 1 ? '; ' : '.'}
          </span>
        ))}
      </Container>
      <Container className="mt-6 flex flex-col justify-between gap-2 text-xs text-fg/40 sm:flex-row">
        <span>© {YEAR} BYD Showroom. Все права защищены.</span>
        <span>Цены и характеристики ориентировочные; точную информацию уточняйте у менеджера.</span>
      </Container>
    </footer>
  )
}
