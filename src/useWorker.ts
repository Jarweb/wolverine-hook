import {useState, useEffect} from 'react'

export default function useWorker (path: string, options: WorkerOptions) {
	const [w, set] = useState<Worker | null>()

	useEffect(() => {
		const instance = new Worker(path, options)
		set(instance)
		return () => {
			instance.terminate()
		}
	}, [path, options])

	return w
}