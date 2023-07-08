import { Asset, config } from '../../config'
import { useWallet } from '../../src/contexts/useWallet'
import { Balance } from '../../src/services/algoService'
import { useEffect, useState } from 'react'
import AssetsTable from '../../src/components/modules/Tables/AssetsTable'
import ResumeCard from '../../src/components/modules/Cards/ResumeCard'
import { Container, Spacer } from '@nextui-org/react'

const assets = config.assetList

type TableItemType = Asset & {
  balance: number
}

const defaultAssetItem = {
  id: 0,
  name: '',
  icon: '',
  symbol: '',
  balance: 0,
  decimals: 6
}

export default function Home () {
  const { balances }: { balances: Balance[]} = useWallet()
  const [assetsTableItems, setAssetsTableItems] = useState<TableItemType[]>([defaultAssetItem])

  useEffect(() => {
    const assetsWithBalance = assets.map(asset => {
      const balance = balances.find(a => a.assetId === asset.id)?.amount || 0
      return { ...asset, balance }
    })
    setAssetsTableItems(assetsWithBalance)
  }, [balances])

  return (
    <Container css={{ p: '16px', width: '100%', d: 'flex' }}>
      <ResumeCard />
      <Spacer y={2} />
      <AssetsTable items={assetsTableItems} />
    </Container>
  )
}
