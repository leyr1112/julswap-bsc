import { ChainId } from 'config/chains'
import { ERC20Token } from 'libraries/swap-sdk'

export const GTOKEN_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  18,
  'CAKE',
  'PancakeSwap Token',
  'https://pancakeswap.finance/',
)

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'Tether USD from Ethereum',
  'https://tether.to/',
)

export const DAI_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xefD766cCb38EaF1dfd701853BFCe31359239F305',
  18,
  'DAI',
  'Dai Stablecoin from Ethereum',
  'https://makerdao.com/',
)

export const WBTC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xb17D901469B9208B17d916112988A3FeD19b5cA1',
  8,
  'WBTC',
  'Wrapped BTC from Ethereum',
)

export const GTOKEN = {
  [ChainId.ETHEREUM]: GTOKEN_ETH,
}

export const USDC = {
  [ChainId.ETHEREUM]: USDC_ETH,
}

export const USDT = {
  [ChainId.ETHEREUM]: USDT_ETH,
}

export const DAI = {
  [ChainId.ETHEREUM]: DAI_ETH,
}
