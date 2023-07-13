/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Container, Grid, Progress, Spacer, Text } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { TransactionPreview } from '../../../../interfaces'
import { getTransactionsBatchById, updateTransactionsBatch } from '../../../../src/services/transactionsBatchService'
import TransactionsPreviewTable from '../../../../src/components/modules/Tables/TransactionsPreviewTable'
import { parseTransactionPreview } from '../../../../src/utils/excel'
import { CustomButton } from '../../../../src/components/CustomButton/CustomButton'
import { createTransactionsBatch } from '../../../../src/services/kondorServices/transactions'
import { useWallet } from '../../../../src/contexts/useWallet'
import { divideIntoBatches } from '../../../../src/utils/utils'
import { DynamicButton } from '../../../../src/components/DynamicButton/DynamicButton'

enum Step {
  IN_PROGRESS,
  FINISHED
}

export default function Batch () {
  const router = useRouter()
  const [transactions, setTransactions] = useState<TransactionPreview[]>([])
  const [processed, setProcessed] = useState<number>(0)
  const [currentBatch, setCurrenBatch] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<Step>(Step.IN_PROGRESS)
  const { account } = useWallet()

  useEffect(() => {
    if (router.query.id) {
      getTransactionsBatchById(router.query.id as string)
        .then(b => {
          setTransactions(parseTransactionPreview(b))
          setProcessed(b.processed)
        })
    }
  }, [router.query.id])

  const handleCancelButton = () => {
    router.push('/send')
  }

  const buttonOptions = [
    {
      text: 'Send batch',
      onPress: () => { handleConfirmButton(processed) }
    },
    {
      text: 'View transactions',
      onPress: () => { router.push('/history') }
    }
  ]

  const handleConfirmButton = async (processed: number) => {
    try {
      setLoading(true)
      const response = await createTransactionsBatch(account.addr, divideIntoBatches(transactions, 12)[currentBatch])
      setLoading(false)
      if (response.result?.txIDs && !response.error) {
        const newProcessedAmount = processed + response.result.txIDs.length
        updateTransactionsBatch(router.query.id as string, newProcessedAmount)
        setProcessed(processed + response.result.txIDs.length)
        if (newProcessedAmount < transactions.length) {
          setCurrenBatch(currentBatch + 1)
        } else {
          setStep(Step.FINISHED)
        }
      }
    } catch (e) {
      alert('Error processing batch')
    }
  }

  return (
    <Container css={{ p: '0', width: '100%' }}>
      <Text h1>Send transactions batch</Text>
      <Text>
        Please note that if your batch contains more than 12 transactions,
        it will be divided into multiple batches of 12. You will need to
        sign each batch of 12 transactions separately.
      </Text>
      <Spacer />
      <TransactionsPreviewTable items={transactions} />
      <Spacer y={2} />
      <Progress value={processed} min={0} max={transactions.length} color='success' shadow animated />
      <Spacer />
      <Container css={{ p: 0, d: 'flex', justifyContent: 'space-between' }}>
        <Text size={16} b color='success'>Processed</Text>
        <Text b color='success'>{processed}/{transactions.length}</Text>
      </Container>
      <Spacer />
      <Grid.Container justify='space-between'>
        <Grid sm={2} xs={6}>
          <CustomButton onPress={handleCancelButton}>Cancel</CustomButton>
        </Grid>
        <Grid sm={2} xs={6}>
          <DynamicButton items={buttonOptions} index={step} loading={loading} />
        </Grid>
      </Grid.Container>
    </Container>
  )
}
