import React, { useState } from 'react'
import { Text, Card, Grid, Container } from '@nextui-org/react'
import { LightInputSm } from '../LightInput/LightInput'
import { IconButton } from '../IconButton/IconButton'
import { BiXCircle } from 'react-icons/bi'

export type TagsInputProps = {
    tags: string[],
    selectedTags: (tags: string[]) => void
}

const TagsInput = ({ tags, selectedTags }: TagsInputProps) => {
  const [_tags, setTags] = useState<string[]>(['salary'])
  const removeTags = (indexToRemove: number) => {
    setTags([..._tags.filter((_, index) => index !== indexToRemove)])
  }

  const addTags = (e: any) => {
    if (e?.target?.value !== '') {
      setTags([..._tags, e.target.value])
      selectedTags([..._tags, e.target.value])
      e.target.value = ''
    }
  }
  return (
    <Card css={{ p: '16px', bgColor: '$kondorBlueCard' }}>
      <Grid.Container justify='center'>
        <Grid xs={12} css={{ d: 'flex', flexDirection: 'column' }}>
          <Container display='flex' justify='flex-start' css={{ p: 0 }}>
            <Text css={{ color: '$kondorGray' }}>
              Tags
            </Text>
          </Container>
        </Grid>
      </Grid.Container>
      <div className='tags-input'>
        <ul id='tags'>
          {_tags.map((tag, index) => (
            <li key={index} className='tag'>
              <span className='tag-title'>{tag}</span>
              <IconButton>
                <BiXCircle
                  onClick={() => removeTags(index)}
                />
              </IconButton>
            </li>
          ))}
        </ul>
        <LightInputSm
          type='text'
          onKeyUp={event => event.key === 'Enter' ? addTags(event) : null}
          placeholder='Press enter to add tags'
        />
      </div>
    </Card>
  )
}

export default TagsInput
