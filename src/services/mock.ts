import axios from 'axios'
import { Product } from '../../interfaces'

export const getBalances = async () => {
  const config = {
    method: 'GET',
    url: 'https://kondor.vercel.app/api/balance',
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
    url: 'https://kondor.vercel.app/api/price',
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
    url: 'https://kondor.vercel.app/api/product',
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
    url: 'https://kondor.vercel.app/api/product',
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
    url: 'https://kondor.vercel.app/api/product/' + id,
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
    url: 'https://kondor.vercel.app/api/product/' + id,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data } = await axios(config)
  return data
}
