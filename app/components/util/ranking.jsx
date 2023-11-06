import React, { useEffect } from 'react'
import { useState } from 'react'

export default function Ranking(rankingProps) {
  let [response, setResponse] = useState('')

  const displayPropOptions = ['block', 'small', 'medium', 'large']
  const { className, onSelect, ...otherProps } = rankingProps

  //Define new and inherited classes
  let classes = ['radial_ranking', ...(className ? className : [])]

  displayPropOptions.forEach(prop => {
    if (otherProps[prop]) {
      classes.push(prop)
      delete otherProps[prop]
    }
  })

  const onSelectionChange = e => {
    setResponse(e.target.value)
    if (!onSelect) {
      console.warn(`Unhandled rank selection: ${e.target.value}. Please pass a handler function via the onSelect prop.`)
    } else {
      onSelect(e)
    }
  }

  return (
    <div data-value={response} className={classes.join(' ')} onChange={onSelectionChange} {...otherProps}>
      <input type="radio" id="rankingMost" value="Most" name="importance"></input>
      <label htmlFor="rankingMost">Most</label>
      <input type="radio" id="rankingNeutral" value="Neutral" name="importance"></input>
      <label htmlFor="rankingNeutral">Neutral</label>
      <input type="radio" id="rankingLeast" value="Least" name="importance"></input>
      <label htmlFor="rankingLeast">Least</label>
    </div>
  )
}
