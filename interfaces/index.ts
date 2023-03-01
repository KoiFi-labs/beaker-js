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
