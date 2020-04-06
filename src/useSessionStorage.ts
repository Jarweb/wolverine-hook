import {useState} from 'react'

export default function useSesstionStorage(key: string, val: string) {
  const [value, setValue] = useState(() => {
    try {
      const oldVal = sessionStorage.getItem(key)

      if (oldVal !== null) {
        return oldVal
      }
      else {
        val && sessionStorage.setItem(key, val)
        return val
      }
    } catch (error) {
      return val
    }
  })

  return [value, setValue]
}