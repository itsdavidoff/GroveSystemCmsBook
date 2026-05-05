import { useEffect } from 'react'

type ShortcutHandler = (e: KeyboardEvent) => void

export const useHotkeys = (keyMap: Record<string, ShortcutHandler>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrl = event.ctrlKey || event.metaKey
      const isShift = event.shiftKey
      const key = event.key.toLowerCase()

      let shortcutString = ''
      if (isCtrl) shortcutString += 'ctrl+'
      if (isShift) shortcutString += 'shift+'
      shortcutString += key

      if (keyMap[shortcutString]) {
        event.preventDefault()
        keyMap[shortcutString](event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keyMap])
}
