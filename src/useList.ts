import { useRef, useMemo} from 'react'
import forceUpdater from './useForceUpdate'

type ResolveStateInitialFn<T> = () => T
type ResolveStateFn<T> = (newState: T) => T
type ResolveState<T> = T | ResolveStateFn<T> | ResolveStateInitialFn<T>

function resolveState<T>(newState: ResolveState<T[]>, curState?: T[]): T[] {
  if (typeof newState === 'function') {
    return (newState as Function)(curState)
  }

  return newState
}

export default function useList<T> (initialList: T[]) {
  const list = useRef(resolveState(initialList))
  const updater = forceUpdater()

  const actions = useMemo(() => {
    return {
      set: (newList: ResolveState<T[]>) => {
        list.current = resolveState(newList)
        updater()
      },
      push: (...items: T[]) => {
        items.length && actions.set((curList: T[]) => curList.concat(items))
      },
      updateAt: (index: number, item: T) => {
        actions.set((curList: T[]) => {
          const arr = [...curList]
          arr[index] = item
          return arr
        })
      },
      insertAt: (index: number, item: T) => {
        actions.set((curList: T[]) => {
          const arr = [...curList]
          index > arr.length ? (arr[index] = item) : arr.splice(index, 0, item)
          return arr
        })
      },
      updateItem: (indicate: (item:T, newItem: T) => boolean, newItem: T) => {
        actions.set((curList: T[]) => curList.map(item => (indicate(item, newItem) ? newItem : item)))
      },
      updateSert: (indicate: (item: T, newItem: T) => boolean, newItem: T) => {
        const index = list.current.findIndex(item => indicate(item, newItem))
        index >= 0 ? actions.updateAt(index, newItem) : actions.push(newItem)
      },
      sort: (compareFn?: (a: T, b: T) => number) => {
        actions.set((curList: T[]) => curList.slice().sort(compareFn))
      },
      removeAt: (index: number) => {
        actions.set((curList: T[]) => {
          const arr = [...curList]
          arr.splice(index, 1)

          return arr
        })
      },
      clear: () => {
        actions.set([])
      },
      reset: () => {
        actions.set(resolveState(initialList).slice())
      },
      filter: <S extends T>(callback: (item: T, index: number, array: T[]) => item is S, thisArg?: any) => {
        actions.set((curList: T[]) => curList.slice().filter(callback, thisArg))
      }
    }
  }, [initialList, updater])

  return [list.current, actions]
}