import React, { createContext, useCallback, useState } from 'react'
import setOrDeleteByMutatePath from '../lib/set-or-delete-by-mutate-path'

export const DemInfoContext = createContext({})
export default DemInfoContext

export function DemInfoProvider(props) {
  const { demInfoProviderDefault = {} } = props
  const [data, setData] = useState(() => ({ ...demInfoProviderDefault }))

  const upsert = useCallback(
    obj => {
      setData(data => {
        let messages = data._showUpsertDeltas ? [] : undefined
        let newData = setOrDeleteByMutatePath(data, obj, messages)
        if (messages) console.info('dem-info context update:', messages)
        // return new ref if changed
        return newData === data ? data : { ...newData }
      })
    },
    [setData]
  )

  return <DemInfoContext.Provider value={{ data, upsert }}>{props.children}</DemInfoContext.Provider>
}

export function useDemInfoContext() {
  const ctx = React.useContext(DemInfoContext)
  return ctx || null
}
