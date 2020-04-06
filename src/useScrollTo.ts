import {useCallback} from 'react'

export default function useScrollTo (position: 'top' | 'bottom' | number) {
	const scroller = document.scrollingElement || document.documentElement || document.body
	const scrollHeight = scroller.scrollHeight
	const clientHeight = scroller.clientHeight
	const dist = typeof position === 'number' ? position : position === 'top' ? 0 : scrollHeight
	let raf: any = null
	const loop = useCallback(() => {
		let pos: number = scroller.scrollTop || 0
		raf && cancelAnimationFrame(raf)

		if (pos > dist) {
			raf = requestAnimationFrame(loop)
			scroller.scrollTo(0, pos - pos / 5)
		}
		else if (dist - clientHeight - pos > 0) {
			raf = requestAnimationFrame(loop)
			scroller.scrollTo(0, pos + pos / 5 + 1)
		}
		else {
			cancelAnimationFrame(raf)
		}
	}, [dist])

	return loop
}