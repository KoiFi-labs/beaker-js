import { isValidAddress } from 'algosdk'
import { Balance, hasOptin } from '../../services/algoService'
type ExcelData = string[][];

export const validateExcelTransactionsData = async (data: ExcelData, balances: Balance[]): Promise<string[]> => {
  const errors: string[] = []
  const assetSums: Map<string, number> = new Map()

  // Validate each data row (ignore the first row which is the header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i]

    console.log('row: ', row)

    // Validate the first column (valid Algorand address)
    const address = row[0]
    if (!isValidAddress(address)) {
      errors.push(`Row ${i + 1}: The Algorand address is not valid.`)
    }

    // Validate the second column (valid amount)
    const amount = row[1]
    if (!isValidAmount(amount)) {
      errors.push(`Row ${i + 1}: The amount is not valid.`)
    }

    // Validate the third column (integer number or empty string)
    const assetId = row[2]
    if (!isValidAsset(assetId)) {
      console.log(typeof assetId)
      errors.push(`Row ${i + 1}: The asset id is not valid.${row}`)
    }

    // Validate the fourth column (string or empty string)
    const tags = row[3]
    if (!isValidTagsColumn(tags)) {
      errors.push(`Row ${i + 1}: The tags are not valid.`)
    }

    if (isValidAmount(amount) && isValidAsset(assetId)) {
      const currentSum = assetSums.get(assetId) || 0
      if (assetId === undefined) {
        assetSums.set('0', currentSum + Number(amount))
      } else {
        assetSums.set(assetId, currentSum + Number(amount))
      }
    }

    if (isValidAddress(address) && isValidAsset(assetId) && assetId !== undefined) {
      if (!(await hasOptin(address, Number(assetId)))) {
        errors.push(`Row ${i + 1}: Address need optin asset ${assetId}`)
      }
    }
  }

  if (errors.length === 0) {
    for (const [assetId, sum] of assetSums.entries()) {
      const balance = balances.find((b) => b.assetId === Number(assetId))
      if (balance === undefined || sum > balance.amount) {
        if (assetId === '0') {
          errors.push('Insufficient \'ALGO\' balance')
        } else {
          errors.push(`Insufficient balance for asset ${assetId}`)
        }
      }
    }
  }

  return errors
}

const isValidAmount = (amount: string): boolean => {
  // Check if it is a number greater than 0
  const parsedAmount = parseFloat(amount)
  return !isNaN(parsedAmount) && parsedAmount > 0
}

const isValidAsset = (value: string): boolean => {
  if (value === undefined) return true
  return !Number.isNaN(Number(value))
}

const isValidTagsColumn = (value: string): boolean => {
  if (value === undefined) return true
  const words = value.split(',')
  return words.every((word) => word.trim() !== '')
}
