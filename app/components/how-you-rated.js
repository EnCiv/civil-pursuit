// https://github.com/EnCiv/civil-pursuit/issues/[ISSUE_NUMBER]

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PointMatrix from './point-matrix'

function HowYouRated(props) {
  const { className, entries = [], defaultSelectedRound = 0, onRoundChange, ...otherProps } = props
  const classes = useStylesFromThemeFunction()
  const [selectedRound, setSelectedRound] = useState(defaultSelectedRound)

  // Derive rounds from entries - assume entries is array of rounds
  const rounds = Array.isArray(entries) ? entries : []
  const currentRoundEntries = rounds[selectedRound] || []

  const handleRoundChange = newRound => {
    setSelectedRound(newRound)
    onRoundChange?.(newRound)
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.titleRow}>
        <h2 className={classes.title}>How you rated other participant's response</h2>
      </div>

      <div className={classes.controlRow}>
        <span className={classes.viewLabel}>View</span>
        <select className={classes.roundDropdown} value={selectedRound} onChange={e => handleRoundChange(parseInt(e.target.value))}>
          {rounds.map((round, idx) => (
            <option key={idx} value={idx}>
              Round {idx + 1}
            </option>
          ))}
        </select>
      </div>

      {currentRoundEntries.length > 0 ? <PointMatrix entries={currentRoundEntries} /> : <div className={classes.emptyState}>No responses to display</div>}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    ...theme.font,
    fontSize: '1.5rem',
    fontWeight: '600',
    lineHeight: '2rem',
    color: '#1A1A1A',
    margin: 0,
  },
  controlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6875rem',
    marginBottom: '1rem',
  },
  viewLabel: {
    ...theme.font,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: '#5D5D5C',
  },
  roundDropdown: {
    ...theme.font,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: '#343433',
    padding: '0.3125rem 0.625rem 0.3125rem 0.9375rem',
    width: '7.5rem',
    height: '2.5rem',
    backgroundColor: '#FFFFFF',
    border: '2px solid #EBEBEB',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    '&:hover': {
      borderColor: theme.colors.encivBlue,
    },
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.encivBlue,
    },
  },
  emptyState: {
    ...theme.font,
    fontSize: '1rem',
    color: theme.colors.textSecondary,
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#fafafa',
    borderRadius: '0.5rem',
    border: `1px solid ${theme.colors.borderGray}`,
  },
}))

export default HowYouRated
