import { useState, useEffect } from 'react'

const useTimer = () => {
  const [timerFlag, setFlag] = useState<boolean>(false)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [timerId])

  const runTimer = () => {
    if (timerId) {
      clearTimeout(timerId)
      setTimerId(null)
    }
    const newTimerId = setTimeout(() => {
      setFlag((prevFlag) => !prevFlag)
      setTimerId(null)
    }, 2000)
    setTimerId(newTimerId)
  }
  return { timerFlag, runTimer }
}

export default useTimer
