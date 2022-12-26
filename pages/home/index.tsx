import styles from '../../styles/Home.module.css'
import { Container, Spacer, Text } from '@nextui-org/react'
import { usePera } from '../../src/contexts/usePera';
import { useMyAlgo } from '../../src/contexts/useMyAlgo';


export default function Home() {
    const {isConnectedToMyAlgoWallet, myAlgoAccountAddress } = useMyAlgo()
    const {isConnectedToPeraWallet, peraAccountAddress} = usePera()

    const showWallet = () => {
        if(isConnectedToMyAlgoWallet){
            return (<Text h3 color="primary">Connected to MyAlgoWallet: {myAlgoAccountAddress}</Text>)
        }
        if(isConnectedToPeraWallet){
            return (<Text h3 color="primary">Connected to PeraWallet: {peraAccountAddress}</Text>)
        }
        return (<Text h3 color="error">Connect your wallet!</Text>)
    }

    return (
        <div className={styles.container}>
        <main className={styles.main}>

            <Text h1 color="#ff4ecd"> KoiFi Protocol </Text>

            <Text> Swap on the leading decentralized crypto trading protocol. </Text>
            <Spacer/>
            <code className={styles.code}>Hello KoiFi</code>
            <Spacer/>
            {showWallet()}

        </main>
        </div>
    )
}
