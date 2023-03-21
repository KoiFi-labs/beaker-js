export const abbreviateTransactionHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export const abbreviateWallet = (wallet: string): string => {
  return wallet.slice(0, 6) + '...' + wallet.slice(wallet.length - 4, wallet.length)
}

export const abbreviateNumber = (num: number, precision?: number): string => {
  const abbreviations = ['', 'K', 'M', 'B', 'T']
  const precisionToUse = precision || 2
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
