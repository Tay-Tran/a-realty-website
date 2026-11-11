import type { MetadataRoute } from 'next';
import { isIndexable } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return isIndexable()
    ? { rules: { userAgent: '*', allow: '/' } }
    : { rules: { userAgent: '*', disallow: '/' } };
}
