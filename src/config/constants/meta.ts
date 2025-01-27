import memoize from 'lodash/memoize'

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export const DEFAULT_META: PageMeta = {
  title: 'JulSwap',
  description: 'Trade, earn, and own crypto on the all-in-one JulSwap',
  image: `https://app.julswap.com/images/web/og/hero.jpg`,
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const getPathList = (): PathList => {
  return {
    paths: {
      '/': { title: 'Swap'},
      '/swap': { basePath: true, title: 'Swap', image: `https://app.julswap.com/images/web/og/swap.jpg` },
      '/add': { basePath: true, title: 'Add Pool', image: `https://app.julswap.com/images/web/og/liquidity.jpg` },
      '/remove': { basePath: true, title: 'Remove Pool', image: `https://app.julswap.com/images/web/og/liquidity.jpg` },
      '/pool': { title: 'Pool', image: `https://app.julswap.com/images/web/og/liquidity.jpg` },
      '/find': { title: 'Import Pool' },
      '/farms': { title: 'Farms', image: `https://app.julswap.com/images/web/og/farms.jpg` },
      '/pools': { title: 'Pools', image: `https://app.julswap.com/images/web/og/pools.jpg` },
      '/info': {
        title: "Overview - Info",
        description: 'View statistics for JulSwap.',
        image: `https://app.julswap.com/images/web/og/info.jpg`,
      },
      '/info/pairs': {
        title: 'Pairs - Info',
        description: 'View statistics for JulSwap.',
        image: `https://app.julswap.com/images/web/og/info.jpg`,
      },
      '/info/tokens': {
        title: "Tokens - Info",
        description: 'View statistics for JulSwap.',
        image: `https://app.julswap.com/images/web/og/info.jpg`,
      }
    },
    defaultTitleSuffix: 'JulSwap',
  }
}

export const getCustomMeta = memoize(
  (path: string): PageMeta | null => {
    const pathList = getPathList()
    const basePath = Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]
    const pathMetadata = pathList.paths[path] ?? (basePath && pathList.paths[basePath])

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path) => `${path}`,
)
