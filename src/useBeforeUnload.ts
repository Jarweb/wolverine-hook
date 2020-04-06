import {useCallback, useEffect} from 'react'

export default function useBeforeUnload (enabled: boolean | (() => boolean) = true, cb?: () => void | string) {
  const handler = useCallback((event: BeforeUnloadEvent) => {
    const resEnabled = typeof enabled === 'function' ? enabled() : enabled
    const resCb = typeof cb === 'function' ? cb() : cb

    if (!resEnabled) return

    event.preventDefault()

    if (resCb) {
      event.returnValue = resCb
    }

    return resCb

  }, [enabled, cb])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [enabled, handler])
}