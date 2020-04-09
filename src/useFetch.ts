import { useState, useEffect } from 'react'

export default function useFetch (url: string, init?: RequestInit) {
	const [state, setState] = useState<{
		data: any,
		loading: boolean,
		error: ErrorEvent | null,
		controller: AbortController | null
	}>({
		data: null,
		loading: false,
		error: null,
		controller: null
	})

	useEffect(() => {
		const controller = new AbortController()

		setState({
			data: null,
			loading: true,
			error: null,
			controller
		})

		fetch(url, { ...init, signal: controller.signal})
		.then(response => {
			const contentType = response.headers.get('content-type')
			if (contentType && /json/.test(contentType)) {
				return response.json()
			}
			else {
				return response.text()
			}
		})
		.then(data => {
			setState({
				data,
				loading: false,
				error: null,
				controller
			})
		})
		.catch(error => {
			setState({
				data: null,
				loading: false,
				error,
				controller
			})
		})

		return () => {
			controller.abort()
		}
	}, [url, init])

	return {
		data: state.data,
		loading: state.loading,
		error: state.error,
		abort: () => state.controller?.abort()
	}
}