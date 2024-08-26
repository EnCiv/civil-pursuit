import React, { createContext, useCallback, useState } from 'react'
export const DeliberationContext = createContext({})
import { merge } from 'lodash'

export function DeliberationContextProvider(props) {
  const [data, setData] = useState({})
  const upsert = useCallback(
    obj => {
      setData(data => {
        return { ...merge(data, obj) } // spread because we need to return a new reference
      })
    },
    [setData]
  )
  return <DeliberationContext.Provider value={{ data, upsert }}>{props.children}</DeliberationContext.Provider>
}
