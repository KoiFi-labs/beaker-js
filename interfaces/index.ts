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

export type Pool = {
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
