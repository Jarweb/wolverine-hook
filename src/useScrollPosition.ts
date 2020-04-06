import { useEffect, RefObject } from 'react';
import useRafState from './useRafState'

export default function useScrollPosition (ref: RefObject<HTMLElement>) {
	const { state: position, setRafState: setPosition} = useRafState({
		x: 0,
		y: 0
	})

	useEffect(() => {
		const handler = () => {
			if (ref.current) {
				setPosition({
					x: ref.current.scrollLeft,
					y: ref.current.scrollTop
				})
			}
		}

		if (ref.current) {
			ref.current.addEventListener('scroll', handler, {
				capture: false,
				passive: true
			})
		}

		return () => {
			ref.current && ref.current.removeEventListener('scroll', handler)
		}
	}, [ref])

	return position
}