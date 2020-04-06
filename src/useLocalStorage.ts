import {useState} from 'react'

export default function useLocalStorage(key: string, val: string) {
  const [value, setValue] = useState(() => {
    try {
      const oldVal = localStorage.getItem(key)

      if (oldVal !== null) {
        return oldVal
      }
      else {
        val && localStorage.setItem(key, val)
        return val
      }
    } catch (error) {
      return val
    }
  })

  return [value, setValue]
}