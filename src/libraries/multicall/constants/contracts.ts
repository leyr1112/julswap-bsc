import { ChainId } from 'config/chains'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.ETHEREUM]: '0xeeF6ff30cF5D5b8aBA0DE16A01d17A0697a275b5',
}

export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

export const MULTICALL3_ADDRESSES: {
  [key in ChainId]?: Address
} = {
  [ChainId.ETHEREUM]: MULTICALL3_ADDRESS,
}
