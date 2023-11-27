import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

const responseOptions = ['Most', 'Neutral', 'Least']

const selectedOption = (
  <>
    <rect x="1" y="1" width="22" height="22" rx="11" stroke="#08447B" stroke-width="2" />
    <rect x="6" y="6" width="12" height="12" rx="6" fill="#08447B" />
  </>
)

const unselectedOption = <rect x="1" y="1" width="22" height="22" rx="11" stroke="#06335C" stroke-width="2" />
const rankingStyleClasses = createUseStyles({
  optionIcon: { height: 'inherit', color: 'inherit', marginRight: '0.125rem' },
  option: { display: 'flex', height: '1.5rem', lineHeight: '1.5rem', color: 'inherit' },
  group: { display: 'flex', gap: '1.4375rem' },
  disabled: { opacity: '30%' },
  hideDefaultRadio: { display: 'none !important' },
})

export default function Ranking(props) {
  //Isolate props and set initial state
  const { disabled, defaultValue, className, onSelected, ...otherProps } = props
  let [response, setResponse] = useState(responseOptions.includes(defaultValue) ? defaultValue : '')

  //Introduce component styling
  const styleClasses = rankingStyleClasses(props)

  const onSelectionChange = e => {
    if (e.target.disabled) {
      return
    }
    setResponse(e.target.value)
    if (!onSelected) {
      return console.warn(
        `Unhandled rank selection: ${e.target.value}. Please pass a handler function via the onSelected prop.`
      )
    }

    onSelected(e)
  }

  return (
    <div
      data-value={response}
      className={cx('radial-ranking', className, styleClasses.group, disabled ? styleClasses.disabled : [])}
      onChange={onSelectionChange}
      {...otherProps}
    >
      {responseOptions.map(option => {
        return (
          <div>
            <label>
              <input
                disabled={disabled || false}
                checked={response === option}
                type="radio"
                value={option}
                name={`importance-${option}`}
                className={cx(styleClasses.hideDefaultRadio, `ranking${option}`)}
              ></input>
              <span className={cx(styleClasses.option)}>
                <svg
                  className={cx(styleClasses.optionIcon)}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {response === option ? selectedOption : unselectedOption}
                </svg>
                {option}
              </span>
            </label>
          </div>
        )
      })}
    </div>
  )
}
