import styles from '../../styles/Home.module.css'
import { Container, Spacer, Text } from '@nextui-org/react'
import { useWallet } from '../../src/contexts/useWallet';


export default function Home() {
    const {isConnected, account, walletProvider } = useWallet()

    const showWallet = () => {
        if(isConnected){
            return (<Text h3 color="primary">Connected to {walletProvider}: {account.addr}</Text>)
        }
        return (<Text h3 color="error">Connect your wallet!</Text>)
    }

    return (
        <div className={styles.container}>
        <main className={styles.main}>

            <Text h1 color="#ff4ecd"> Kondor Protocol </Text>

            <Text> Swap on the leading decentralized crypto trading protocol. </Text>
            <Spacer/>
            <code className={styles.code}>Hello Kondor</code>
            <Spacer/>
            {showWallet()}

        </main>
        </div>
    )
}
