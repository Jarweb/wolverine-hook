import {useEffect, useRef} from 'react'

const noop = () => {}

export default function useInterval (callback: Function, delay?: number | null) {
  const cbRef = useRef<Function>(noop)

  useEffect(() => {
    cbRef.current = callback
  })

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => {
        cbRef.current()
      }, delay || 0)
      
      return () => {
        clearInterval(interval)
      }
    }
  }, [delay])
}