import { useEffect, useState, useRef, useCallback} from 'react'

export default function useRaf (callback: CallableFunction, delay?: number) {
	const raf = useRef<number | null>(null)
	const timer = useRef<NodeJS.Timeout | null>(null)
	const [isActive, setActive] = useState(false)

	const clearRafLoop = () => {
		raf.current && cancelAnimationFrame(raf.current)
	}

	const clearTimer = () => {
		timer.current && clearTimeout(timer.current)
	}

	const stepLoop = useCallback(() => {
		callback()
		raf.current = requestAnimationFrame(stepLoop)
	}, [callback])

	const stopLoop = () => {
		setActive(false)
	}

	const startLoop = (ms?: number) => {
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
	}, [isActive, callback, delay, stepLoop])

	return {
		startLoop,
		stopLoop,
		isActive
	}
}