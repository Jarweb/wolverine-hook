import {useCallback} from 'react'
import useMounted from './useMounted';

export default function usePromise () {
	const isMounted = useMounted()

	return useCallback((p: Promise<any>) => {
		return new Promise((resolve, reject) => {
			const onResolve = (value: any) => {
				isMounted() && resolve(value)
			}
			const onReject = (error: any) => {
				isMounted() && reject(error)
			}
			p.then(onResolve, onReject)
		})
	}, [])
}