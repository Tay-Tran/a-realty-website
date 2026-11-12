import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Photos of the rooms pulled from Leopalace21 (prd-… redirects to dist…) and J&K (kViewer).
      { protocol: 'https', hostname: '**.imagewave.pictures' },
      { protocol: 'https', hostname: '26bb69c2.viewer.kintoneapp.com', pathname: '/public/file/inline/**' },
    ],
  },
};

export default withNextIntl(nextConfig);
