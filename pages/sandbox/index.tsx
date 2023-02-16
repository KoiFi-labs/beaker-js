import { Button, Spacer, Text, Badge, Container } from '@nextui-org/react'
import React, { useState } from 'react'
import AccountCreatedModal from '../../src/components/modules/Modals/AccountCreatedModal'
import { useSandbox } from '../../src/contexts/useSandbox'
import { algoService } from '../../src/services/algoService'

export default function Sandbox () {
  const [sandboxStatus, setSanboxStatus] = useState('disconnected')
  const [account, setAccount] = useState('')
  const [seed, setSeed] = useState([])
  const [accountCreatedModalVisible, setAccountCreatedModalVisible] = useState<boolean>(false)
  const { sandboxAccountAddress } = useSandbox()

  const handlerCreateWallet = (): void => {
    createAccount()
    setAccountCreatedModalVisible(true)
  }

  const verifySanboxStatus = async () => {
    try {
      await algoService.healthCheck()
      setSanboxStatus('success')
    } catch (error) {
      setSanboxStatus('error')
    }
  }

  verifySanboxStatus()

  const isConnected = () => {
    return sandboxStatus === 'success'
  }

  const createAccount = function () {
    try {
      const myaccount = algoService.generateAccount()
      console.log('Account Address = ' + myaccount.addr)
      setAccount(myaccount.addr)
      const accountMnemonic = algoService.secretKeyToMnemonic(myaccount.sk)
      console.log('Account Mnemonic = ' + accountMnemonic)
      setSeed(accountMnemonic.split(' ') as unknown as never[])
      return myaccount
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <Container>
      <Text h1 color='#ff4ecd'> Welcome to the Sandbox! </Text>
      <Button onPress={() => verifySanboxStatus()}>Verify sandbox connection status</Button>
      <Spacer />

      <Text>Sandbox connection status:
        {isConnected()
          ? <Badge color='secondary'>{sandboxStatus}</Badge>
          : <Badge color='error'>{sandboxStatus}</Badge>}
      </Text>
      <Spacer />

      <Button onPress={handlerCreateWallet}>Create account</Button>
      <AccountCreatedModal isVisible={accountCreatedModalVisible} account={account} seed={seed} onHide={() => {}} />

      {
                sandboxAccountAddress?.length
                  ? (
                    <Container fluid justify='center' display='flex'>
                      <Text h4 color='secondary'>Connected to: {sandboxAccountAddress}</Text>
                    </Container>)
                  : null
            }

    </Container>
  )
}
