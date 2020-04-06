import {useEffect, useState} from 'react'

interface NetworkState {
	online?: boolean,
	since?: Date,
	downlink?: number, // 下行
	downlinkMax?: number, // 最大下行
	effectiveType?: string, // 类型
	rtt?: number, // 
	type?: string, // 
}

const getState = (net: any) => {
	if (!net) return {}

	const { downlink, downlinkMax, effectiveType, type, rtt } = net

	return {
		downlink,
		downlinkMax,
		effectiveType,
		type,
		rtt
	}
}

export default function useNetwork(initialState?: NetworkState) {
	const [state, setState] = useState(initialState || {})
	
	useEffect(() => {
		let localState = state
		const updater = (curState: NetworkState) => {
			localState = {
				...localState,
				...curState
			}
			setState(localState)
		}

		const net = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

		const onOnline = () => {
			updater({
				online: true,
				since: new Date()
			})
		}

		const onOffline = () => {
			updater({
				online: false,
				since: new Date()
			})
		}

		const onConnectionChange = () => {
			updater({
				...getState(net),
				online: navigator.onLine,
				since: new Date()
			})
		}

		window.addEventListener('online', onOnline)
		window.addEventListener('offline', onOffline)
		net && net.addEventListener('change', onConnectionChange)

		return () => {
			window.removeEventListener('online', onOnline)
			window.removeEventListener('offline', onOffline)
			net && net.removeEventListener('change', onConnectionChange)
		}
	})

	return state
}
