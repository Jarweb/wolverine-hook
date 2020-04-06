import {RefObject, useEffect, useRef} from 'react'

const getBody = (el: Element | HTMLElement | null): HTMLElement | null => {
  if (!el) return null
  else if (el.tagName === 'BODY') return el as HTMLElement
  else if (el.tagName === 'IFRAME') {
    const doc = (el as HTMLIFrameElement).contentDocument 
    return doc ? doc.body : null
  }
  else if (!(el as HTMLElement).offsetParent) return null

  return getBody((el as HTMLElement).offsetParent!)
}

const preventDefault = (rawEvent: TouchEvent): boolean => {
  const event = rawEvent || window.event
  if (event.touches.length > 1) return true
  if (event.preventDefault) event.preventDefault()
  return false
}

const isIosDevice =
  typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.platform &&
  /iP(ad|hone|od)/.test(window.navigator.platform)

const bodyMap: Map<HTMLElement, { count: number, overflow: CSSStyleDeclaration['overflow']}> = new Map()

let documentListenerAdded = false

export default function useLockBodyScroll(locked: boolean = true, elementRef?: RefObject<HTMLElement>) {
  elementRef = elementRef || useRef(document!.body)

  useEffect(() => {
    const body = getBody(elementRef!.current)

    if (!body) return

    const bodyInfo = bodyMap.get(body)

    if (locked) {
      if (!bodyInfo) {
        bodyMap.set(body, {
          count: 1,
          overflow: body.style.overflow
        })

        if (isIosDevice) {
          if (!documentListenerAdded) {
            document.addEventListener('touchmove', preventDefault, { passive: false });
            documentListenerAdded = true;
          }
        } else {
          body.style.overflow = 'hidden';
        }
      }
      else {
        bodyMap.set(body, {
          count: bodyInfo.count + 1,
          overflow: bodyInfo.overflow
        })
      }
    }
    else{
      if (bodyInfo) {
        if (bodyInfo.count === 1) {
          bodyMap.delete(body)
          if (isIosDevice) {
            body.ontouchmove = null

            if (documentListenerAdded) {
              document.removeEventListener('touchmove', preventDefault)
              documentListenerAdded = false
            }
          }
          else {
            body.style.overflow = bodyInfo.overflow
          }
        }
        else {
          bodyMap.set(body, {
            count: bodyInfo.count - 1,
            overflow: bodyInfo.overflow
          })
        }
      }
    }
  }, [locked, elementRef.current])
}