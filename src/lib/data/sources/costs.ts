import type { CostBreakdown, CostKey, CostLine } from '../types';
import type { JkRecord, LeopalaceCost } from './types';

const yen = (n: number) => `¥${n.toLocaleString('en-US')}`;

/** Amount with its own tax rate applied, e.g. keyExchangeFee 15,000 + keyExchangeFeeTaxRate 10 → 16,500. */
function withTax(obj: Record<string, number | undefined>, key: string, rateKey = `${key}TaxRate`): number {
  const amount = obj[key] ?? 0;
  const rate = obj[rateKey] ?? 0;
  return Math.round(amount * (1 + rate / 100));
}

/**
 * Leopalace21 publishes its own move-in calculator (GET /api/properties/{no}/cost). Every amount is
 * taken from there, tax included per item, so the required items add up to its `totalFee`.
 */
export function leopalaceCosts(cost: LeopalaceCost, rent: number): CostBreakdown {
  const r = cost.required;
  const o = cost.withOptions;
  const months = (amount: number) => (rent > 0 ? Math.round((amount / rent) * 100) / 100 : undefined);
  const line = (key: CostKey, amount: number, extra: Partial<CostLine> = {}): CostLine => ({ key, amount, ...extra });

  const initial = [
    line('advanceRent', (r.rentIncludeCommonServiceFee ?? 0) + withTax(r, 'environmentalMaintenanceFee')),
    line('deposit', r.shikikin ?? 0, { months: months(r.shikikin ?? 0) }),
    line('keyMoney', r.reikin ?? 0, { months: months(r.reikin ?? 0) }),
    line('guaranteeFee', r.guaranteeFee ?? 0),
    line('keyExchange', withTax(r, 'keyExchangeFee')),
  ];
  const optional = [
    line('insurance', o.residentAnshinInsurance ?? 0),
    line('cleaning', withTax(o, 'basicCleaningFee')),
    line('residentSupport', withTax(o, 'residentSupportSystemFee')),
    line('antibacterial', withTax(o, 'antibacterialConstructionFee')),
  ].filter((l) => l.amount > 0);
  const environment = withTax(cost.monthly, 'environmentalMaintenanceFeePerMonth', 'environmentalMaintenanceFeeTaxRate');
  return {
    monthlyExtras: environment > 0 ? [line('environmentFee', environment)] : [],
    initial,
    optional,
    toConfirm: [],
  };
}

const num = (text: string) => Number(text.replace(/,/g, ''));

/** J&K writes the guarantor terms as text: 【初回保証料】総賃料の85％ … 【火災保険】21,500〜22,000円/2年毎 … */
export function parseJkTerms(text: string | null) {
  const t = (text ?? '').normalize('NFKC');
  const guarantee = /初回保証料】\s*総賃料の\s*([\d.]+)\s*%/.exec(t);
  const fee = /【手数料】\s*総賃料の\s*([\d.]+)\s*%/.exec(t);
  const insurance = /火災保険】\s*([\d,]+)(?:\s*[〜~-]\s*([\d,]+))?\s*円\s*\/\s*(\d+)\s*年/.exec(t);
  const key = /ユーナインタイプ\s*:\s*([\d,]+)\s*円/.exec(t);
  return {
    guaranteePct: guarantee ? Number(guarantee[1]) : undefined,
    monthlyFeePct: fee ? Number(fee[1]) : undefined,
    insurance: insurance ? { min: num(insurance[1]), max: num(insurance[2] ?? insurance[1]), years: Number(insurance[3]) } : undefined,
    keyExchange: key ? num(key[1]) : undefined,
  };
}

/** Monthly items J&K lists per room: 安心サポート費 and up to two 固定費 (e.g. 固定水道 2,200). */
function jkMonthly(r: JkRecord): CostLine[] {
  const out: CostLine[] = [];
  const support = Number(r.安心サポート費 || 0);
  if (support > 0) out.push({ key: 'supportFee', amount: support });
  for (const [label, amount] of [[r.固定費項目＿1, r.固定費＿1], [r.固定費項目＿2, r.固定費＿2]] as const) {
    const name = (label ?? '').normalize('NFKC').trim();
    if (name && name !== '-' && Number(amount || 0) > 0) out.push({ key: 'fixedFee', amount: Number(amount), label: name });
  }
  return out;
}

export function jkCosts(r: JkRecord, rent: number, managementFee: number, deposit: number, keyMoney: number): CostBreakdown {
  const monthlyExtras = jkMonthly(r);
  const totalMonthly = rent + managementFee + monthlyExtras.reduce((s, c) => s + c.amount, 0);
  const terms = parseJkTerms(r['条件2＿保証会社の加入条件']);
  const toConfirm: CostKey[] = ['cleaning'];

  const initial: CostLine[] = [
    { key: 'advanceRent', amount: totalMonthly },
    { key: 'deposit', amount: Math.round(rent * deposit), months: deposit },
    { key: 'keyMoney', amount: Math.round(rent * keyMoney), months: keyMoney },
  ];
  if (terms.guaranteePct !== undefined) {
    const monthlyFee = terms.monthlyFeePct ? ` (+${terms.monthlyFeePct}%/month)` : '';
    initial.push({
      key: 'guaranteeFee', amount: Math.round((totalMonthly * terms.guaranteePct) / 100),
      note: {
        en: `${terms.guaranteePct}% of total monthly rent${monthlyFee}`,
        my: `${terms.guaranteePct}% of total monthly rent${monthlyFee}`,
        ja: `総賃料の${terms.guaranteePct}%${terms.monthlyFeePct ? `（月額手数料${terms.monthlyFeePct}%）` : ''}`,
      },
    });
  } else toConfirm.unshift('guaranteeFee');
  if (terms.insurance) {
    const { min, max, years } = terms.insurance;
    const range = min === max ? yen(min) : `${yen(min)}–${yen(max)}`;
    initial.push({
      key: 'insurance', amount: max,
      note: { en: `${range} / ${years} years`, my: `${range} / ${years} years`, ja: `${range}／${years}年` },
    });
  } else toConfirm.unshift('insurance');

  const optional: CostLine[] = terms.keyExchange
    ? [{ key: 'keyExchange', amount: terms.keyExchange, note: { en: 'U9 key type', my: 'U9 key type', ja: 'ユーナインタイプ' } }]
    : [];
  if (!terms.keyExchange) toConfirm.push('keyExchange');
  return { monthlyExtras, initial, optional, toConfirm };
}
