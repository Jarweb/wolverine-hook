import {useEffect, useState, useRef} from 'react'

export default function useRaf (callback: CallableFunction, delay?: number) {
	const raf = useRef<number | null>(null)
	const timer = useRef<NodeJS.Timeout | null>(null)
	const [isActive, setActive] = useState(false)

	function clearRafLoop () {
		raf.current && cancelAnimationFrame(raf.current)
	}

	function clearTimer () {
		timer.current && clearTimeout(timer.current)
	}

	function stepLoop () {
		callback()
		raf.current = requestAnimationFrame(stepLoop)
	}

	function stopLoop () {
		setActive(false)
	}

	function startLoop (ms?: number) {
		setActive(true)

		clearTimer()

		ms && 
		(timer.current = setTimeout(() => {
			setActive(false)
		}, ms))
	}

	useEffect(() => {
		clearRafLoop()
	}, [])

	useEffect(() => {
		clearRafLoop()
		clearTimer()

		if (delay) {
			timer.current = setTimeout(() => {
				setActive(true)
			}, delay)
		}
		else {
			setActive(true)
		}

		isActive && (raf.current = requestAnimationFrame(stepLoop))

		return () => {
			clearRafLoop()
			clearTimer()
		}
	}, [isActive, callback, delay])

	return {
		startLoop,
		stopLoop,
		isActive
	}
}