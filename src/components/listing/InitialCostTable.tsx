import { useLocale, useTranslations } from 'next-intl';
import type { Listing, Locale } from '@/lib/data/types';
import { formatYen } from '@/lib/listing/format';
import { calcInitialCost } from '@/lib/listing/initial-cost';

export function InitialCostTable({ listing }: { listing: Listing }) {
  const t = useTranslations('listing');
  const locale = useLocale() as Locale;
  const { items, total } = calcInitialCost(listing);
  return (
    <section>
      <h2 className="text-xl font-bold">{t('initialCostTitle')}</h2>
      <table className="mt-3 w-full overflow-hidden rounded-2xl border border-line bg-white text-sm">
        <tbody>
          {items.map((item) => (
            <tr key={item.key} className="border-b border-line">
              <th scope="row" className="p-3 text-left font-normal text-ink-soft">
                {t(`costs.${item.key}`)}
                {item.months !== undefined && item.months > 0 && <span className="ml-2 text-xs">({t('months', { months: item.months })})</span>}
              </th>
              <td className="p-3 text-right font-medium">{item.amount === 0 ? t('free') : formatYen(item.amount, locale)}</td>
            </tr>
          ))}
          <tr className="bg-ink text-white">
            <th scope="row" className="p-3 text-left">{t('total')}</th>
            <td className="p-3 text-right text-lg font-bold">{formatYen(total, locale)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-xs text-ink-soft">{t('initialCostNote')}</p>
    </section>
  );
}
