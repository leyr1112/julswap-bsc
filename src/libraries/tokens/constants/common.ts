import { ChainId } from 'config/chains'
import { ERC20Token } from 'libraries/swap-sdk'

export const GTOKEN_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x4793405c2231D8646F8ee79E120c230c574b0c4B',
  18,
  'NOI',
  'NOI Token',
  'https://julswap.com/',
)

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07',
  6,
  'USDC',
  'USD Coin from Ethereum',
)

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
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
