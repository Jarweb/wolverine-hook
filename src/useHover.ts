import { useState, ReactElement, cloneElement} from 'react'

type Element = ((state: boolean) => ReactElement<any>) | ReactElement<any>
const noop = () => {}

export default function useHover(element: Element): { element: Element, status: boolean} {
  const [status, setStatus] = useState(false)

  const onMouseEnter = (originalOnMouseEnter?: any) => (event?: any) => {
    (originalOnMouseEnter || noop)(event)
    setStatus(true)
  }

  const onMouseLeave = (originalOnMouseLeave?: any) => (event?: any) => {
    (originalOnMouseLeave || noop)(event)
    setStatus(false)
  }

  if (typeof element === 'function') {
    element = element(status)
  }

  const el = cloneElement(element, {
    onMouseEnter: onMouseEnter(element.props.onMouseEnter),
    onMouseLeave: onMouseLeave(element.props.onMouseLeave),
  })

  return {
    element: el,
    status
  }
}