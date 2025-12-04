// https://github.com/EnCiv/civil-pursuit/issues/137
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
import React, { useState, useEffect, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { PrimaryButton, SecondaryButton } from './button'
import Intermission_Icon from '../svgr/intermission-icon'
import StatusBox from '../components/status-box'
import DeliberationContext, { useLocalStorageIfAvailable } from './deliberation-context'
import * as LocalStorageManager from '../lib/local-storage-manager'

// needs to be static because it used as a dependency in useEffect
const goToEnCiv = () => location.pushState('https://enciv.org/')

const Intermission = props => {
  const { className = '', onDone = () => {}, round } = props
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useContext(DeliberationContext)
  const { lastRound, dturn, uInfo = {}, discussionId, user, userId } = data
  const { finalRound } = dturn || {}
  const storageAvailable = useLocalStorageIfAvailable()

  const [validationError, setValidationError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  function setUserInfo(email, callback) {
    window.socket.emit('set-user-info', { email: email }, callback)
  }

  // Handle batch upsert for temporary users at Round 1 completion (full round data)
  const handleBatchUpsert = emailAddress => {
    setIsProcessing(true)
    setValidationError('')
    setSuccessMessage('')

    // Filter pointById to only include user's own points (matching userId or 'unknown')
    const myPointById = Object.fromEntries(Object.entries(data.pointById || {}).filter(([id, point]) => point.userId === userId || point.userId === 'unknown'))

    // Use data from context (which may be synced from localStorage)
    const batchData = {
      discussionId,
      round,
      email: emailAddress,
      data: {
        myPointById, // Only user's points (filtered from pointById)
        myWhyByCategoryByParentId: data.myWhyByCategoryByParentId || {},
        postRankByParentId: data.postRankByParentId || {},
        whyRankByParentId: data.whyRankByParentId || {},
        // groupIdsLists and idRanks: undefined means not done yet, [] means done but empty
        groupIdsLists: data.groupIdsLists,
        jsformData: data.jsformData || {},
        idRanks: data.roundCompleteData?.[round]?.idRanks, // Pre-calculated from rerank step
      },
    }

    // Call batch-upsert API
    window.socket.emit('batch-upsert-deliberation-data', batchData, response => {
      setIsProcessing(false)
      if (!response || response.error) {
        setValidationError(response?.error || 'Failed to save data. Please try again.')
      } else {
        // Success - update local points that had 'unknown' userId to actual userId
        if (userId) {
          const updatedPointById = {}
          for (const [id, point] of Object.entries(data.pointById || {})) {
            if (point.userId === 'unknown') {
              updatedPointById[id] = { ...point, userId }
            }
          }
          if (Object.keys(updatedPointById).length > 0) {
            upsert({ pointById: updatedPointById })
          }
        }
        // Clear localStorage for completed round if available
        if (storageAvailable) {
          LocalStorageManager.clear(discussionId, userId, round)
        }
        setSuccessMessage(`Success! Your data has been saved and we've sent a password email to ${emailAddress}.`)
        // Reload page to get updated user info with email (skip in test environment)
        if (!window.location.href.includes('iframe.html?viewMode=story')) {
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      }
    })
  }

  // Handle batch upsert for temporary users who only completed the Answer step
  // (not enough participants to continue, so round is not complete)
  const handleBatchUpsertAnswer = emailAddress => {
    setIsProcessing(true)
    setValidationError('')
    setSuccessMessage('')

    // Filter pointById to only include user's own points (matching userId or 'unknown')
    const myPointById = Object.fromEntries(Object.entries(data.pointById || {}).filter(([id, point]) => point.userId === userId || point.userId === 'unknown'))

    // Only include answer data (myPointById and myWhyByCategoryByParentId)
    const batchData = {
      discussionId,
      round,
      email: emailAddress,
      data: {
        myPointById, // Only user's points (filtered from pointById)
        myWhyByCategoryByParentId: data.myWhyByCategoryByParentId || {},
      },
    }

    // Call batch-upsert API
    window.socket.emit('batch-upsert-deliberation-data', batchData, response => {
      setIsProcessing(false)
      if (!response || response.error) {
        setValidationError(response?.error || 'Failed to save data. Please try again.')
      } else {
        // Success - update local points that had 'unknown' userId to actual userId
        if (userId) {
          const updatedPointById = {}
          for (const [id, point] of Object.entries(data.pointById || {})) {
            if (point.userId === 'unknown') {
              updatedPointById[id] = { ...point, userId }
            }
          }
          if (Object.keys(updatedPointById).length > 0) {
            upsert({ pointById: updatedPointById })
          }
        }
        // Clear localStorage for completed round if available
        if (storageAvailable) {
          LocalStorageManager.clear(discussionId, userId, round)
        }
        setSuccessMessage(`Success! Your answer has been saved and we've sent a password email to ${emailAddress}. We'll invite you back when more participants join.`)
        // Reload page to get updated user info with email (skip in test environment)
        if (!window.location.href.includes('iframe.html?viewMode=story')) {
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      }
    })
  }

  const handleEmail = () => {
    setValidationError('')
    setSuccessMessage('')
    if (!validateEmail(email)) {
      setValidationError('email address not valid')
      return
    }

    // Check if this is a temporary user (has id but no email)
    const isTemporaryUser = user?.id && !user?.email
    const isRound1Complete = round === 0 && uInfo[round]?.finished

    if (isTemporaryUser && isRound1Complete) {
      // Use batch-upsert flow for temporary users with complete round
      handleBatchUpsert(email)
    } else if (isTemporaryUser && round === 0 && !uInfo[round]?.finished) {
      // Use batch-upsert for answer-only data when round not complete (early user flow)
      handleBatchUpsertAnswer(email)
    } else {
      // Use existing flow for authenticated users or other scenarios
      setUserInfo(email, response => {
        if (response.error) {
          setValidationError(response.error)
        } else {
          window.socket.emit('send-password', email, window.location.pathname, response => {
            if (response && response.error) {
              let { error } = response

              if (error === 'User not found') {
                error = 'Email not found'
              }
              setValidationError(error)
            } else {
              setSuccessMessage('Success, an email has been sent to ' + email + '. Please check your inbox and follow the instructions to continue.')
            }
          })
        }
      })
    }
  }

  const roundCompleted = uInfo[round]?.finished
  const userIsRegistered = !!user?.email
  const nextRoundAvailable = round < lastRound
  const allRoundsCompleted = roundCompleted && round >= finalRound
  const conclusionAvailable = data.topPointAndWhys

  useEffect(() => {
    if (!conclusionAvailable && allRoundsCompleted && userIsRegistered) {
      window.socket.emit('get-conclusion', data.discussionId, topPointAndWhys => {
        if (topPointAndWhys) upsert({ topPointAndWhys })
      })
    }
  }, [allRoundsCompleted])

  let valid
  let onNext
  let conditionalResponse
  if (conclusionAvailable) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Great! You have completed the deliberation, and the conclusion is ready!</div>
      </>
    )
    valid = true
    onNext = null
  } else if (!userIsRegistered) {
    const isTemporaryUser = user?.id && !user?.email
    const isRound1Complete = round === 0 && roundCompleted
    const promptMessage =
      isTemporaryUser && isRound1Complete
        ? "Great! You've completed Round 1. Please provide your email to save your progress and continue to the next round."
        : 'Great! To continue we need to be able to invite you back. So now is the last change to associate your email with this discussion'

    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>{promptMessage}</div>
        {isProcessing ? (
          <StatusBox className={classes.infoMessage} status="notice" subject="Processing your responses..." />
        ) : (
          <>
            <input type="text" className={classes.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Please provide your email" disabled={isProcessing} />
            <div className={classes.buttonContainer}>
              <PrimaryButton onClick={handleEmail} title="Invite me back" disabled={isProcessing} disableOnClick={false}>
                {isTemporaryUser && isRound1Complete ? 'Save and Continue' : 'Invite me back'}
              </PrimaryButton>
            </div>
          </>
        )}
        {successMessage && <StatusBox className={classes.successMessage} status="done" subject={successMessage} />}
        {validationError && <StatusBox className={classes.errorMessage} status="error" subject={validationError} />}
      </>
    )
    valid = false
  } else if (allRoundsCompleted) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Wonderful, that concludes this deliberation. We will notify you when the conclusion is ready.</div>
      </>
    )
    valid = true
    onNext = goToEnCiv
  } else if (!roundCompleted) {
    if (round === 0)
      conditionalResponse = (
        <>
          <div className={classes.headlineSmall}>
            Great! You've answered the question, when we get responses from {(data?.dturn?.group_size || 10) * 2 - 1 - (data.participants || 1)} more people, we will invite you back to continue this round. Please feel free to invite others
            to join this discussion, just share this link{' '}
            <span
              role="button"
              tabIndex={0}
              onClick={async () => {
                const href = window.location.href
                try {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(href)
                  } else {
                    const ta = document.createElement('textarea')
                    ta.value = href
                    ta.style.position = 'fixed'
                    ta.style.opacity = '0'
                    document.body.appendChild(ta)
                    ta.select()
                    document.execCommand('copy')
                    document.body.removeChild(ta)
                  }
                  setCopied(true)
                  setTimeout(() => setCopied(false), 4000)
                } catch (e) {
                  // ignore copy failures
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.currentTarget.click()
                }
              }}
              className={classes.hrefspan}
            >
              {window.location.href}
              {copied && <span className={classes.copiedPopup}>Copied</span>}
            </span>{' '}
            with them.
          </div>
        </>
      )
    else conditionalResponse = <div className={classes.headlineSmall}>There are not enough responses yet to proceed with round {round + 1}. When we hear from more people, we will invite you back to continue the deliberation.</div>
    valid = false
    onNext = goToEnCiv
  } else if (nextRoundAvailable) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Would you like to continue onto Round {round + 1 + 1}, or come back tomorrow? Sometimes it’s good to take a break and come back with fresh eyes. We will send you an email reminder</div>
        <div className={classes.buttonContainer}>
          <PrimaryButton title="Yes, Continue" disabled={false} disableOnClick={false} onClick={() => onDone({ valid: true, value: 'continue' })}>
            Yes, Continue
          </PrimaryButton>
          <SecondaryButton title="Remind Me Later" disabled={false} disableOnClick={false} onClick={() => setSuccessMessage('We will send you a reminder email tomorrow')}>
            Remind Me Later
          </SecondaryButton>
        </div>
        {successMessage && <StatusBox className={classes.successMessage} status="done" subject={successMessage} />}
      </>
    )
    if (successMessage) {
      valid = true
      onNext = goToEnCiv
    } else valid = false
  } else {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>{`Great you've completed Round ${round + 1}, we will send you an invite to continue the discussion after more people have made it this far.`}</div>
      </>
    )
    valid = true
    onNext = goToEnCiv
  }

  useEffect(() => {
    onDone({ valid, value: 'continue', onNext })
  }, [valid, onNext])
  return (
    <div className={cx(classes.intermission, className)}>
      <div className={classes.iconContainer}>
        <Intermission_Icon className={classes.icon} />
      </div>
      {conditionalResponse}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  iconContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  icon: {
    width: '3.125rem',
    height: '2.89rem',
  },
  intermission: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gap: '6rem',
      width: '100%',
    },
  },
  headline: {
    fontFamily: 'Inter',
    fontWeight: 300,
    fontSize: '2.25rem',
    lineHeight: '2.9375rem',
    color: theme.colors.primaryButtonBlue,
    textAlign: 'left',
  },
  headlineSmall: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '1.25rem',
    lineHeight: '1.875rem',
    color: theme.colors.disableTextBlack,
    textAlign: 'left !important',
  },
  input: {
    width: '100%',
    maxWidth: theme.colors.condensedWidthBreakPoint,
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '0.25rem',
    border: '0.0625rem solid #ccc',
    boxSizing: 'border-box',
  },
  text: {
    fontWeight: '400',
    fontFamily: 'Inter',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.title,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  hrefspan: {
    color: 'purple',
    fontWeight: 600,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  },
  copiedPopup: {
    position: 'absolute',
    left: '50%',
    bottom: '100%',
    transform: 'translateX(-50%)',
    marginBottom: '0.25rem',
    background: theme.colors.primaryButtonBlue,
    color: theme.colors.white,
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 1000,
    whiteSpace: 'nowrap',
  },
  infoMessage: {
    marginTop: '1rem',
  },
  successMessage: {
    marginTop: '1rem',
  },
  errorMessage: {
    marginTop: '1rem',
  },
}))

export default Intermission
