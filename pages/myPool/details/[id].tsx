import { Text, Container, Row, Col, Tooltip, Card, Input, Grid, Button, Spacer, Modal} from "@nextui-org/react"
import { useRouter } from "next/router"
import { getPoolById } from "../../../src/services/poolService"
import { IconButton } from "../../../src/components/IconButton/IconButton"
import { LinkButton } from "../../../src/components/LinkButton/LinkButton"
import { InfoIcon } from "../../../public/icons/InfoIcon";
import { useState, forwardRef } from "react";
import ConfirmModal from "../../../src/components/modules/Modals/ConfirmModal";
import SuccessfulTransactionModal from "../../../src/components/modules/Modals/SuccessfulTransactionModal";
import Link from "next/link";
import { PlusCircleIcon } from "../../../public/icons/PlusCircleIcon";


  
export default function Details() {
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [successfulTransactionModalVisible, setSuccessfulTransactionModalVisible] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query
  const pool = getPoolById(id as string)

  const handleRemoveButton = () => {

  }

  const handleCancelButton = () => {

  }

  return (
    <Container display="flex" justify="center" alignContent="flex-start"  css={{minHeight: "85vh", p: "16px"}}>
      <Card css={{p: "8px", maxWidth: "500px", minHeight: "200px"}}>
        <Container display="flex" justify="space-between" css={{p:0}}>
          <Text size={20} css={{color: "$kondorLight"}}>My {pool?.pool} Pool</Text> 
          <Tooltip content="Details">
            <IconButton>
              <InfoIcon size={20} fill="#979797" />
            </IconButton>
          </Tooltip>
        </Container>
        <Container css={{p:0}} display="flex" justify="space-between">
          <Text size={16} css={{color: "$kondorGray"}}>Amount</Text>
          <Text>4500 {pool?.pool} KONDOR TOKEN</Text>
        </Container>
        <Container css={{p:0}} display="flex" justify="space-between">
          <Text size={16} css={{color: "$kondorGray"}}>Share of pool</Text>
          <Text>0.003%</Text>
        </Container>
        <Container css={{p:0}} display="flex" justify="space-between">
          <Text size={16} css={{color: "$kondorGray"}}>Value</Text>
          <Text>≈ $500</Text>
        </Container>
        <Spacer/>
        <Grid.Container>
          <Grid xs={6}>
            <Container css={{p:"0px 4px 0px 0px", m:0}}>
              <Link href={"/pool/removeLiquidity/" + pool?.id} >
                <LinkButton>
                  Remove
                </LinkButton>
              </Link>
            </Container>
          </Grid>
          <Grid xs={6}>
            <Container css={{p:"0px 0px 0px 4px"}}>
              <Link href={"/pool/addLiquidity/" + pool?.id}>
                <LinkButton>
                  Add
                </LinkButton>
              </Link>
            </Container>
          </Grid>
        </Grid.Container>
      </Card>
    </Container>
  );
}
