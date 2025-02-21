// https://github.com/EnCiv/civil-pursuit/issues/255
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import theme from './theme'

const responseOptions = ['Most', 'Neutral', 'Least']

const selectedOption = (
  <>
    <rect x="1" y="1" width="22" height="22" rx="11" stroke={theme.colors.darkBlue} strokeWidth="2" />
    <rect x="6" y="6" width="12" height="12" rx="6" fill={theme.colors.darkBlue} />
  </>
)

const unselectedOption = <rect x="1" y="1" width="22" height="22" rx="11" stroke={theme.colors.encivGray} strokeWidth="2" />

export default function Ranking(props) {
  const { disabled, defaultValue, className, onDone, ...otherProps } = props
  const [response, setResponse] = useState(responseOptions.includes(defaultValue) ? defaultValue : '')

  useEffect(() => {
    if (!defaultValue && !response) return // do not call onDone if initally empty, or if change to empty from above when it's already empty
    if (responseOptions.includes(defaultValue)) {
      setResponse(defaultValue)
      onDone?.({ valid: true, value: defaultValue })
    } else {
      setResponse('')
      onDone?.({ valid: false, value: '' })
    }
  }, [defaultValue])

  const styleClasses = rankingStyleClasses(props)

  const handleSelect = value => {
    if (disabled) return
    setResponse(value)
    onDone?.({ valid: true, value })
  }

  // handler for Space or Enter to select
  const onKeyDown = (e, option) => {
    if (disabled) return
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleSelect(option)
    }
  }

  return (
    <div role="radiogroup" aria-disabled={disabled || undefined} data-value={response} className={cx(className, styleClasses.group, disabled && styleClasses.disabled)} {...otherProps}>
      {responseOptions.map(option => {
        const isSelected = response === option
        return (
          <div
            key={option}
            role="radio"
            aria-checked={isSelected}
            tabIndex={disabled ? -1 : 0} // each one is tab‑focusable
            onClick={() => handleSelect(option)}
            onKeyDown={e => onKeyDown(e, option)}
            className={cx(styleClasses.radioOption, isSelected && styleClasses.selected)}
          >
            <svg className={styleClasses.optionIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {isSelected ? selectedOption : unselectedOption}
            </svg>
            <span className={styleClasses.labelText}>{option}</span>
          </div>
        )
      })}
    </div>
  )
}

const rankingStyleClasses = createUseStyles(theme => ({
  optionIcon: {
    height: '1.5rem',
    width: '1.5rem',
    marginRight: '0.5rem',
    flexShrink: 0,
  },
  labelText: {
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

  radioOption: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    outline: 'none',
    '&:focus-visible': {
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
