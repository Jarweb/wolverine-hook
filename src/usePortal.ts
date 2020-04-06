import { ReactNode, useState, useEffect, ReactPortal, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom'

const genContainer = (options: any): HTMLElement => {
	const el = document.createElement('div')
	options.id && el.setAttribute('id', options.id)
	document.body.appendChild(el)
	return el
}

interface Options {
	defaultShow?: boolean, // 是否立刻显示
	duration?: number, // 多久后隐藏
}

export default function usePortal (options: Options) {
	const {defaultShow, duration, ...rest} = options
	const [isShow, setShow] = useState(defaultShow || false)
	const ref = useRef<HTMLElement>()
	const timerRef = useRef<NodeJS.Timeout>()

	const onShow = (show: boolean) => {
		setShow(show)
	}

	const create = useCallback(({ children }: { children: ReactNode }): ReactPortal | null => {
		if (duration) {
			timerRef.current && clearTimeout(timerRef.current)

			timerRef.current = setTimeout(() => {
				onShow(false)
			}, duration)
		}

		return isShow ? createPortal(children, ref.current!) : null
	}, [duration])

	useEffect(() => {
		const container = genContainer({...rest})
		ref.current = container
	}, [rest])
 
	return {
		isShow,
		onShow,
		create
	}
}