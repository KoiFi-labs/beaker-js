import { isValidAddress } from 'algosdk'
type ExcelData = string[][];

export const validateExcelTransactionsData = (data: ExcelData): string[] => {
  const errors: string[] = []

  // Validate each data row (ignore the first row which is the header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i]

    // Validate the first column (valid Algorand address)
    const address = row[0]
    if (!isValidAddress(address)) {
      errors.push(`Row ${i + 1}: The Algorand address "${address}" is not valid.`)
    }

    // Validate the second column (valid amount)
    const amount = row[1]
    if (!isValidAmount(amount)) {
      errors.push(`Row ${i + 1}: The amount "${amount}" is not valid.`)
    }

    // Validate the third column (integer number or empty string)
    const assetId = row[2]
    if (!isValidAssetColumn(assetId)) {
      errors.push(`Row ${i + 1}: The value "${assetId}" in the asset column is not valid.`)
    }

    // Validate the fourth column (string or empty string)
    const tags = row[3]
    if (!isValidTagsColumn(tags)) {
      errors.push(`Row ${i + 1}: The value "${tags}" in the tags column is not valid.`)
    }
  }

  return errors
}

const isValidAmount = (amount: string): boolean => {
  // Check if it is a number greater than 0
  const parsedAmount = parseFloat(amount)
  return !isNaN(parsedAmount) && parsedAmount > 0
}

const isValidAssetColumn = (value: string): boolean => {
  return Number.isInteger(Number(value)) || value === ''
}

const isValidTagsColumn = (value: string): boolean => {
  if (value === '') return true
  const words = value.split(',')
  return words.every((word) => word.trim() !== '')
}
