import { Text, Container, Row, Col, Tooltip, Card, Input, Grid, Button, Spacer, Modal} from '@nextui-org/react'
import { useRouter } from 'next/router'
import { getPoolById } from '../../../src/services/poolService'
import { IconButton } from '../../../src/components/IconButton/IconButton'
import { InfoIcon } from "../../../public/icons/InfoIcon";
import { ClipboardIcon } from '../../../public/icons/clipboard';
import { useState } from 'react';
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal';
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal';
import { copyToClipboard, abbreviateTransactionHash } from '../../../src/utils/utils';


  
export default function AddLiquidity() {
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [successfulTransactionModalVisible, setSuccessfulTransactionModalVisible] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query
  const pool = getPoolById(id as string)

  const handleConfirmButton = () => {
    setSuccessfulTransactionModalVisible(true)
  }

  return (
    <Container display="flex" justify='center' alignContent="flex-start"  css={{minHeight: "85vh", p: "16px"}}>
      <Card css={{p: "8px", maxWidth: "500px", minHeight: "200px"}}>
        <Container display='flex' justify='space-between' css={{p:0}}>
          <Text size={20} css={{color: "$kondorLight"}}>Add liquidity {pool?.pool} Pool</Text> 
          <Tooltip content="Details">
            <IconButton>
              <InfoIcon size={20} fill="#979797" />
            </IconButton>
          </Tooltip>
        </Container>
        <Card css={{ $$cardColor: '$colors$gray100', m: "8px 0", p: "8px" }}>
          <Grid.Container>
            <Grid xs={10}>
              <Input label="Amount" underlined placeholder='0.00' css={{width: "100%"}} />
            </Grid>
            <Grid xs={2} css={{display:'flex', alignItems:'end', padding: '0 8px'}}>
              <Text size={16}>{pool?.pool}</Text>
            </Grid>
          </Grid.Container>
          <Text size={16}>Balance 51300.4521 {pool?.pool}</Text>

        </Card>
        <Container css={{p:"24px 0"}} display='flex' justify='space-between'>
          <Text size={16} css={{color: "$kondorGray"}}>Output is estimated. If the price changes by more than 0.5% your transaction will revert.</Text>
        </Container>
        <Container css={{p:0}} display='flex' justify='space-between'>
          <Text size={16} css={{color: "$kondorGray"}}>{pool?.pool} to be added</Text>
          <Text>500 {pool?.pool}</Text>
        </Container>
        <Container css={{p:0}} display='flex' justify='space-between'>
          <Text size={16} css={{color: "$kondorGray"}}>Total value</Text>
          <Text>≈ $500</Text>
        </Container>
        <Container css={{p:0}} display='flex' justify='space-between'>
          <Text size={16} css={{color: "$kondorGray"}}>Share of pool</Text>
          <Text>0.01%</Text>
        </Container>
        <Container css={{p:0}} display='flex' justify='space-between'>
          <Text size={16} css={{color: "$kondorGray"}}>You will receive a minimun of</Text>
          <Text>15400 {pool?.pool} KONDOR TOKEN</Text>
        </Container>
        <Spacer/>
        <Button css={{backgroundColor: "$kondorPrimary"}} onPress={() => {setConfirmModalVisible(true)}}>
            Add liquidity
        </Button>
      </Card>
      <ConfirmModal 
        isVisible={confirmModalVisible} 
        onHide={() => setConfirmModalVisible(false)}
        onPress={handleConfirmButton} 
        title="Confirm add liquidity" 
        >
        <>
          <Container css={{p:0}} display='flex' justify='space-between'>
            <Text size={16} css={{color: "$kondorGray"}}>{pool?.pool} to be added</Text>
            <Text>500 {pool?.pool}</Text>
          </Container>
          <Container css={{p:0}} display='flex' justify='space-between'>
            <Text size={16} css={{color: "$kondorGray"}}>Total value</Text>
            <Text>≈ $500</Text>
          </Container>
          <Container css={{p:0}} display='flex' justify='space-between'>
            <Text size={16} css={{color: "$kondorGray"}}>Share of pool</Text>
            <Text>0.01%</Text>
          </Container>
          <Container css={{p:0}} display='flex' justify='space-between'>
            <Text size={16} css={{color: "$kondorGray"}}>You will receive a minimun of</Text>
            <Text>15400 {pool?.pool} KONDOR TOKEN</Text>
          </Container>
        </>
      </ConfirmModal>
      <SuccessfulTransactionModal 
        isVisible={successfulTransactionModalVisible} 
        onHide={() => setSuccessfulTransactionModalVisible(false)}
        onPress={() => {}} 
        >
          <>
          <Container display='flex' justify='flex-start' alignItems="center"  css={{padding: "8px"}}>
            <IconButton onClick={() => copyToClipboard("DSWX3GJBH3665JK3HI55NRM5R4UKCWDWGBHU6D2MHYJX5RVWEOSA")}><ClipboardIcon/></IconButton>
            <Text>Transaction ID: {abbreviateTransactionHash("DSWX3GJBH3665JK3HI55NRM5R4UKCWDWGBHU6D2MHYJX5RVWEOSA")}</Text>
          </Container>
          </>
      </SuccessfulTransactionModal>
    </Container>
  );
}
