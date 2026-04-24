import { useEffect } from 'react'

export const useAutoLock = (onLock, timeoutMinutes = 5) => {
  useEffect(() => {
    let timeoutId

    const resetTimeout = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        onLock()
      }, timeoutMinutes * 60 * 1000)
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => document.addEventListener(e, resetTimeout))
    resetTimeout()

    return () => {
      clearTimeout(timeoutId)
      events.forEach((e) => document.removeEventListener(e, resetTimeout))
    }
  }, [onLock, timeoutMinutes])
}
