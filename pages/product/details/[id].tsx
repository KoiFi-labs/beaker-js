import { Text, Container, Row, Col, Tooltip, Card, Input, Grid, Button, Spacer, Modal} from "@nextui-org/react"
import { useRouter } from "next/router"
import { getMyProductById } from "../../../src/services/productService"
import { IconButton } from "../../../src/components/IconButton/IconButton"
import { InfoIcon } from "../../../public/icons/InfoIcon";
import { useState } from "react";
import Link from "next/link"
import ConfirmModal from "../../../src/components/modules/Modals/ConfirmModal";
import SuccessfulTransactionModal from "../../../src/components/modules/Modals/SuccessfulTransactionModal";


  
export default function Details() {
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [successfulTransactionModalVisible, setSuccessfulTransactionModalVisible] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query
  const product = getMyProductById(id as string)

  const handleRemoveButton = () => {

  }

  const handleAddButton = () => {

  }

  return (
    <Container display="flex" justify="center" alignContent="flex-start"  css={{minHeight: "85vh", p: "16px"}}>
      <Card css={{p: "8px", maxWidth: "500px", minHeight: "200px"}}>
        <Container display="flex" justify="space-between" css={{p:0}}>
          <Text size={20} css={{color: "$kondorLight"}}>{product?.pools.map(p => p.namePool).join(" / ")} Product</Text> 
          <Tooltip content="Details">
            <IconButton>
              <InfoIcon size={20} fill="#979797" />
            </IconButton>
          </Tooltip>
        </Container>
        <Container css={{p:0}} display="flex" justify="space-between">
          <Text size={16} css={{color: "$kondorGray"}}>Total value looked</Text>
          <Text>{product?.total}</Text>
        </Container>
        {
          product?.pools.map((pool, index) => {
            return (
              <Container key={index} css={{p:0}} display="flex" justify="space-between">
                <Text size={16} css={{color: "$kondorGray"}}>{pool.namePool} pool</Text>
                <Text>{pool.amount}</Text>
              </Container>
            )
          })
        }
        <Spacer/>
        <Link href={"/product/addLiquidity/" + product?.id} legacyBehavior>
          <a onClick={() => {}}>
          <Button
            css={{backgroundColor: "$kondorPrimary", minWidth: "136px", width: "100%", m: "4px" }}
            onClick={() => {}}>
              Add liquidity
          </Button>
          </a>
        </Link>
      </Card>
    </Container>
  );
}
