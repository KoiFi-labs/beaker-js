import { Button,  Spacer, Text, Container, Card, Grid, Input, Image, useInput, Loading, Modal, Divider} from '@nextui-org/react'
import { Asset } from '../../config/Assets'
import { config } from '../../config'
import AssetSelect from '../../src/components/AssetSelect/AssetSelect'
import { useEffect, useState } from 'react'
import { useWallet } from '../../src/contexts/useWallet'
import { Balance } from '../../src/services/algoService'
import { microToStandard } from '../../src/utils/math'
import { swap, getSwapResult } from '../../src/services/kondorServices/pondServise'
import { abbreviateTransactionHash, copyToClipboard } from '../../src/utils/utils'
import { ClipboardIcon } from '../../public/icons/clipboard'
import { DownArrowAltIcon } from '../../public/icons/down-arrow-alt'
import { IconButton } from '../../src/components/IconButton/IconButton'

export default function Swap() {
    const [ assetToSell, setAssetToSell ] = useState<Asset>(config.assetList[0])
    const [ assetToBuy, setAssetToBuy ] = useState<Asset>(config.assetList[1])
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ swapResultModalVisible, setSwapResultModalVisible ] = useState<boolean>(false)
    const [ balanceToSell, setBalanceToSell ] = useState<number>(0)
    const [ balanceToBuy, setBalanceToBuy ] = useState<number>(0)
    const [ amountToSell, setAmountToSell ] = useState<number>(0)
    const [ swapTransactionId, setSwapTransactionId ] = useState<string>("")
    const [ swapResult, setSwapResult ] = useState<number>(0)
    const { isConnected, balances, account, reloadBalances } = useWallet()
    const fromInput = useInput("0");
    const toInput = useInput("");


    useEffect(() => {
        const amount = Number(fromInput.value)
        if(amount > 0){
            setAmountToSell(amount)
            getSwapResult(amount, assetToSell.id, assetToBuy.id).then(
                (result: number) => {
                    toInput.setValue(result.toFixed(4).toString())
                }
            )
        }else{
            setAmountToSell(0)
            toInput.setValue("")
        }
    }, [fromInput.value, assetToSell, assetToBuy])

    const handleSellAssetSelect = (asset: Asset) => asset ===  assetToBuy ? 
        (setAssetToBuy(assetToSell), setAssetToSell(asset)) : 
        setAssetToSell(asset)

    const handleBuyAssetSelect = (asset: Asset) => asset === assetToSell ? 
        (setAssetToSell(assetToBuy), setAssetToBuy(asset)) : 
        setAssetToBuy(asset)

    const handleCentralButton = () => {
        const assetToBuyTemp: Asset = assetToBuy
        setAssetToBuy(assetToSell)
        setAssetToSell(assetToBuyTemp)
    }

    const openResultModal = (txId: string) => {
        setSwapTransactionId(txId)
        setSwapResultModalVisible(true)
    }

    const closeModalHandler = () => {
        setSwapResultModalVisible(false);
      };



    const handleSwap = async () => {
        if(fromInput.value !== ""){
            const amount = Number(fromInput.value)
            if(amount > 0){
                setLoading(true)
                try{
                    const result = await swap(account.addr, account.sk, amountToSell, assetToSell.id, assetToBuy.id)
                    setLoading(false)
                    if(result){
                        fromInput.setValue("")
                        toInput.setValue("")
                        reloadBalances()
                        openResultModal(result.txId)
                    }
                }
                catch(e){
                    setLoading(false)
                    console.log(e)
                }
            }
        }
    }


    useEffect(() => {
        if(isConnected){
            setBalanceToSell(0)
            setBalanceToBuy(0)
            balances.forEach((b: Balance) => {
                if(b.assetId === assetToSell.id) setBalanceToSell(microToStandard(b.amount))
                if(b.assetId === assetToBuy.id) setBalanceToBuy(microToStandard(b.amount))
            })
        }else{
            setBalanceToSell(0)
            setBalanceToBuy(0)
        }
    }, [assetToSell, assetToBuy, isConnected, balances])

    return (
        <Container fluid display='flex' justify='center' alignItems='center' css={{minHeight: "85vh"}}>
            <Card css={{ mw: "330px", maxWidth: "500px"}}>
                <Card.Header>
                    <Text b>Swap</Text>
                </Card.Header>
                <Container display='flex' justify='center' css={{padding:"10px"}}>
                    <Card css={{ $$cardColor: '$colors$gray100' }}>
                        <Card.Body>
                        <Grid.Container justify="center" css={{padding: "10px 0 0 0"}}>
                            <Grid xs={8}>
                                <Input {...fromInput.bindings} label="From" underlined placeholder='0.00' />
                            </Grid>
                            <Grid xs={4}>
                               <AssetSelect asset={assetToSell} onPress={handleSellAssetSelect} />
                            </Grid>
                            <Container display='flex' justify='flex-start' css={{padding:0}}>
                                <Text size={14} css={{color: "$kondorGray"}}>Balance {balanceToSell.toFixed(4)} {assetToSell.symbol}</Text>                                
                            </Container>
                        </Grid.Container>
                        </Card.Body>
                    </Card>
                    <Button
                        onPress={() => {handleCentralButton()}}
                        css={{
                            margin:"20px", 
                            borderRadius: "50%", 
                            width: '40px', 
                            height: '40px', 
                            minWidth: "0px",
                            backgroundColor: "$kondorPrimary",
                            }}>
                         <DownArrowAltIcon fill="#454545"/>   
                    </Button>
                    <Card css={{ $$cardColor: '$colors$gray100' }}>
                        <Card.Body>
                        <Grid.Container justify="center" css={{padding: "10px 0 0 0"}}>
                            <Grid xs={8}>
                                <Input {...toInput.bindings} label="To" underlined placeholder='0.00' />
                            </Grid>
                            <Grid xs={4}>
                                <AssetSelect asset={assetToBuy} onPress={handleBuyAssetSelect}/>
                            </Grid>
                            <Container display='flex' justify='flex-start' css={{padding:0}}>
                                <Text size={14} css={{color: "$kondorGray"}}>Balance {balanceToBuy.toFixed(4)} {assetToBuy.symbol}</Text>                                
                            </Container>
                        </Grid.Container>
                        </Card.Body>
                    </Card>
                    <Spacer/>
                    {
                        !isConnected 
                        ? <Button disabled size="xl" css={{width:"100%", background: "$kondorPrimary"}}>Connect your wallet</Button> 
                        : loading 
                            ? <Button disabled size="xl" css={{width:"100%"}} onPress={() => handleSwap()}><Loading css={{color: "$kondorGray"}}/></Button>
                            : <Button size="xl" css={{width:"100%", background: "$kondorPrimary"}} onPress={() => handleSwap()}>Swap</Button>
                        }
                </Container>
                </Card>
                <Modal open={swapResultModalVisible} closeButton onClose={closeModalHandler}>
                    <Modal.Header>
                        <Text size="$xl" color="$primary">Swap completed</Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Swap completed successfully</Text>
                        <Divider/>
                        <Spacer y={0.1}/>
                        <Container display='flex' justify='flex-start' alignItems="center"  css={{padding: 0}}>
                            <IconButton onClick={() => copyToClipboard(swapTransactionId)}><ClipboardIcon/></IconButton>
                            <Text>Transaction ID: {abbreviateTransactionHash(swapTransactionId)}</Text>
                        </Container>
                    </Modal.Body>
                </Modal>
        </Container>
    )
}
