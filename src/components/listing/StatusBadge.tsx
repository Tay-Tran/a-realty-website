import { useTranslations } from 'next-intl';
import type { ListingStatus } from '@/lib/data/types';
import { Badge } from '@/components/ui/Badge';

const TONE = { available: 'success', applied: 'warn', rented: 'muted' } as const;

export function StatusBadge({ status }: { status: ListingStatus }) {
  const t = useTranslations('status');
  return <Badge tone={TONE[status]}>{t(status)}</Badge>;
}
