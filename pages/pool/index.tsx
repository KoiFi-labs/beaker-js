import { Table, Text, Container, Row, Col, Tooltip} from '@nextui-org/react'
import React from 'react';
import { IconButton } from '../../src/components/IconButton/IconButton'
import { PlusCircleIcon } from "../../public/icons/PlusCircleIcon";
import { ChartIcon } from '../../public/icons/ChartIcon';
import Link from 'next/link'
import { getPools, PoolType } from '../../src/services/poolService'

  
export default function Pool() {

const pools: PoolType[] = getPools();

const columns = [
    { name: "POOL", uid: "pool" },
    { name: "VOLUME 24H", uid: "volume" },
    { name: "TOTAL", uid: "total" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (pool: PoolType, columnKey: React.Key) => {
    const cellValue = pool[columnKey as keyof PoolType];
    switch (columnKey) {
      case "pool":
      case "volume":
      case "total":
        return (
          <Text b size={14} css={{ tt: "capitalize" }}>
            {cellValue}
            </Text>
        );

      case "actions":
        return (
                <Row justify="center" align="center">
                  <Col css={{ d: "flex" }}>
                  <Link href={"/pool/details/" + pool.id}>
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
                  <Link href={"/pool/addLiquidity/" + pool.id}>
                    <a onClick={() => {}}>
                      <Tooltip content="Add liquidity">
                        <IconButton>
                          <PlusCircleIcon size={20} fill="#979797" />
                        </IconButton>
                      </Tooltip>
                    </a>
                    </Link>
                  </Col>
                </Row>
        );
      default:
        return cellValue;
    }
  };

  return (
    <Container css={{minHeight: "85vh", padding: "0"}}>
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
        <Table.Body items={pools}>
            {(item: PoolType) => (
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
