import {useEffect, useRef} from 'react'

export default function usePersistState<T> (state: T) {
	const ref = useRef<T>()

	useEffect(() => {
		ref.current = state
	}, [state])

	return ref.current
}