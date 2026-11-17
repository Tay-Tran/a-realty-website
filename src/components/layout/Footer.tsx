import { useTranslations } from 'next-intl';
import { site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="mt-20 border-t border-line bg-ink text-white/80">
      <Container className="grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">{site.name}</p>
          <p className="mt-2 text-sm">{t('footer.tagline')}</p>
        </div>
        <div>
          <p className="font-semibold text-white">{t('footer.links')}</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/rent" className="hover:text-white">{t('nav.findRoom')}</Link></li>
            <li><Link href={{ pathname: '/', hash: 'areas' }} className="hover:text-white">{t('nav.areas')}</Link></li>
            <li><Link href="/partner" className="hover:text-white">{t('nav.partners')}</Link></li>
            <li><Link href="/careers" className="hover:text-white">{t('nav.careers')}</Link></li>
            <li><Link href={{ pathname: '/', hash: 'faq' }} className="hover:text-white">{t('faq.title')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">{t('footer.contactTitle')}</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href={site.contact.phoneHref} className="hover:text-white">{site.contact.phoneDisplay}</a></li>
            <li><a href={`mailto:${site.contact.email}`} className="hover:text-white">{site.contact.email}</a></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        <p>{t('common.demoNotice')}</p>
        <p className="mt-1">{t('footer.rights', { year: new Date().getFullYear(), name: site.name })}</p>
      </div>
    </footer>
  );
}
