import axios from 'axios'
const CLIENT_NAME: string = process.env.BACKEND_URL ?? ''

export const getAccountInformation = async (account: string) => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/algoService/algod/accountInformation/${account}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const getTransactionsByAccount = async (account: string, limit: number) => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/algoService/indexer/transactions/${account}?limit=${limit}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const getTransactionsParams = async () => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/algoService/algod/transactionParmas`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const getAsset = async (assetId: number) => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/algoService/indexer/assets/${assetId}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}
