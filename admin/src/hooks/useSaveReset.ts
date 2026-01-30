// Custom hook for save/reset functionality with localStorage
import { useState, useEffect } from 'react'
import { saveToLocalStorage, loadFromLocalStorage, deepCopy, hasChanges as checkHasChanges, confirmReset } from '@/lib/saveHelpers'

export function useSaveReset<T>(storageKey: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue)
  const [originalData, setOriginalData] = useState<T>(defaultValue)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage(storageKey, defaultValue)
    setData(saved)
    setOriginalData(deepCopy(saved))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (saveToLocalStorage(storageKey, data)) {
      setOriginalData(deepCopy(data))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      return true
    } else {
      alert('Хадгалахад алдаа гарлаа')
      return false
    }
  }

  const handleReset = () => {
    const changed = checkHasChanges(data, originalData)
    if (confirmReset(changed)) {
      setData(deepCopy(originalData))
    }
  }

  return {
    data,
    setData,
    saveSuccess,
    handleSave,
    handleReset,
  }
}
