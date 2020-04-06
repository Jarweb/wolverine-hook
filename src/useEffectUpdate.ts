import { useEffect, EffectCallback, DependencyList} from 'react'
import useFirstMounted from './useFirstMounted'

export default function useUpdateEffect(effect: EffectCallback, deps: DependencyList) {
	const isFirstmMounted = useFirstMounted()

	useEffect(() => {
		if (!isFirstmMounted) {
			return effect()
		}
	}, deps)
}