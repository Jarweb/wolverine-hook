import {useEffect, useState} from 'react'

type Trigger = 'load' | 'popstate' | 'pushstate' | 'replacestate'

const dispatchHistoryEvent = (method: 'pushState' | 'replaceState') => {
  const original = history[method]

  history[method] = function (state) {
    const result = original.apply(this, arguments as any)
    const event: any = new Event(method.toLowerCase())

    event.state = state
    window.dispatchEvent(event)

    return result
  }
}

dispatchHistoryEvent('pushState')
dispatchHistoryEvent('replaceState')

const genState = (trigger: Trigger) => {
  const {state, length} = history
  const {hash, host, hostname, href, origin, pathname, port, protocol, search} = location

  return {
    trigger,
    state,
    length,
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search,
  }
}

export default function useLocation() {
  const [state, setState] = useState(genState('load'))

  useEffect(() => {
    const onPopState = () => setState(genState('popstate'))
    const onPushState = () => setState(genState('pushstate'))
    const onReplaceState = () => setState(genState('replacestate'))

    window.addEventListener('popstate', onPopState)
    window.addEventListener('pushstate', onPushState)
    window.addEventListener('replacestate', onReplaceState)

    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('pushstate', onPushState)
      window.removeEventListener('replacestate', onReplaceState)
    }
  }, [])

  return state
}