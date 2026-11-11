import { describe, expect, it } from 'vitest';
import { lineLink, whatsappLink } from './contact';

describe('whatsappLink', () => {
  it('pre-fills the message as an encoded text parameter', () => {
    expect(whatsappLink('https://wa.me/810000000000', 'Hi, 1K near Shin-Okubo?'))
      .toBe('https://wa.me/810000000000?text=Hi%2C%201K%20near%20Shin-Okubo%3F');
  });
  it('keeps the plain link when there is no message', () => {
    expect(whatsappLink('https://wa.me/810000000000', '  ')).toBe('https://wa.me/810000000000');
  });
  it('trims long messages to keep the URL short', () => {
    expect(decodeURIComponent(whatsappLink('https://wa.me/1', 'x'.repeat(2000)).split('text=')[1])).toHaveLength(1000);
  });
});

describe('lineLink', () => {
  it('opens a LINE Official Account chat with the message pre-filled', () => {
    expect(lineLink('@kurashi-demo', 'Hello 1K')).toBe('https://line.me/R/oaMessage/%40kurashi-demo/?Hello%201K');
  });
  it('falls back to the add-friend link without a message', () => {
    expect(lineLink('@kurashi-demo', '')).toBe('https://line.me/R/ti/p/%40kurashi-demo');
  });
});
