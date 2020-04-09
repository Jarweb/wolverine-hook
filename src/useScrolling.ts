import { useEffect, useState, RefObject } from 'react'

interface Options {
	reachOffset?: number,
	throttle?: number
}

export default function useScrolling (ref: RefObject<HTMLElement>, callback: CallableFunction, options?: Options) {
	const [isReach, setReach] = useState(false)
	const { reachOffset = 0, throttle = 100 } = options || {}

	useEffect(() => {
		if (ref.current) {
			const element = ref.current
			let timer: any

			const handleReach = () => {
				setReach(true)
				callback()
			}

			const handler = () => {
				if (timer) {
					clearTimeout(timer)
					setReach(false)
				}

				timer = setTimeout(() => {
					const scrollTop = element?.scrollTop || 0
					const scrollHeight = element?.scrollHeight || 0
					const clientHeight = element?.clientHeight || 0

					scrollHeight - scrollTop - clientHeight <= reachOffset && handleReach()
				}, throttle)
			}

			element.addEventListener('scroll', handler, false)

			return () => {
				element?.removeEventListener('scroll', handler, false)
			}
		}
	}, [callback, reachOffset, ref, throttle])

	return {
		isReach
	}
}