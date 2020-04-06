import {useRef} from 'react'

export default function useFirstMounted () {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false

    return true
  }

  return isFirst.current
}