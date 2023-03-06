import axios from 'axios'
import { Product } from '../../interfaces'

const CLIENT_NAME: string = process.env.BACKEND_URL ?? ''

export const getBalances = async () => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/balance`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const getPrices = async () => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/price`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const getProducts = async () => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/product`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const createProduct = async (product: Product) => {
  const config = {
    method: 'POST',
    url: `${CLIENT_NAME}/api/product`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: product
  }
  const { data } = await axios(config)
  return data
}

export const getProductById = async (id: number) => {
  const config = {
    method: 'GET',
    url: `${CLIENT_NAME}/api/product/${id}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}

export const removeProduct = async (id: number) => {
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
