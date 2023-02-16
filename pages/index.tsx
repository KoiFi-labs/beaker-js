import React from 'react'
import { useRouter } from 'next/router'

const Application = (): JSX.Element => {
  const router = useRouter()
  typeof window !== 'undefined' && router.push('/home')
  return <div />
}

export default Application
