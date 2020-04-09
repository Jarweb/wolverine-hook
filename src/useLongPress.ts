import {useCallback, useRef} from 'react'

interface Options {
  isPreventDefault?: boolean,
  delay?: number
}

const isTouchEvent = (event: Event): event is TouchEvent => {
  return 'touches' in event
}

const preventDefault = (event: Event) => {
  if (!isTouchEvent(event)) return

  if (event.touches.length < 2 && event?.preventDefault) {
    event.preventDefault()
  }
}

export default function useLongPress(
  callback: (e: TouchEvent | MouseEvent) => void, 
  { isPreventDefault = true, delay = 300}: Options = {}
) {
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const target = useRef<EventTarget>()

  const onStart = useCallback((event: TouchEvent | MouseEvent) => {
    if (isPreventDefault && event.target) {
      event.target.addEventListener('touchend', preventDefault, {passive: false})
      target.current = event.target
    }

    timer.current = setTimeout(() => {
      callback(event)
    }, delay)

  }, [callback, delay, isPreventDefault])

  const onClear = useCallback(() => {
    timer.current && clearTimeout(timer.current)

    if (isPreventDefault && target.current) {
      target.current.removeEventListener('touchend', preventDefault)
    }
  }, [isPreventDefault])

  return {
    onMouseDown: (e: any) => onStart(e),
    onMouseUp: onClear,
    onMouseLeave: onClear,
    onTouchStart: (e: any) => onStart(e),
    onTouchEnd: onClear,
  } as const
}