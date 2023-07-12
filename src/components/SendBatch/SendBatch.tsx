/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Container, Spacer, Text } from '@nextui-org/react'
import { useEffect, useState, useRef } from 'react'
import { CustomButton } from '../CustomButton/CustomButton'
import * as XLSX from 'xlsx'
import styles from './SendBatch.module.css'
import { generateExcel } from '../../utils/excel'
import { transactionsTemplateData } from './transactionsTemplate'
import { validateExcelTransactionsData } from './utils'
import ErrorCard from '../modules/Cards/ErrorCard/ErrorCard'
import SuccessfulCard from '../modules/Cards/SuccessfulCard/SuccessfulCard'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IconButton } from '../IconButton/IconButton'

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
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (excelData) {
      const errors = validateExcelTransactionsData(excelData)
      setExcelErrors(errors)
    } else {
      setExcelErrors([])
    }
  }, [excelData])

  const clearExcelData = () => {
    setExcelData([[]])
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file?.name || '')
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      if (Array.isArray(jsonData)) {
        setExcelData((jsonData as string[][]).filter(ln => !(ln[0] === undefined && ln[1] === undefined && ln[2] === undefined && ln[3] === undefined)))
      }
    }
    if (file) {
      reader.readAsArrayBuffer(file)
    }
  }

  const getExcelPreprossedCard = () => {
    if (excelErrors?.length) {
      return (
        <>
          <ErrorCard title='Excel with errors' details={excelErrors.join('\n')} />
          <Spacer />
        </>
      )
    }
    if (excelData?.length && excelData.length > 1) {
      return (
        <>
          <SuccessfulCard title='Excel preprocessed successfully' details={`${excelData?.length! - 1} transactions are ready to be sent`} />
          <Spacer />
          <CustomButton>Send transactions</CustomButton>
        </>
      )
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
          ref={fileInputRef}
          accept='.xlsx, .xls'
        />
        <Spacer />
        {
          fileName
            ? (
              <>
                <Container css={{ p: 0, d: 'flex' }}>
                  <Text css={{ color: '$kondorTextLight' }}>{fileName}</Text>
                  <Spacer x={0.2} />
                  <IconButton onClick={() => { clearExcelData() }}><AiOutlineCloseCircle /></IconButton>
                </Container>
                <Spacer y={0.5} />
              </>
              )
            : null
        }
        {getExcelPreprossedCard()}
      </Container>
    </Container>
  )
}

export default SendBatch
