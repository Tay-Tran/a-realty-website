import { useTranslations } from 'next-intl';
import { site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { CurrencySwitcher } from './CurrencySwitcher';
import { FavoritesLink } from './FavoritesLink';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu, type NavItem } from './MobileMenu';

export function Header() {
  const t = useTranslations('nav');
  const links: NavItem[] = [
    { href: '/rent', label: t('findRoom') },
    { href: { pathname: '/', hash: 'areas' }, label: t('areas') },
    { href: { pathname: '/', hash: 'steps' }, label: t('howItWorks') },
    { href: { pathname: '/', hash: 'contact' }, label: t('contact') },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-ink">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white">暮</span>
          <span className="whitespace-nowrap text-base sm:text-lg">{site.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {links.map((l) => <Link key={l.label} href={l.href} className="text-ink-soft hover:text-ink">{l.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <FavoritesLink />
          <CurrencySwitcher className="hidden md:inline-flex" />
          <LanguageSwitcher />
          <MobileMenu links={links} menuLabel={t('menu')} closeLabel={t('close')} />
        </div>
      </Container>
    </header>
  );
}
