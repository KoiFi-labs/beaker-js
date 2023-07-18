import { isValidAddress } from 'algosdk'
import { Balance, getAssetDetails, hasOptin } from '../../services/algoClient'
import { getSuggestedParams } from '../../services/kondorServices/transactions'
type ExcelData = string[][];

export const validateExcelTransactionsData = async (data: ExcelData, balances: Balance[], minBalance: number): Promise<string[]> => {
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

  const assetsInfo = await Promise.all(
    Array.from(assetSums.keys())
      .filter(a => Number(a) !== 0)
      .map(a => Number(a))
      .map(a => getAssetDetails(a)))

  const getAssetDecimal = (assetId: number) => {
    return assetsInfo.find(a => a?.asset.index === assetId)?.asset.params.decimals
  }

  // check algo balance
  const algoBalance = balances.find(b => b.assetId === 0)
  const algoSum = assetSums.get('0') ? assetSums.get('0')! * Math.pow(10, 6) : 0 // add decimals
  const fees = (await getSuggestedParams()).minFee * (data.length - 1) // min fee * txs amount
  const algoTotal = algoSum + fees + minBalance
  if (algoTotal > algoBalance?.amount!) {
    errors.push('Insufficient \'ALGO\' balance')
  }

  if (errors.length === 0) {
    for (const [assetId, sum] of assetSums.entries()) {
      if (assetId !== '0') { // Ignore ALGO case
        const balance = balances.find((b) => b.assetId === Number(assetId))
        const assetDecimals = getAssetDecimal(Number(assetId))
        if (!assetDecimals) {
          errors.push(`Invalid asset ${assetId}`)
          continue
        }
        const sumValue = sum * Math.pow(10, assetDecimals)
        console.log('Asset: ', assetId, 'Sum: ', sumValue, 'Balance: ', balance?.amount)
        if (balance === undefined || sumValue > balance.amount) {
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

export const parseRowData = (data: string[]) => {
  return [data[0], data[1], data[2], data[3] ? data[3] : '']
}
