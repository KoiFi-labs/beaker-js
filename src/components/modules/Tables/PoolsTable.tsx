import { Table, Text, Row, Col, Tooltip } from '@nextui-org/react'
import React from 'react'
import { IconButton } from '../../IconButton/IconButton'
import { PlusCircleIcon } from '../../../../public/icons/PlusCircleIcon'
import Link from 'next/link'
import { PoolType } from '../../../services/stablePoolService'
import { useRouter } from 'next/router'

export default function PoolsTable ({ pools }: { pools: PoolType[] }) {
  const router = useRouter()
  const columns = [
    { name: 'POOL', uid: 'pool' },
    { name: 'VOLUME 24H', uid: 'volume' },
    { name: 'APR', uid: 'apr' },
    { name: 'TOTAL', uid: 'total' },
    { name: 'MYSTAKE', uid: 'myStake' },
    { name: 'ACTIONS', uid: 'actions' }
  ]

  const renderCell = (pool: PoolType, columnKey: React.Key) => {
    if (pool.myStake) {
      return renderItemWithPosition(pool, columnKey)
    }
    return renderItemWithoutPosition(pool, columnKey)
  }

  const renderItemWithoutPosition = (pool: PoolType, columnKey: React.Key) => {
    const cellValue = pool[columnKey as keyof PoolType]
    switch (columnKey) {
      case 'pool':
      case 'volume':
      case 'total':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {cellValue}
          </Text>
        )
      case 'apr':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {cellValue}%
          </Text>
        )
      case 'actions':
        return (
          <Row justify='center' align='center'>
            <Col css={{ d: 'flex' }}>
              <Link href={'/pool/addLiquidity/' + pool.id} legacyBehavior>
                <a onClick={() => {}}>
                  <Tooltip content='Add liquidity'>
                    <IconButton>
                      <PlusCircleIcon size={20} fill='#979797' />
                    </IconButton>
                  </Tooltip>
                </a>
              </Link>
            </Col>
          </Row>
        )
      default:
        return cellValue
    }
  }

  const renderItemWithPosition = (pool: PoolType, columnKey: React.Key) => {
    const cellValue = pool[columnKey as keyof PoolType]
    switch (columnKey) {
      case 'apr':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {cellValue}%
          </Text>
        )
      case 'myStake':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {cellValue} {pool.pool}
          </Text>
        )
      case 'total':
      case 'pool':
      case 'volume':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {cellValue}
          </Text>
        )

      case 'actions':
        return (
          <Row justify='center' align='center'>
            <Col css={{ d: 'flex' }}>
              <Link href={'/pool/addLiquidity/' + pool.id} legacyBehavior>
                <a onClick={() => {}}>
                  <Tooltip content='Add liquidity'>
                    <IconButton>
                      <PlusCircleIcon size={20} fill='#979797' />
                    </IconButton>
                  </Tooltip>
                </a>
              </Link>
            </Col>
          </Row>
        )
      default:
        return cellValue
    }
  }

  return (
    <Table
      selectionMode='single'
      aria-label='Example table with custom cells'
      css={{
        height: 'auto',
        minWidth: '100%',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);',
        m: '16px 0',
        borderRadius: '16px'
      }}
      onSelectionChange={(key: Object) => { router.push(`pool/${Object.values(key)[0]}`) }}
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.uid}
            hideHeader={column.uid === 'actions'}
            align={column.uid === 'actions' ? 'center' : 'start'}
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
  )
}
