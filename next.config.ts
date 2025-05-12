import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import './libs/Env';

const withNextIntl = createNextIntlPlugin('./libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
    withNextIntl({
      eslint: {
        dirs: ['.'],
      },
      poweredByHeader: false,
      reactStrictMode: true,
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'backend-lift-and-eat.nibrasoft.com',
            port: '',
            pathname: '/',
          },
          {
            protocol: 'http',
            hostname: '147.79.117.125',
            port: '6001',
          },
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '6001',
          },
        ],
      },
    }),
);