// https://github.com/EnCiv/civil-pursuit/issues/385

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { H, Level } from 'react-accessible-headings'
import PointMatrix from './point-matrix'

function HowYouRated(props) {
  const { className, entries = [], defaultSelectedRound = 0, onRoundChange, ...otherProps } = props
  const classes = useStylesFromThemeFunction()
  const [selectedRound, setSelectedRound] = useState(defaultSelectedRound)
  const roundSelectId = `how-you-rated-round-${React.useId().replace(/:/g, '')}`

  // Derive rounds from entries - assume entries is array of rounds
  const rounds = Array.isArray(entries) ? entries : []
  const currentRoundEntries = rounds[selectedRound] || []

  const handleRoundChange = newRound => {
    setSelectedRound(newRound)
    onRoundChange?.(newRound)
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <Level>
        <div className={classes.titleRow}>
          <H className={classes.title}>How you rated other participant's response</H>
        </div>

      <div className={classes.controlRow}>
        <label className={classes.viewLabel} htmlFor={roundSelectId}>View</label>
        <select id={roundSelectId} className={classes.roundDropdown} value={selectedRound} onChange={e => handleRoundChange(parseInt(e.target.value))}>
          {rounds.map((round, idx) => (
            <option key={idx} value={idx}>
              Round {idx + 1}
            </option>
          ))}
        </select>
      </div>

        {currentRoundEntries.length > 0 ? <PointMatrix entries={currentRoundEntries} /> : <div className={classes.emptyState}>No responses to display</div>}
      </Level>
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
    color: theme.colors.title,
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
    color: theme.colors.encivGray,
  },
  roundDropdown: {
    ...theme.font,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.disableTextBlack,
    padding: '0.3125rem 0.625rem 0.3125rem 0.9375rem',
    width: '7.5rem',
    height: '2.5rem',
    backgroundColor: theme.colors.white,
    border: `${theme.border.width.thick} solid ${theme.colors.borderGray}`,
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
    backgroundColor: theme.colors.veryLightGrayBackground,
    borderRadius: '0.5rem',
    border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
  },
}))

export default HowYouRated
