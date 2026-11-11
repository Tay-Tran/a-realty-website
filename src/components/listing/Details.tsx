import { useTranslations } from 'next-intl';
import type { Listing } from '@/lib/data/types';
import { bedroomsOf, buildingAge, monthlyTotal } from '@/lib/listing/derived';
import { formatSize } from '@/lib/listing/format';
import { calcInitialCost } from '@/lib/listing/initial-cost';
import { Price } from '@/components/ui/Price';

type Row = [string, React.ReactNode];

function Column({ title, rows, total }: { title: string; rows: Row[]; total?: Row }) {
  return (
    <div className="rounded-2xl bg-paper p-4">
      <h3 className="font-bold">{title}</h3>
      <dl className="mt-3 divide-y divide-line text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 py-2">
            <dt className="text-ink-soft">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
        {total && (
          <div className="flex justify-between gap-3 pt-3 text-base">
            <dt className="font-bold">{total[0]}</dt>
            <dd className="font-bold text-accent">{total[1]}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/** Three columns like the reference: building · monthly costs · initial costs. */
export function Details({ listing }: { listing: Listing }) {
  const t = useTranslations('listing');
  const initial = calcInitialCost(listing);
  return (
    <section id="details" className="scroll-mt-48 rounded-2xl border border-line bg-white p-5">
      <h2 className="text-xl font-bold">{t('details')}</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Column title={t('building')} rows={[
          [t('layout'), listing.layout],
          [t('bedrooms'), bedroomsOf(listing.layout)],
          [t('size'), formatSize(listing.sizeM2)],
          [t('floor'), t('floorValue', { floor: listing.floor })],
          [t('built'), `${t('builtValue', { year: listing.builtYear })} · ${t('age', { years: buildingAge(listing) })}`],
        ]} />
        <Column title={t('monthly')} rows={[
          [t('rent'), <Price key="r" yen={listing.rent} />],
          [t('managementFee'), <Price key="m" yen={listing.managementFee} />],
        ]} total={[t('monthlyTotal'), <Price key="t" yen={monthlyTotal(listing)} />]} />
        <Column title={t('initialCostTitle')} rows={initial.items.map((item): Row => [
          item.months ? `${t(`costs.${item.key}`)} (${t('months', { months: item.months })})` : t(`costs.${item.key}`),
          item.amount === 0 ? t('free') : <Price key={item.key} yen={item.amount} />,
        ])} total={[t('total'), <Price key="it" yen={initial.total} />]} />
      </div>
      <p className="mt-3 text-xs text-ink-soft">{t('initialCostNote')}</p>
    </section>
  );
}
