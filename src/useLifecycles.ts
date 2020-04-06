import {useEffect} from 'react'

const noop = () => {}

export default function useLifecycles(mount: Function = noop, unmount?: Function) {
  useEffect(() => {
    if (mount) {
      mount()
    }

    return () => {
      if (unmount) {
        unmount()
      }
    }
  }, [])
}