import {useCallback, useState} from 'react'

const incre = (num: number): number => ++num % 1_000_000

export default function useForceUpdate() {
  const [, setState] = useState(0)

  return useCallback(() => {
    setState(incre)
  }, [])
}