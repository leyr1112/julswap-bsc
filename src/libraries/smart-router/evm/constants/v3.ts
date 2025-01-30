import { ChainId } from 'config/chains'
import { Address } from 'viem'

// = 1 << 23 or 100000000000000000000000
export const V2_FEE_PATH_PLACEHOLDER = 8388608

export const MSG_SENDER = '0x0000000000000000000000000000000000000001'
export const ADDRESS_THIS = '0x0000000000000000000000000000000000000002'

export const MIXED_ROUTE_QUOTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x7a95741BCCDb7A2d88FBC1F1E15DD51F515c2F76',
} as const satisfies Record<ChainId, Address>

export const V3_QUOTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x8B77E0B26FE24022bF8E1e8c8eF4a735e355Bcd6',
} as const satisfies Record<ChainId, Address>
