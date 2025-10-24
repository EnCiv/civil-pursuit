import { useCallback } from 'react'
import { useDemInfoContext } from '../dem-info-context'

// Static variable shared across all hook instances
// Tracks which pointIds have been requested to avoid redundant fetches
const requestedById = {}

// Reset function for testing - clears the static cache
export function resetRequestedById() {
  Object.keys(requestedById).forEach(key => delete requestedById[key])
}

export default function useFetchDemInfo() {
  const context = useDemInfoContext()

  const data = context?.data
  const upsert = context?.upsert

  const fetchDemInfo = useCallback(
    pointIds => {
      if (!data || !upsert) return
      if (!pointIds || pointIds.length === 0) return

      // Filter out IDs that are already in cache OR have been requested
      const uncached = pointIds.filter(id => !data.demInfoById?.hasOwnProperty(id) && !requestedById[id])
      if (uncached.length === 0) return

      // Mark these IDs as requested (across all hook instances)
      uncached.forEach(id => (requestedById[id] = true))

      window.socket.emit('get-dem-info', uncached, demInfo => {
        if (demInfo) {
          upsert({ demInfoById: demInfo })
        }
      })
    },
    [data?.demInfoById, upsert]
  )

  return fetchDemInfo
}
