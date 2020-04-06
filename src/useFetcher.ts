import {useCallback, useEffect, useState} from 'react'

export default function useFetcher (f: (() => Promise<any>)) {
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState()
	const [error, setError] = useState()

	const run = useCallback(async () => {
		if (loading) return

		setLoading(true)
		
		return f()
		.then((data) => setData(data))
		.catch(err => setError(err))
		.finally(() => setLoading(false))
	}, [f])

	useEffect(() => {
		run()
	}, [f])

	return {
		error,
		loading,
		data
	}
}