import { styled } from '@nextui-org/react'

export const LinkButton = styled('button', {
  dflex: 'center',
  border: '2px solid $kondorPrimary',
  outline: 'none',
  cursor: 'pointer',
  borderRadius: '48px',
  height: '40px',
  width: '100%',
  minWidth: '140px',
  padding: '16px',
  margin: '0',
  bg: '$black',
  transition: '$default',
  '&:hover': {
    opacity: '0.8'
  },
  '&:active': {
    opacity: '0.6'
  }
})
