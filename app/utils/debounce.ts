type GenericFunction = (...arg: any[]) => any

interface DebounceWithNoReturn<T extends GenericFunction> {
  (...args: Parameters<T>): undefined
  cancel(): void
}

interface DebounceWithMaybeReturn<T extends GenericFunction> {
  (...args: Parameters<T>): ReturnType<T> | undefined
  cancel(): void
}

// TODO: consider idea when debounced function return Promise
function debounce<T extends GenericFunction>(func: T, wait: number, immediate?: true): DebounceWithMaybeReturn<T>
function debounce<T extends GenericFunction>(func: T, wait: number, immediate: false): DebounceWithNoReturn<T>
function debounce<T extends GenericFunction>(func: T, wait = 0, immediate = true) {
  let timeout: number | undefined
  let lastArgs: Parameters<T>
  const cancel = (): void => {
    self.clearTimeout(timeout)
    timeout = undefined
  }
  const resultFn = immediate
    ? (function (...args) {
        if (timeout === undefined) {
          timeout = self.setTimeout(cancel, wait)
          return func(...args)
        }
        self.clearTimeout(timeout)
        timeout = self.setTimeout(cancel, wait)
      } as DebounceWithMaybeReturn<T>)
    : (function (...args) {
        lastArgs = args

        self.clearTimeout(timeout)
        timeout = self.setTimeout(() => {
          cancel()
          func(...lastArgs)
        }, wait)
      } as DebounceWithNoReturn<T>)

  resultFn.cancel = cancel

  return resultFn
}

export default debounce
