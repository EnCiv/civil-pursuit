//https://github.com/EnCiv/civil-pursuit/issues/62
import React from 'react'
import { createUseStyles } from 'react-jss'
import { Button } from './button'
import cx from 'classnames'

const responseOptions = ['Awesome!', 'Just Okay', 'Unsatisfied']
export default function HowDoYouFeel(props) {
  const { disabled = false, className, onDone, title = 'How do you feel about it', ...otherProps } = props
  const styleClasses = rankingStyleClasses(props)

  return (
    <div className={cx(styleClasses.wrapper, className)} {...otherProps}>
      <p className={styleClasses.textStyle}>{title}</p>
      <div className={styleClasses.group}>
        {responseOptions.map(option => (
          <label key={option}>
            <Button title={option} onDone={onDone} value={option} className={styleClasses.option}>
              {option}
            </Button>
          </label>
        ))}
      </div>
    </div>
  )
}
const rankingStyleClasses = createUseStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    flexWrap: 'wrap',
  },

  textStyle: {
    fontSize: '2.4rem',
    fontWeight: 'normal',
    margin: 0,
  },

  group: {
    display: 'flex',
    gap: '1.4375rem',
  },

  option: {
    backgroundColor: theme.colors.white,
    color: theme.colors.primaryButtonBlue,
    border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,

    '&:disabled': {
      backgroundColor: theme.colors.white,
      color: theme.colors.disableGray,
      border: `0.125rem solid ${theme.colors.disableSecBorderGray}`,
      textDecoration: 'none',
      transition: 'none',
    },

    '&:hover, &.hover': {
      textDecoration: 'underline',
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.primaryButtonBlue,
    },

    '&:active': {
      backgroundColor: theme.colors.primaryButtonBlue,
      color: theme.colors.white,
      border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,
      textDecoration: 'none',
    },
  },
}))
