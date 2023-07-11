export type Product = {
    id: number
    name: string,
    assets: {
        symbol: string,
        amount: number
    }[],
    value: number
}

export type Balance = {
    assetId: string,
    assetSymbol: string,
    amount: number
}

export type Price = {
    assetSymbol: string,
    price: number
}

export type Transaction = {
  txId: string,
  sender: string,
  receiver: string,
  amount: number,
  asset: number,
  txType: string,
  note?: string,
}

export type PoolInterface = {
    id: string,
    assetA: {
        amount: number,
        id: number,
        symbol: string
    },
    assetB: {
        amount: number,
        id: number,
        symbol: string
    },
    poolAsset: {
        amount: number,
        id: number,
        symbol: string
    },
    poolName: string
}

export type Pool = {
    name: string
    appId: number
    appAddress: string
    lpId: number
    assetIdA: number
    assetIdB: number
    scale: number
    fee: number
}
