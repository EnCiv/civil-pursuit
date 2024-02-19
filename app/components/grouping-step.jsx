// https://github.com/EnCiv/civil-pursuit/issue/49
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export default function GroupingStep(props) {
  const { className, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  return (
    <div className={cx(classes.wrapper, className)} {...props}>
      <p>Hello World</p>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {},
}))
