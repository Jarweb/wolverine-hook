import {useRef} from 'react'
import useFirstMounted from './useFirstMounted'

type Predicate<T> = (prev: T | undefined, next: T) => boolean

const strictEquals = <T> (prev: T | undefined, next: T) => prev === next

export default function usePreviousValue<T>(value: T, compareFn: Predicate<T> = strictEquals) {
	const prevRef = useRef<T>()
	const curRef = useRef<T>(value)
	const firstMounted = useFirstMounted()

	if (!firstMounted && !compareFn(curRef.current, value)) {
		prevRef.current = curRef.current
		curRef.current = value
	}

	return prevRef.current
}