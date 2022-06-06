import { useState, useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export default function useLocalstorageState<T = any>(
  defaultValue: T,
  key: string,
): [T, Dispatch<SetStateAction<T>>] {
  const valueState = useState<T>(defaultValue)
  const [value, setValue] = valueState

  useEffect(() => {
    const stickyValue = window.localStorage.getItem(key)

    if (stickyValue !== null) {
      setValue(JSON.parse(stickyValue))
    }
  }, [key, setValue])

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return valueState
}