import { ChainId } from 'config/chains'
import { Address } from 'viem'

// = 1 << 23 or 100000000000000000000000
export const V2_FEE_PATH_PLACEHOLDER = 8388608

export const MSG_SENDER = '0x0000000000000000000000000000000000000001'
export const ADDRESS_THIS = '0x0000000000000000000000000000000000000002'

export const MIXED_ROUTE_QUOTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x672890e4100320F6f142aB22caecC76f3A106b46',
} as const satisfies Record<ChainId, Address>

export const V3_QUOTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x0D4B9aDDa24cdc6c4C5Bbe8C2ca370A7F3EcE7F7',
} as const satisfies Record<ChainId, Address>
