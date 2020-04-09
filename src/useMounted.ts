import {useCallback, useEffect, useRef} from 'react'

export default function useMounted() {
	const ref = useRef(false)

	const checkMounted = useCallback(() => {
		return ref.current
	}, [])

	useEffect(() => {
		ref.current = true

		return () => {
			ref.current = false
		}
	})

	return checkMounted
}