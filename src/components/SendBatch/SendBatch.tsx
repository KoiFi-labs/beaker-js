/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Container, Spacer, Text, Loading, Grid, Collapse } from '@nextui-org/react'
import { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import styles from './SendBatch.module.css'
import { generateExcel } from '../../utils/excel'
import { transactionsTemplateData } from './transactionsTemplate'
import { validateExcelTransactionsData } from './validator'
import ErrorCard from '../modules/Cards/ErrorCard/ErrorCard'
import SuccessfulCard from '../modules/Cards/SuccessfulCard/SuccessfulCard'
import { AiOutlineCloseCircle, AiOutlineCloudDownload, AiOutlineCloudUpload } from 'react-icons/ai'
import { IconButton } from '../IconButton/IconButton'
import { useWallet } from '../../contexts/useWallet'
import { DynamicButton } from '../DynamicButton/DynamicButton'
import { createTransactionsBatch } from '../../services/transactionsBatchService'
import { TransactionsBatchStatus } from '../../../interfaces'
import { useRouter } from 'next/router'

enum Step {
  WALLET_CONNECT_NEEDED,
  UPLOAD_EXCEL,
  EXCEL_WITH_ERRORS,
  READY
}

const SendBatch = () => {
  const [step, setStep] = useState<Step>(Step.WALLET_CONNECT_NEEDED)
  const [excelData, setExcelData] = useState<string[][] | null>(null)
  const [excelErrors, setExcelErrors] = useState<string[] | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { balances, connectWallet, isConnected, account } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (excelData && excelData.length > 0) {
      setLoading(true)
      validateExcelTransactionsData(excelData, balances)
        .then(errors => {
          setExcelErrors(errors)
          setLoading(false)
          updateStep(excelData, errors)
        })
    } else {
      setExcelErrors([])
      updateStep(excelData, excelErrors)
    }
  }, [excelData, isConnected])

  const updateStep = (data: string[][] | null, errors: string[] | null) => {
    if (!isConnected) return setStep(Step.WALLET_CONNECT_NEEDED)
    if (!data || data[0].length === 0) return setStep(Step.UPLOAD_EXCEL)
    console.log('errors:', errors)
    if (errors && errors.length > 0) return setStep(Step.EXCEL_WITH_ERRORS)
    if (data.length > 1 && errors && errors.length === 0) return setStep(Step.READY)
  }

  const clearExcelData = () => {
    setExcelData([[]])
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const buttonOptions = [
    {
      text: 'Connect your wallet',
      onPress: () => { connectWallet() }
    },
    {
      text: 'Excel required',
      disabled: true
    },
    {
      text: 'Excel with errors',
      disabled: true
    },
    {
      text: 'Next',
      onPress: () => { handleNextButton() }
    }
  ]

  const handleNextButton = async () => {
    try {
      if (!excelData) throw new Error('Invalid data')
      setLoading(true)
      const transactionBatch = await createTransactionsBatch({
        data: excelData.splice(1),
        status: TransactionsBatchStatus.PENDING,
        sender: account.addr
      })
      router.push(`/send/batch/${transactionBatch.id}`)
    } catch (e) {
      setLoading(false)
      console.log('Error creating transactions batch: ', e)
    }
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
    if (loading) return <Container css={{ p: 0, width: '100%', d: 'flex', justifyContent: 'center' }}><Loading /></Container>
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
        <SuccessfulCard title='Excel preprocessed successfully' details={`${excelData?.length! - 1} transactions are ready to be sent`} />
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
        <Grid.Container justify='space-between'>
          <Grid xs={5.75}>
            <label className={styles.inputFileLabel} htmlFor='input-file'>
              <AiOutlineCloudUpload size={50} />
              Upload excel
            </label>
          </Grid>
          <Grid xs={5.75}>
            <button className={styles.inputFileButton} onClick={() => { generateExcel(transactionsTemplateData) }}>
              <AiOutlineCloudDownload size={50} />
              Download template
            </button>
          </Grid>
        </Grid.Container>
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
        <Spacer />
        <DynamicButton items={buttonOptions} index={step} disabled={loading} />
      </Container>
    </Container>
  )
}

export default SendBatch
