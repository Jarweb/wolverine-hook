import {useEffect, useRef} from 'react'

export default function uesEventListener (target: HTMLElement, eventType: string, handler: EventHandlerNonNull, options: EventListenerOptions) {
	const handleRef = useRef(handler)

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