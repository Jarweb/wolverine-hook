import {useEffect } from 'react'
import chunk from 'lodash.chunk'

interface Options {
	cls: string
	fromKey: string,
	rootMargin: string,
	threshold: number,
}

export default function useLazyImage (options: Options) {
	const { fromKey, cls, rootMargin = '100px 0px', threshold = 0.01} = options
	
	const loadImg = (image: HTMLImageElement) => {
		const src = image.dataset[fromKey]
		src && (image.src = src)
	}

	useEffect(() => {
		const imgs = document.querySelectorAll(cls)

		if (!window.IntersectionObserver) {
			chunk(Array.from(imgs), 10)
			.forEach((task: any, index: number) => {
				const timer = setTimeout(() => {
					clearTimeout(timer)
					task.forEach((img: any) => {
						loadImg(img as HTMLImageElement)
					})
				}, 20 * index)
			})
		}
		else {
			const o = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					o.unobserve(entry.target)
					loadImg(entry.target as HTMLImageElement)
				})
			}, {rootMargin, threshold})

			imgs.forEach(img => o.observe(img))

			return () => {
				imgs.forEach(img => o.unobserve(img))
				o.disconnect()
			}
		}
	}, [fromKey, cls, rootMargin, threshold])
}