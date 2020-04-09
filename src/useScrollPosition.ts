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

		const node = ref.current

		if (node) {
			node.addEventListener('scroll', handler, {
				capture: false,
				passive: true
			})

			return () => {
				node && node.removeEventListener('scroll', handler)
			}
		}
	}, [ref, setPosition])

	return position
}