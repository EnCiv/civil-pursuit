// https://github.com/EnCiv/civil-pursuit/issues/255
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

const responseOptions = ['Most', 'Neutral', 'Least']

const selectedOption = (
  <>
    <rect x="1" y="1" width="22" height="22" rx="11" stroke="#08447B" strokeWidth="2" />
    <rect x="6" y="6" width="12" height="12" rx="6" fill="#08447B" />
  </>
)

const unselectedOption = <rect x="1" y="1" width="22" height="22" rx="11" stroke="#5D5D5C" strokeWidth="2" />

export default function Ranking(props) {
  const { disabled, defaultValue, className, onDone, ...otherProps } = props
  let [response, setResponse] = useState(responseOptions.includes(defaultValue) ? defaultValue : '')

  useEffect(() => {
    if (!defaultValue && !response) return // do not call onDone if initally empty, or if change to empty from above when it's already empty
    if (responseOptions.includes(defaultValue)) {
      setResponse(defaultValue)
      onDone && onDone({ valid: true, value: defaultValue })
    } else {
      setResponse('')
      onDone && onDone({ valid: false, value: '' })
    }
  }, [defaultValue])

  const styleClasses = rankingStyleClasses(props)

  const onSelectionChange = e => {
    if (e.target.disabled) return
    setResponse(e.target.value)
    onDone && onDone({ valid: true, value: e.target.value })
  }

  return (
    <div data-value={response} className={cx(className, styleClasses.group, disabled && styleClasses.disabled)} {...otherProps}>
      {responseOptions.map(option => {
        return (
          <label key={option}>
            <input disabled={disabled || false} checked={response === option} type="radio" value={option} name="ranking" className={styleClasses.hideDefaultRadio} onChange={onSelectionChange} />
            <span className={styleClasses.option}>
              <svg className={cx(styleClasses.optionIcon)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {response === option ? selectedOption : unselectedOption}
              </svg>
              {option}
            </span>
          </label>
        )
      })}
    </div>
  )
}

const rankingStyleClasses = createUseStyles(theme => ({
  optionIcon: {
    height: 'inherit',
    color: 'inherit',
    marginRight: '0.5rem',
    position: 'relative',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    height: '1.5rem',
    lineHeight: '1.5rem',
    fontWeight: '300',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  group: {
    display: 'flex',
    gap: '1.4375rem',
  },
  disabled: {
    opacity: '30%',
  },
  hideDefaultRadio: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,

    '&:focus-visible + span': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '2.5rem',
        height: '2.5rem',
        top: 0,
        left: 0,
        borderRadius: '50%',
        transform: 'translate(-20%, -20%)',
        backgroundColor: theme.colors.focusRing,
        pointerEvents: 'none',
        zIndex: -1,
      },
    },
  },
}))
