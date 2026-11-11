const MAX_PREFILL = 1000;

/** LINE Official Account chat with the message pre-filled (line.me/R/oaMessage/{id}/?{text}). */
export function lineLink(accountId: string, message: string): string {
  const id = encodeURIComponent(accountId);
  const text = message.trim().slice(0, MAX_PREFILL);
  return text ? `https://line.me/R/oaMessage/${id}/?${encodeURIComponent(text)}` : `https://line.me/R/ti/p/${id}`;
}

/** WhatsApp click-to-chat link with the visitor's message pre-filled (wa.me supports ?text=). */
export function whatsappLink(base: string, message: string): string {
  const text = message.trim().slice(0, MAX_PREFILL);
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
