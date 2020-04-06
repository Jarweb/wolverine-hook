import { useRef, DependencyList } from 'react';
import deepEqual from 'dequal'

export default function useDeepCompare (deps: DependencyList) {
	const ref = useRef<DependencyList>([])

	if (!deepEqual(deps, ref.current)) {
		ref.current = deps
	}

	return ref.current
}