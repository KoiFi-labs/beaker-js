import styles from '../../styles/Home.module.css'
import { usePera } from '../../src/contexts/usePera'

export default function Home() {
    const {accountAddress, isConnectedToPeraWallet} = usePera()
    return (
        <div className={styles.container}>
        <main className={styles.main}>

            <h1 className={styles.title}>
                KoiFi Protocol
            </h1>

            <p className={styles.description}>
            Swap on the leading decentralized crypto trading protocol. 
            </p>
            <code className={styles.code}>Hello KoiFi</code>

            <p className={styles.description}>
                {isConnectedToPeraWallet ? `Connected to the wallet: ${accountAddress}` : null}
            </p>
        </main>
        </div>
    )
}
