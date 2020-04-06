import useEffectOnce from './useEffectOnce'

export default function useMountedOnce (fn: () => void) {
	useEffectOnce(() => {
		fn()
	})
}