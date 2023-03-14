import { useEffect, useState } from 'react'

export const useCooldown = (finishTimestamp: number) => {
  const [left, setLeft] = useState(Math.max(0, finishTimestamp - Math.floor(Date.now() / 1000)))
  useEffect(() => {
    const interval = setInterval(() => setLeft((e) => e - 1), 1000)
    return () => clearInterval(interval)
  }, [finishTimestamp])

  return left
}
