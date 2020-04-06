import {useCallback} from 'react'

export default function useNotification (title: string, options?: NotificationOptions) {
	const showNotification = useCallback(() => {
		if (!('Notification' in window)) return

		if (Notification.permission !== 'granted') {
			Notification.requestPermission().then(permission => {
				if (permission === 'granted') {
					return new Notification(title, options)
				}
			})
		}
		else {
			return new Notification(title, options)
		}
	}, [title, options])

	return showNotification
}