import { TransactionPreview, TransactionsBatch } from '../../interfaces'
import * as XLSX from 'xlsx'

export const generateExcel = (data: (string | number)[][]) => {
  const worksheet = XLSX.utils.aoa_to_sheet(data)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions-template')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions-template.xlsx'
  a.click()

  URL.revokeObjectURL(url)
}

export const parseTransactionPreview: (batch: TransactionsBatch) => TransactionPreview[] = (batch: TransactionsBatch) => {
  return batch.data.map((row, index) => ({
    to: row[0] as string,
    from: batch.sender,
    amount: Number(row[1]),
    assetId: Number(row[2]),
    tags: String(row[3]).split(','),
    row: index + 1
  }))
}
