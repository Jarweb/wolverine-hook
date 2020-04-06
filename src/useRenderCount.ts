import {useRef} from 'react'

export default function useRenderCount () {
	return ++useRef(0).current
}