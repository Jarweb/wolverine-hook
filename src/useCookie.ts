import {useState, useCallback} from 'react'
import cookie from 'js-cookie'

export default function useCookie (key: string) {
  const [val, setVal] = useState(() => cookie.get(key) || null)

  const updateCookie = useCallback((newVal: string, options?: cookie.CookieAttributes) => {
    cookie.set(key, newVal, options)
    setVal(newVal)
  }, [key])

  const removeCookie = useCallback(() => {
    cookie.remove(key)
    setVal(null)
  }, [key])

  return {
    val,
    updateCookie,
    removeCookie
  }
}