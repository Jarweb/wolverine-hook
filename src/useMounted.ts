import {useCallback, useEffect, useRef} from 'react'

export default function uesMounted() {
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