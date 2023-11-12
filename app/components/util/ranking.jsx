import React, { useState } from 'react'

export default function Ranking(rankingProps) {
  const responseOptions = ['Most', 'Neutral', 'Least']
  const displayPropOptions = ['block', 'small', 'medium', 'large']

  //Define new and inherited classes
  let classes = ['radial_ranking', ...(className ? className : [])]

  //Isolate props and set initial state
  const { disabled, defaultValue, className, onSelect, ...otherProps } = rankingProps
  let [response, setResponse] = useState(responseOptions.includes(defaultValue) ? defaultValue : '')

  displayPropOptions.forEach(prop => {
    if (otherProps[prop]) {
      classes.push(prop)
      delete otherProps[prop]
    }
  })

  const onSelectionChange = e => {
    if (!e.target.disabled) {
      setResponse(e.target.value)
    }
    if (!onSelect) {
      return console.warn(
        `Unhandled rank selection: ${e.target.value}. Please pass a handler function via the onSelect prop.`
      )
    }
    onSelect(e)
  }

  return (
    <div data-value={response} className={classes.join(' ')} onChange={onSelectionChange} {...otherProps}>
      {responseOptions.map(option => {
        return (
          <div>
            <input
              disabled={disabled || false}
              checked={response === option}
              type="radio"
              id={`ranking${option}`}
              value={option}
              name="importance"
            ></input>
            <label htmlFor={`ranking${option}`}>{option}</label>
          </div>
        )
      })}
    </div>
  )
}
