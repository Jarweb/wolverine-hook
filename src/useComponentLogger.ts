import useEffectUpdate from './useEffectUpdate'
import useEffectOnce from './useEffectOnce'

export default function useComponentLogger (componentName: string, ...rest: any[]) {
	useEffectOnce(() => {
		console.log(`${componentName} mounted`, ...rest)

		return () => {
			console.log(`${componentName} unmounted`)
		}
	})

	useEffectUpdate(() => {
		console.log(`${componentName} updated`, ...rest)
	}, [componentName, ...rest])
}