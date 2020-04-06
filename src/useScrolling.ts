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
					const scrollTop = ref.current?.scrollTop || 0
					const scrollHeight = ref.current?.scrollHeight || 0
					const clientHeight = ref.current?.clientHeight || 0

					scrollHeight - scrollTop - clientHeight <= reachOffset && handleReach()
				}, throttle)
			}

			ref.current.addEventListener('scroll', handler, false)

			return () => {
				ref.current?.removeEventListener('scroll', handler, false)
			}
		}
	}, [callback, reachOffset])

	return {
		isReach
	}
}