import type { Metadata } from 'next';
import { Noto_Sans, Noto_Sans_JP, Noto_Sans_Myanmar } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FloatingContact } from '@/components/layout/FloatingContact';
import { Footer } from '@/components/layout/Footer';
import { PreferencesProvider } from '@/components/providers/PreferencesProvider';
import { defaultCurrency } from '@/lib/currency';
import { Header } from '@/components/layout/Header';
import { site } from '@/config/site';
import { routing } from '@/i18n/routing';
import { isIndexable } from '@/lib/seo';
import '../globals.css';

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans', display: 'swap' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-sans-jp', display: 'swap', preload: false });
const notoSansMyanmar = Noto_Sans_Myanmar({
  subsets: ['myanmar'], weight: ['400', '500', '700'], variable: '--font-noto-sans-myanmar', display: 'swap', preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(site.url),
    title: { default: `${t('homeTitle')} | ${site.name}`, template: `%s | ${site.name}` },
    description: t('siteDescription'),
    robots: isIndexable() ? undefined : { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const brandVars = {
    '--color-ink': site.colors.ink,
    '--color-accent': site.colors.accent,
    '--color-paper': site.colors.paper,
  } as React.CSSProperties;

  return (
    <html lang={locale} className={`${notoSans.variable} ${notoSansJP.variable} ${notoSansMyanmar.variable}`} style={brandVars}>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider>
          <PreferencesProvider defaultCurrency={defaultCurrency(locale)}>
            <Header />
            {children}
            <Footer />
            <FloatingContact />
          </PreferencesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
