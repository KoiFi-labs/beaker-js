export const abbreviateTransaction = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export const abbreviateAddress = (wallet: string): string => {
  return wallet.slice(0, 6) + '...' + wallet.slice(wallet.length - 4, wallet.length)
}

export const abbreviateNumber = (num: number, precision?: number): string => {
  // If the number is less than 1000, just return it as a string with the specified number of decimal places
  const precisionToUse = precision || 2
  if (Math.abs(num) < 1000) {
    return num.toFixed(precisionToUse)
  }
  const abbreviations = ['', 'K', 'M', 'B', 'T']

  const isNegative = num < 0
  const absoluteValue = Math.abs(num)
  const index = Math.floor(Math.log10(absoluteValue) / 3)
  const abbreviatedValue = (absoluteValue / Math.pow(10, index * 3)).toFixed(precisionToUse) + abbreviations[index]
  return isNegative ? '-' + abbreviatedValue : abbreviatedValue
}

export const copyToClipboard = (text: string) => {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const isNumber = (c: string) => {
  return !isNaN(Number(c))
}

export const isValidAlgorandAddress = (address: string): boolean => {
  const addressRegex = /^(?:[A-Z2-7]{58})$/
  return addressRegex.test(address)
}

export const algorandErrorCleaner = (input: string): string => {
  const prefix = 'Network request error. Received status 400 (): TransactionPool.Remember: transaction '
  const cleanedString = input.startsWith(prefix) ? input.substring(prefix.length + 54) : input
  return cleanedString
}

export const stringToUint8Array = (input: string): Uint8Array => {
  const encoder = new TextEncoder()
  return encoder.encode(input)
}

export const base64Decode = (input: string) => {
  // In browser
  if (typeof atob === 'function') {
    return atob(input)
  }
  // In Node.js
  if (typeof Buffer !== 'undefined') {
    const buffer = Buffer.from(input, 'base64')
    return buffer.toString('utf-8')
  }
  throw new Error('Unable to decode Base64 in this environment')
}

export const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }
  return result
}

export function divideIntoBatches<T> (arr: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  let currentBatch: T[] = []

  for (let i = 0; i < arr.length; i++) {
    currentBatch.push(arr[i])

    if (currentBatch.length === batchSize || i === arr.length - 1) {
      batches.push(currentBatch)
      currentBatch = []
    }
  }

  return batches
}
