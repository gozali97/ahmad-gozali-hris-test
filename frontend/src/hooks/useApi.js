import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export function useApi(serviceFn) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await serviceFn(...args)
      setData(result)
      return result
    } catch (err) {
      const message = err.response?.data?.message || 'Terjadi kesalahan.'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [serviceFn])

  return { data, isLoading, error, execute }
}
