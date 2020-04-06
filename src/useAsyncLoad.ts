import {useState, useEffect} from 'react'

const createTag = (tag: 'script' | 'style' | 'image', src: string) => {
	let node: any = null
	switch (tag) {
		case 'script':
			node = document.createElement('script')
			node.src = src
			node._p = 'body'
			break;
		case 'style':
			node = document.createElement('link')
			node.href = src
			node._p = 'head'
			break;
		case 'image':
			node = document.createElement('img')
			node.href = src
			node._p = 'body'
			break;
		default:
			break;
	}
	return node
}

export default function useAsyncLoad (src: string, tag: 'script' | 'style' | 'image', id?: string) {
	const [state, setState] = useState<{ready: boolean, error: string | null | ErrorEvent}>({
		ready: false,
		error: null
	})

	useEffect(() => {
		if (id && document.getElementById(id)) return
		
		const el = createTag(tag, src)
		id && (el.id = id)
		el && (el.onload = () => setState({ready: true, error: null}))
		el && (el.onerror = (error: any) => setState({ready: false, error: error}))
		el && el._p === 'body' 
			? document.body.appendChild(el)
			: document.head.appendChild(el)
	}, [src, tag, id])
} 
