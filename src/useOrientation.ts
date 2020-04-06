import {useEffect, useState} from 'react'

interface OrientationState {
	angle: number,
	type: string
}

const defaultState: OrientationState = {
	angle: 0,
	type: 'landscape-primary'
}

export default function useOrientation(initialState: OrientationState = defaultState) {
	const [state, setState] = useState(initialState)

	useEffect(() => {
		let mounted = true 

		const onChange = () => {
			if (mounted) {
				const {orientation} = window.screen
				if (orientation) {
					const {angle, type} = orientation
					setState({angle, type})
				}
				else if (window.orientation) {
					setState({
						angle: typeof window.orientation === 'number' ? window.orientation : 0,
						type: ''
					})
				}
			}
		}

		window.addEventListener('orientationchange', onChange)
		onChange()

		return () => {
			mounted = false
			window.removeEventListener('orientationchange', onChange)
		}
	}, [])

	return state
}