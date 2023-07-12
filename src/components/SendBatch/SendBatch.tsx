/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Container, Spacer } from '@nextui-org/react'
import { useState } from 'react'
import { CustomButton } from '../CustomButton/CustomButton'
import * as XLSX from 'xlsx'
import styles from './SendBatch.module.css'
import { generateExcel } from '../../utils/excel'
import { transactionsTemplateData } from './transactionsTemplate'
import { validateExcelTransactionsData } from './utils'
import ErrorModal from '../../../src/components/modules/Modals/ErrorModal'

enum Step {
  WALLET_CONNECT_NEEDED,
  INVALID_ALGORAND_ADDRESS,
  INSUFFICIENT_BALANCE,
  READY
}

const SendBatch = () => {
  const [step, setStep] = useState<Step>(Step.WALLET_CONNECT_NEEDED)
  const [excelData, setExcelData] = useState<string[][] | null>(null)
  const [excelErrors, setExcelErrors] = useState<string[] | null>(null)
  const [errorModalIsVisible, setErrorModalIsVisible] = useState<boolean>(false)

  const handleOkErrorButton = () => {
    setErrorModalIsVisible(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      if (Array.isArray(jsonData)) {
        const data = jsonData as string[][]
        const errors = validateExcelTransactionsData(data)
        if (errors.length > 0) {
          setExcelErrors(errors)
          setErrorModalIsVisible(true)
        } else {
          setExcelData(jsonData as string[][])
        }
      }
    }
    if (file) {
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <Container display='flex' justify='center' css={{ p: 0, width: '100%' }}>
      <Container css={{
        minWidth: '330px',
        width: '100%',
        maxWidth: '500px',
        p: 0
      }}
      >
        <Spacer y={1.5} />
        <CustomButton onPress={() => { generateExcel(transactionsTemplateData) }}>Download Excel template</CustomButton>
        <Spacer y={0.5} />
        <label className={styles.inputFileButton} htmlFor='input-file'>
          Upload Excel
        </label>
        <input
          id='input-file'
          className={styles.inputFile}
          type='file'
          onChange={handleFileUpload}
          accept='.xlsx, .xls'
        />
        {excelData && (
          <div>
            <p>Contenido del Excel:</p>
            {excelData.map((row, index) => (
              <p key={index}>{row.join(', ')}</p>
            ))}
          </div>
        )}
      </Container>
      <ErrorModal
        isVisible={errorModalIsVisible}
        onHide={() => setErrorModalIsVisible(false)}
        onPress={() => { handleOkErrorButton() }}
        details={excelErrors?.join('\n')}
      />
    </Container>
  )
}

export default SendBatch
