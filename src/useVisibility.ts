import {useEffect, useState} from 'react'

export default function useVisibility () {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const handler = () => {
			const hiden = document.hidden
			setVisible(hiden)
		}

		window.addEventListener('visibilitychange', handler)
		
		return () => {
			window.removeEventListener('visibilitychange', handler)
		}
	}, [])

	return visible
}