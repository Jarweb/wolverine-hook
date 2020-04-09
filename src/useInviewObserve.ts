import { useEffect, RefObject, useRef } from 'react';

export default function useInviewObserve(
	el: HTMLElement | HTMLElement[] | RefObject<HTMLElement> | RefObject<HTMLElement>[], 
	callback: CallableFunction, 
	options: IntersectionObserverInit
) {
	const ref = useRef(callback)

	useEffect(() => {
		if (ref.current && typeof IntersectionObserver === 'function') {
			const handler = (entries: IntersectionObserverEntry[]) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						callback(entry)
					}
				})
			}

			const observer = new IntersectionObserver(handler, options)
			const finalEl = [].slice.call(el)
			
			finalEl.forEach((item: any) => {
				item.current ? observer.observe(item.current) : observer.observe(item)
			})

			return () => {
				observer.disconnect()
			}
		}
	}, [el, options, callback])
}