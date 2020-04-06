import React, { useState, useCallback, ReactNodeArray} from 'react'

interface State {
	[name: string]: any
}

export default function useFormLabel(initialState: State, formOptions?: any) {
	const [value, setValue] = useState<State>(initialState)

	const handleRest = useCallback(() => {
		setValue(initialState)
	}, [initialState])

	const handleSubmit = useCallback((cb: (value: State) => void) => {
		cb(value)
	}, [])

	const handleValidate = useCallback((cb: (value: State) => void) => {
		cb(value)
	}, [])

	const FormLabel = ({children}: {children: ReactNodeArray}) => {
		return (<form {...formOptions} >{ children }</form>)
	}

	return {
		value,
		FormLabel,
		handleSubmit,
		handleRest,
		handleValidate
	}
}