import {useEffect, useRef} from 'react'

export default function useEventListener (target: HTMLElement, eventType: string, handler: EventHandlerNonNull, options: EventListenerOptions) {
	const handleRef = useRef<EventHandlerNonNull>(handler)

	useEffect(() => {
		handleRef.current = handler
	}, [handler])

	useEffect(() => {
		if (!target.addEventListener) return

		target.addEventListener(eventType, handleRef.current, options || false)
		return () => {
			target.removeEventListener(eventType, handleRef.current)
		}
	}, [target, eventType, options])
}