import { useEffect, RefObject } from 'react'

export default function useToggleClass<T extends HTMLElement>(el: T | RefObject<T>, toggle: boolean, [on, off]: [string, string]) {
	useEffect(() => {
		const node = (el as any).current ? (el as any).current : el
		node.classList.remove(toggle ? off : on)
		node.calssList.add(toggle ? on : off)
	}, [el, toggle, on, off])
}