export type TransactionParams = {
  from: string,
  to: string,
  amount: number,
  assetId: number,
  tags: string[]
}

export interface Params {
clawback: string;
  creator: string;
  decimals: number;
  'default-frozen': boolean;
  freeze: string;
  manager: string;
  name: string;
  'name-b64': string;
  reserve: string;
  total: number;
  'unit-name': string;
  'unit-name-b64': string;
}

export interface AssetDetails {
  'created-at-round': number;
  deleted: boolean;
  index: number;
  params: Params;
}

export interface AssetInfo {
  asset: AssetDetails;
  'current-round': number;
}
