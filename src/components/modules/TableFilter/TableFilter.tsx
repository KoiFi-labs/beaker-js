import { Container, Text, Collapse } from '@nextui-org/react'
import React from 'react'

export default function TableFilter () {
  return (
    <Collapse.Group css={{ width: '100%', p: 0 }}>
      <Collapse title='Filters'>
        <Container css={{ bgColor: '$kondorBlueCard', p: '16px', d: 'flex', justifyContent: 'flex-start', borderRadius: '16px' }}>
          <Container css={{ p: 0, maxWidth: '180px', d: 'flex', m: 0 }}>
            <Container css={{ p: 0 }}>
              <Text css={{ color: '$kondorTextLight' }}>Tag</Text>
            </Container>
            <select id='tag-select'>
              <option value='' id='default'>Choose a tag</option>
              <option value='dog'>payment</option>
              <option value='cat'>salary</option>
              <option value='hamster'>bill</option>
            </select>
          </Container>
          <Container css={{ p: 0, maxWidth: '180px', d: 'flex', m: 0 }}>
            <Container css={{ p: 0 }}>
              <Text css={{ color: '$kondorTextLight' }}>Transaction type</Text>
            </Container>
            <select id='tag-select'>
              <option value='' id='default'>Choose a type</option>
              <option value='dog'>payment</option>
              <option value='cat'>salary</option>
              <option value='hamster'>bill</option>
            </select>
          </Container>
        </Container>
      </Collapse>
    </Collapse.Group>
  )
}
