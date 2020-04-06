import { useState, useRef, useEffect } from 'react'

type Options = {
	timeout?: number;
	dependencies?: string[];
}

enum WorkerStatus {
	'Pending' = 'pending',
	'Success' = 'Success',
	'Running' = 'Running',
	'Error' = 'Error',
	'Timeout' = 'Timeout'
}

const defaultOptions: Options = {
	timeout: undefined,
	dependencies: [],
}

const resolveDeps = (deps: string[]) => {
	if (deps.length === 0) return ''

	const depsStr = (deps.map(dep => `${dep}`)).toString()
	return `importScripts('${depsStr})`
}

const jobRunner = (fn: Function) => (event: MessageEvent) => {
	const [userFuncArgs] = event.data
	return Promise.resolve(fn(...userFuncArgs))
		.then(result => {
		// @ts-ignore
		postMessage([WorkerStatus.Success, result])
	})
	.catch(error => {
		// @ts-ignore
		postMessage([WorkerStatus.Error, error])
	})
}

const createBlobUrl = (fn: Function, deps: string[]) => {
	const blobCode = `${resolveDeps(deps)}; onmessage=(${jobRunner})(${fn})`
	const blob = new Blob([blobCode], { type: 'text/javascript' })
	const url = URL.createObjectURL(blob)
	return url
}

export default function useWorkerDynamic<T extends (...fnArgs: any[]) => any>(fn: T, options: Options = defaultOptions ) {
	const [status, setStatus] = useState(WorkerStatus.Pending)
	const workerRef = useRef<Worker & {url?: string}>()
	const promise = useRef<{ resolve?: (result: ReturnType<T>) => void, reject?: (result: ReturnType<T> | ErrorEvent) => void, }>({})
	const timerRef = useRef<NodeJS.Timeout>()

	const killWorker = (status = WorkerStatus.Pending) => {
		if (workerRef.current?.url) {
			workerRef.current.terminate()
			URL.revokeObjectURL(workerRef.current.url)
			promise.current = {}
			workerRef.current = undefined
			timerRef.current && clearTimeout(timerRef.current)
			setStatus(status)
		}
	}

	const createWorker = () => {
		const {dependencies, timeout} = options
		const blobUrl = createBlobUrl(fn, dependencies!)
		const w: Worker & {url?: string} = new Worker(blobUrl)
		
		w.url = blobUrl

		w.onmessage = (event: MessageEvent) => {
			const [status, result] = event.data

			if (status === WorkerStatus.Success) {
				promise.current.resolve?.(result)
				killWorker(WorkerStatus.Success)
			}
			else {
				promise.current.reject?.(result)
				killWorker(WorkerStatus.Error)
			}
		}

		w.onerror = (error: ErrorEvent) => {
			promise.current.reject?.(error)
			killWorker(WorkerStatus.Error)
		}

		if (timeout) {
			timerRef.current = setTimeout(() => {
				killWorker(WorkerStatus.Timeout)
			}, timeout);
		}

		return w
	}

	const run = (...fnArgs: any) => {
		if (status === WorkerStatus.Running) {
			return Promise.reject()
		}

		workerRef.current = createWorker()
		return () => new Promise((resolve, reject) => {
			promise.current = {
				'resolve': resolve,
				'reject': reject
			}

			workerRef.current?.postMessage([[...fnArgs]])
			setStatus(WorkerStatus.Running)
		})
	}

	useEffect(() => {
		killWorker()
	}, [])

	return {
		status,
		run,
		killWorker
	}
}