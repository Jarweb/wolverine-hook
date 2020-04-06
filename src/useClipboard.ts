import {useState} from 'react'
import * as clipboard from 'clipboard-polyfill'

export default function useClipboard() {
  const [result, setRes] = useState<{value: undefined | string, status: 'success' | 'fail'}>({
    value: undefined,
    status: 'fail'
  })

  const handleCopy = (value: string) => {
    clipboard.writeText(value)
    .then(() => {
      setRes({
        value: value,
        status: 'success'
      })
    })
    .catch(() => {
      setRes({
        value: undefined,
        status: 'fail'
      })
    })
  }

  return {
    result,
    handleCopy
  }
}