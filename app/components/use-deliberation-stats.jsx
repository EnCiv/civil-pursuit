// https://github.com/EnCiv/civil-pursuit/issues/221

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

const DeliberationStats = props => {
  const { className = '', status, ...otherProps } = props
  const classes = useStylesFromThemeFunction()

  if (!status) {
    return null
  }

  return (
    <div className={cx(classes.status, className)} {...otherProps}>
      {Object.entries(status).map(([key, value]) => (
        <div key={key} className={classes.statusItem}>
          <strong>{key}:</strong> {typeof value !== 'undefined' ? JSON.stringify(value, null, 2) : ''}
        </div>
      ))}
    </div>
  )
}

export const useDeliberationStats = discussionId => {
  const [status, setStatus] = useState(null)
  const classes = useStylesFromThemeFunction()

  const detectStatus = event => {
    window.socket.emit('get-discussion-status', discussionId, status => {
      if (!status) return
      setStatus(status)
    })
  }

  const InvisibleButton = props => {
    const { className = '', ...otherProps } = props
    return <div className={cx(classes.invisibleButtonInUpperRight, className)} onClick={detectStatus} {...otherProps} />
  }

  const Stats = props => <DeliberationStats status={status} {...props} />

  return [Stats, InvisibleButton]
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  status: {
    marginTop: '2rem',
    fontFamily: 'Inter',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: theme.colors.primaryButtonBlue,
  },
  statusItem: {
    marginBottom: '0.5rem',
  },
  invisibleButtonInUpperRight: {
    width: '1rem',
    height: '1rem',
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 0,
    top: 0,
    cursor: 'pointer',
  },
}))

export default useDeliberationStats
