import { ChainId } from "config/chains"
import { Percent, Token, WETH9, WNATIVE } from 'libraries/swap-sdk'
import { USDC, USDT, WBTC_ETH, GTOKEN, ethereumTokens} from 'libraries/tokens'
import { ChainMap, ChainTokenList } from './types'

export {
  ADDITIONAL_BASES,
  V2_ROUTER_ADDRESS,
  CUSTOM_BASES,
} from 'libraries/smart-router/evm'

export const ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], ethereumTokens.eth, USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
}

export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.ETHEREUM]: [
    [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
    [WBTC_ETH, WNATIVE[ChainId.ETHEREUM]],
    [WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  ],
}

export const BIG_INT_ZERO = 0n
export const BIG_INT_TEN = 10n

// one basis point
export const BIPS_BASE = 10000n
export const ONE_BIPS = new Percent(1n, BIPS_BASE)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(100n, BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(300n, BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(500n, BIPS_BASE) // 5%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(1000n, BIPS_BASE) // 10%

// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(1500n, BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: bigint = BIG_INT_TEN ** 15n // .001 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(25n, BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

export const EXCHANGE_PAGE_PATHS = ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove', '/stable', '/v2']