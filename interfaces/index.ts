/* eslint-disable no-unused-vars */
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

export enum TransactionsBatchStatus {
    PENDING = 'pending',
    DONE = 'done',
    ERRORED = 'errored'
}
export type TransactionsBatch = {
    id?: string,
    status: TransactionsBatchStatus,
    createdAt?: string,
    updatedAt?: string,
    data: string[][],
    sender: string,
    processed?: number
}

export type TransactionPreview = {
  to: string,
  from: string,
  amount: number,
  assetId: number,
  tags: string[],
  row: number
}
