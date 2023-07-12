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
