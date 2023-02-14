import { Table, Text, Container, Row, Col, Tooltip, Button} from "@nextui-org/react"
import React from "react";
import { IconButton } from "../../src/components/IconButton/IconButton"
import { PlusCircleIcon } from "../../public/icons/PlusCircleIcon";
import { DeleteIcon } from "../../public/icons/DeleteIcon";
import { ChartIcon } from "../../public/icons/ChartIcon";
import Link from "next/link"
import { getMyProducts, MyProductType } from "../../src/services/productService"
import { LinkButton } from "../../src/components/LinkButton/LinkButton";

  
export default function MyProducts() {

const myProducts: MyProductType[] = getMyProducts();

const columns = [
    { name: "POOLS", uid: "pools" },
    { name: "MY STAKE", uid: "total" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (myProduct: MyProductType, columnKey: React.Key) => {
    const cellValue = myProduct[columnKey as keyof MyProductType];
    switch (columnKey) {
      case "pools":
      case "total":
        return (
        <Text b size={14} css={{ tt: "capitalize" }}>
          {Array.isArray(cellValue) ? cellValue.map(p => p.namePool).join(" / "): cellValue}
        </Text>)

      case "actions":
        return (
                <Row justify="center" align="center">
                  <Col css={{ d: "flex" }}>
                    <Link href={"/product/details/" + myProduct.id} legacyBehavior>
                      <a onClick={() => {}}>
                        <Tooltip content="Details">
                          <IconButton>
                            <ChartIcon size={20} fill="#979797" />
                          </IconButton>
                        </Tooltip>
                      </a>
                    </Link>
                  </Col>
                  <Col css={{ d: "flex" }}>
                  <Link href={"/pool/addLiquidity/" + myProduct.id} legacyBehavior>
                    <a onClick={() => {}}>
                      <Tooltip content="Add liquidity">
                        <IconButton>
                          <PlusCircleIcon size={20} fill="#979797" />
                        </IconButton>
                      </Tooltip>
                    </a>
                    </Link>
                  </Col>
                  <Col css={{ d: "flex" }}>
                  <Link href={"/pool/removeLiquidity/" + myProduct.id} legacyBehavior>
                    <a onClick={() => {}}>
                      <Tooltip content="Remove liquidity">
                        <IconButton>
                          <DeleteIcon size={20} fill="#FF0080" />
                        </IconButton>
                      </Tooltip>
                    </a>
                    </Link>
                  </Col>
                </Row>
        );
    }
  };

  return (
    <Container css={{minHeight: "85vh", p:0}}>
        <Link href={"/product/create"}>
            <LinkButton>
              Create new product
            </LinkButton>
        </Link>
        <Table
        aria-label="Example table with custom cells"
        css={{
            height: "auto",
            minWidth: "100%",
            backdropFilter: "blur(4px)",
            m: "16px 0",
            borderRadius: "16px",
        }}
        selectionMode="none"
        >
        <Table.Header columns={columns}>
            {(column) => (
            <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
            >
                {column.name}
            </Table.Column>
            )}
        </Table.Header>
        <Table.Body items={myProducts}>
            {(item: MyProductType) => (
            <Table.Row>
                {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
            </Table.Row>
            )}
        </Table.Body>
        </Table>
    </Container>
  );
}
