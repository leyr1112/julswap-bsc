import memoize from 'lodash/memoize'

import {
  Chain,
  bscTestnet
} from 'wagmi/chains'

export enum ChainId {
  ETHEREUM = 97,
}

export const CHAIN_QUERY_NAME: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'bsc-testnet',
}

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const CHAINS: [Chain, ...Chain[]] = [
  bscTestnet
]

export const PUBLIC_NODES: Record<ChainId, string[] | readonly string[]> = {
  [ChainId.ETHEREUM]: [
    ...bscTestnet.rpcUrls.default.http,
  ],
}

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})