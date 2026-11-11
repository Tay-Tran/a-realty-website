const MAX_PREFILL = 1000;

/** WhatsApp click-to-chat link with the visitor's message pre-filled (wa.me supports ?text=). */
export function whatsappLink(base: string, message: string): string {
  const text = message.trim().slice(0, MAX_PREFILL);
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
