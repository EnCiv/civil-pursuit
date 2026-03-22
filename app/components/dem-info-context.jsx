import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import setOrDeleteByMutatePath from '../lib/set-or-delete-by-mutate-path'

export const DemInfoContext = createContext({})
export default DemInfoContext

export function DemInfoProvider(props) {
  const { demInfoProviderDefault = {} } = props
  const [data, setData] = useState(() => ({ ...demInfoProviderDefault }))

  // Mutable object to track which pointIds have been requested
  // Prevents redundant fetches within this context instance
  const requestedById = useRef({}).current

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
  // if default props change, upsert changed props into context
  const prev = useRef(demInfoProviderDefault)
  useEffect(() => {
    let changed = false
    const changedProps = Object.entries(demInfoProviderDefault).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = v
        changed = true
      }
      return ps
    }, {})
    if (changed) {
      upsert(changedProps)
    }
    prev.current = { ...demInfoProviderDefault }
  }, [...Object.values(demInfoProviderDefault)])

  return <DemInfoContext.Provider value={{ data, upsert, requestedById }}>{props.children}</DemInfoContext.Provider>
}

export function useDemInfoContext() {
  const ctx = React.useContext(DemInfoContext)
  return ctx || null
}
