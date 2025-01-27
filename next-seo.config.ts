import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | julswap',
  defaultTitle: 'julswap',
  description:
    'Discover julswap, the leading DEX on BSC with the best rewarding in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@',
    site: '@',
  },
  openGraph: {
    title: 'julswap - A next evolution DeFi exchange on BSC',
    description:
      'The most popular AMM on BSC!',
    images: [{ url: 'https://app.julswap.org/logo.png' }],
  },
}
