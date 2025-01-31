import { ChainId } from 'config/chains'

export default {
  masterChef: {
    [ChainId.ETHEREUM]: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
  },
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  nftPositionManager: {
    [ChainId.ETHEREUM]: '0xe705E61220f70f7BcC3AD6b5DD00d4C953dAe090',
  },
  masterChefV3: {
    [ChainId.ETHEREUM]: '0x556B9306565093C855AEA9AE92A594704c2Cd59e',
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
