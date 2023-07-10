import React from 'react'
import { Text, Card, Grid, Container } from '@nextui-org/react'
import { LightInputXs } from '../LightInput/LightInput'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'

export type AddressInputProps = {
    input: {
      value: string
      bindings: {
        value: string;
        onChange: (event: BindingsChangeTarget) => void;
      }
    },
}

const AddressInput = ({ input }: AddressInputProps) => {
  const onChange = input.bindings.onChange
  return (
    <Card css={{ p: '16px', bgColor: '$kondorBlueCard' }}>
      <Grid.Container justify='center'>
        <Grid xs={12} css={{ d: 'flex', flexDirection: 'column' }}>
          <Container display='flex' justify='flex-start' css={{ p: 0 }}>
            <Text css={{ color: '$kondorGray' }}>
              To
            </Text>
          </Container>
          <LightInputXs
            aria-label='Asset receiver'
            onChange={onChange}
            value={input.value}
            placeholder='Algorand address'
          />
        </Grid>
      </Grid.Container>
    </Card>
  )
}

export default AddressInput
