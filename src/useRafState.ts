import { useRef, useCallback, useState} from 'react'
import useUnmount from './useUnmount'

export default function useRafState<T> (initialState: T) {
	const frame = useRef<number | null>(null)
	const [state, setState] = useState<T>(initialState)

	const setRafState = useCallback((value: T) => {
		frame.current && cancelAnimationFrame(frame.current)

		frame.current = requestAnimationFrame(() => {
			setState(value)
		})
	}, [])

	useUnmount(() => {
		frame.current && cancelAnimationFrame(frame.current)
	})

	return {
		state, setRafState
	}
}