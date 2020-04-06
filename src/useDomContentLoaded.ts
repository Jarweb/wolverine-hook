import { useEffect, useState} from 'react'

export default function useDomContentLoaded () {
	const state = document.readyState
	const [ready, setReady] = useState(state)

	const handler = () => {
		setReady(document.readyState)
	}

	useEffect(() => {
		document.addEventListener('DOMContentedLoaded', handler)
		return () => {
			document.removeEventListener('DOMContentedLoaded', handler)
		}
	}, [])

	return ready
}