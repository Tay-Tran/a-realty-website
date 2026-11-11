import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CATEGORY_IMAGES, CATEGORY_KEYS } from '@/components/search/constants';

/** Photo tiles; rendered next to the inquiry form on the home page. */
export function CategoryTiles() {
  const t = useTranslations('categories');
  return (
    <div>
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
        {CATEGORY_KEYS.map((key) => (
          <Link key={key} href={`/rent?conditions=${key}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
            <Image src={CATEGORY_IMAGES[key]!} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-90" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-base font-semibold text-white">
              {t(key)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
