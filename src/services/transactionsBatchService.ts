import axios from 'axios'
import { TransactionsBatch } from '../../interfaces'

const CLIENT_NAME: string = process.env.BACKEND_URL ?? ''

export const getTransactionsBatches = async () => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/transactionsBatch`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const createTransactionsBatch = async (batch: TransactionsBatch) => {
  const config = {
    method: 'POST',
    url: `${CLIENT_NAME}/api/transactionsBatch`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: batch
  }
  const { data } = await axios(config)
  return data
}

export const updateTransactionsBatch = async (id: string, processed: number) => {
  const config = {
    method: 'PUT',
    url: `${CLIENT_NAME}/api/transactionsBatch/${id}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: { processed }
  }
  const { data } = await axios(config)
  return data
}

export const getTransactionsBatchById = async (id: string) => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/transactionsBatch/${id}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const removeTransactionsBatch = async (id: number) => {
  const config = {
    method: 'DELETE',
    url: `${CLIENT_NAME}/api/product/${id}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}
