import {useRef} from 'react'
import useEffectOnce from './useEffectOnce';

export default function useUnmount (callback: () => any) {
	const cbRaf = useRef(callback)
	cbRaf.current = callback

	useEffectOnce(() => {
		return () => {
			cbRaf.current()
		}
	})
}