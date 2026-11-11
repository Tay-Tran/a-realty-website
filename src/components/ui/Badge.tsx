const TONES = {
  neutral: 'bg-ink/5 text-ink',
  accent: 'bg-accent/10 text-accent-dark',
  success: 'bg-success/10 text-success',
  warn: 'bg-warn/15 text-warn',
  muted: 'bg-ink/10 text-ink-soft',
} as const;

export function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: keyof typeof TONES }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}>{children}</span>;
}
