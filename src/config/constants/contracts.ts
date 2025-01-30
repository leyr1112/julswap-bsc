import { ChainId } from 'config/chains'

export default {
  masterChef: {
    [ChainId.ETHEREUM]: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
  },
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  nftPositionManager: {
    [ChainId.ETHEREUM]: '0x69c8aDa232B77834235541699F25c95479C1Bbb1',
  },
  masterChefV3: {
    [ChainId.ETHEREUM]: '0x556B9306565093C855AEA9AE92A594704c2Cd59e',
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
