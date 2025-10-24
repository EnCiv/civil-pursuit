import { useCallback } from 'react'
import { useDemInfoContext } from '../dem-info-context'

export default function useFetchDemInfo() {
  const context = useDemInfoContext()

  const data = context?.data
  const upsert = context?.upsert
  const requestedById = context?.requestedById

  const fetchDemInfo = useCallback(
    pointIds => {
      if (!data || !upsert || !requestedById) return
      if (!pointIds || pointIds.length === 0) return

      // Filter out IDs that are already in cache OR have been requested
      const uncached = pointIds.filter(id => !data.demInfoById?.hasOwnProperty(id) && !requestedById[id])
      if (uncached.length === 0) return

      // Mark these IDs as requested (within this context instance)
      uncached.forEach(id => (requestedById[id] = true))

      window.socket.emit('get-dem-info', uncached, demInfo => {
        if (demInfo) {
          upsert({ demInfoById: demInfo })
        }
      })
    },
    [data?.demInfoById, upsert, requestedById]
  )

  return fetchDemInfo
}
