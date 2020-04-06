import {useEffect, useState} from 'react'

export default function useImgSize (url: string, resize: string) {
	const [size, setSize] = useState([0, 0])

	useEffect(() => {
		if (!url) return 

		const img = document.createElement('img')
		img.onload = (e: any) => {
			const {naturalHeight, natiralWidth} = e.target
			setSize([natiralWidth, naturalHeight])
		}
		const arr = url.split('.')
		arr.splice(-1, 0, resize)
		img.src = arr.join('.')
	}, [url, resize])

	return size
}  