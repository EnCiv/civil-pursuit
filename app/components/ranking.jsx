// https://github.com/EnCiv/civil-pursuit/issues/255
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import theme from './theme'

const responseOptions = ['Most', 'Neutral', 'Least']

const optionColors = {
  Most: '#71947A',
  Neutral: theme.colors.primaryButtonBlue,
  Least: '#B77973',
}

const selectedOption = color => (
  <>
    <rect x="1" y="1" width="22" height="22" rx="11" stroke={color} strokeWidth="2" />
    <rect x="6" y="6" width="12" height="12" rx="6" fill={color} />
  </>
)

const unselectedOption = <rect x="1" y="1" width="22" height="22" rx="11" stroke={theme.colors.radioButtonUnselected} strokeWidth="2" />

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
        const optionStyle = option.toLowerCase()
        return (
          <div
            key={option}
            role="radio"
            aria-checked={isSelected}
            tabIndex={disabled ? -1 : 0} // each one is tab‑focusable
            onClick={() => handleSelect(option)}
            onKeyDown={e => onKeyDown(e, option)}
            className={cx(styleClasses.radioOption, isSelected && styleClasses.selected, isSelected && styleClasses[`${optionStyle}Selected`])}
          >
            <svg className={styleClasses.optionIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {isSelected ? selectedOption(optionColors[option]) : unselectedOption}
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
    height: '1.25rem',
    width: '1.25rem',
    flexShrink: 0,
  },
  labelText: {
    color: 'inherit',
    lineHeight: 1.25,
    fontSize: '0.9375rem',
    fontWeight: 600,
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
  },
  group: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    gap: '0.625rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      '& > [role="radio"]': {
        flex: '1 1 calc(50% - 0.3125rem)',
      },
      '& > [role="radio"]:nth-child(1)': { order: 1 },
      '& > [role="radio"]:nth-child(2)': { order: 3 },
      '& > [role="radio"]:nth-child(3)': { order: 2 },
    },
  },
  disabled: {
    opacity: 0.55,
    pointerEvents: 'none',
  },

  radioOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 7rem',
    minWidth: 0,
    minHeight: '3.25rem',
    boxSizing: 'border-box',
    gap: '0.5rem',
    padding: '0.625rem 0.75rem',
    border: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    borderRadius: '9999px',
    backgroundColor: theme.colors.white,
    color: theme.colors.title,
    boxShadow: '0 0.125rem 0 rgba(26, 26, 26, 0.06), 0 0.3rem 0.65rem rgba(6, 51, 92, 0.08), inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease, border-color 150ms ease',
    '&:hover:not([aria-checked="true"])': {
      borderColor: theme.colors.primaryButtonBlue,
      transform: 'translateY(-0.0625rem)',
      boxShadow: '0 0.2rem 0 rgba(26, 26, 26, 0.06), 0 0.45rem 0.8rem rgba(6, 51, 92, 0.12)',
    },
    '&:active': {
      transform: 'translateY(0.0625rem)',
    },
    '&:focus-visible': {
      outline: theme.focusOutline,
      outlineOffset: '0.125rem',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover, &:active': {
        transform: 'none',
      },
    },
  },
  selected: {
    boxShadow: '0 0.125rem 0 rgba(26, 26, 26, 0.08), 0 0.4rem 0.8rem rgba(6, 51, 92, 0.12), inset 0 0.0625rem 0 rgba(255, 255, 255, 0.55)',
  },
  mostSelected: {
    borderColor: '#D5E2D7',
    backgroundColor: '#F5F9F5',
    color: '#4E7056',
  },
  neutralSelected: {
    borderColor: theme.colors.primaryButtonBlue,
    backgroundColor: theme.colors.lightBlueBackground,
    color: theme.colors.primaryButtonBlue,
  },
  leastSelected: {
    borderColor: '#EBD5D2',
    backgroundColor: '#FCF6F5',
    color: '#925C57',
  },
}))
