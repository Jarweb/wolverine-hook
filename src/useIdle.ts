import {useEffect, useState} from 'react'
import { throttle } from 'throttle-debounce'

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60e3

export default function useIdle(ms: number = oneMinute, initialStatus: boolean = false, events?: string[]): boolean {
  const [status, setStatus] = useState(initialStatus)
  const finalEvents = [...defaultEvents, ...(events || [])]

  useEffect(() => {
    let mounted = true
    let timer: any
    let localStatus: boolean = status

    const updateStatus = (newVal: boolean) => {
      if (mounted) {
        localStatus = newVal
        setStatus(newVal)
      }
    }

    const onEvent = throttle(50, () => {
      if (localStatus) {
        updateStatus(false)
      }

      clearTimeout(timer)
      timer = setTimeout(() => {
        updateStatus(true)
      }, ms)
    })

    const onVisibility = () => {
      if (!document.hidden) {
        onEvent()
      }
    }

    for (let i = 0; i < finalEvents.length; i ++) {
      window.addEventListener(finalEvents[i], onEvent)
    }
    document.addEventListener('visibilitychange', onVisibility)


    return () => {
      mounted = false

      for (let i = 0; i < finalEvents.length; i++) {
        window.removeEventListener(finalEvents[i], onEvent)
      }
      document.removeEventListener('visibilitychange', onVisibility)
    }

  }, [ms, events])

  return status
}