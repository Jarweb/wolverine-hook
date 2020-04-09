import {useCallback, useRef} from 'react'

export default function useScrollTo (position: 'top' | 'bottom' | number) {
	const scroller = document.scrollingElement || document.documentElement || document.body
	const scrollHeight = scroller.scrollHeight
	const clientHeight = scroller.clientHeight
	const dist = typeof position === 'number' ? position : position === 'top' ? 0 : scrollHeight
	const raf = useRef<number>()

	const loop = useCallback(() => {
		let pos: number = scroller.scrollTop || 0
		raf.current && cancelAnimationFrame(raf.current)

		if (pos > dist) {
			raf.current = requestAnimationFrame(loop)
			scroller.scrollTo(0, pos - pos / 5)
		}
		else if (dist - clientHeight - pos > 0) {
			raf.current = requestAnimationFrame(loop)
			scroller.scrollTo(0, pos + pos / 5 + 1)
		}
		else {
			raf.current && cancelAnimationFrame(raf.current)
		}
	}, [dist, clientHeight, scroller])

	return loop
}