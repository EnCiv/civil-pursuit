'use strict'
import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

export default function DemInfo(props) {
  const { state, dob, party, className, vState, ...otherProps } = props // vState is passed to children of point group but shoundn't be passed to span
  const classes = useStylesFromThemeFunction()
  if (!(state && dob && party)) return null // if no data, render not

  const userState = state || ''
  const userAge = dob ? calculateAge(dob) : ''

  const userPoliticalParty = party || ''

  let contentText = ''
  if (userPoliticalParty && (userAge || userState)) {
    contentText += `${userPoliticalParty} | `
  } else if (userPoliticalParty) {
    contentText += `${userPoliticalParty}`
  }

  if (userAge && userState) {
    contentText += `${userAge}, ${userState}`
  } else if (userAge || userState) {
    contentText += userAge || userState
  }

  return (
    <span className={cx(classes.infoText, className)} {...otherProps}>
      {contentText}
    </span>
  )
}

/**
 * Calculate user age based on birthdate from User Schema
 * @param {String} birthdayStr
 * @return {Number} age (in years)
 */
function calculateAge(birthdayStr) {
  const birthday = new Date(birthdayStr)
  const today = new Date()
  let age = today.getFullYear() - birthday.getFullYear()
  const month = today.getMonth() - birthday.getMonth()

  if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
    age--
  }

  return age
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  infoText: {
    fontFamily: 'Inter',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5rem',
    letterSpacing: '0rem',
    textAlign: 'left',
    color: theme.colors.inputWordCount,
  },
}))
