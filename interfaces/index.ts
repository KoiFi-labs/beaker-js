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
