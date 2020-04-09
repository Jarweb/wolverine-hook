import {useState, useEffect, RefObject} from 'react'

export default function useIntersection (ref: RefObject<HTMLElement>, options: IntersectionObserverInit): IntersectionObserverEntry | null {
  const [observerEntry, setObserverEntry] = useState<IntersectionObserverEntry | null>(null)  

  useEffect(() => {
    if (ref.current && typeof IntersectionObserver === 'function') {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setObserverEntry(entries[0])
      }

      const observer = new IntersectionObserver(handler, options)
      observer.observe(ref.current)

      return () => {
        setObserverEntry(null)
        observer.disconnect()
      }
    }

    return () => {}
    
  }, [ref, options])

  return observerEntry
}
