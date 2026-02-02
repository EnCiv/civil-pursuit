// https://github.com/EnCiv/civil-pursuit/issues/137
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { PrimaryButton, SecondaryButton } from './button'
import Intermission_Icon from '../svgr/intermission-icon'
import StatusBox from '../components/status-box'
import ShareButtons from './share-buttons'
import { useDeliberationContext, useLocalStorageIfAvailable } from './deliberation-context'
import * as LocalStorageManager from '../lib/local-storage-manager'
import { authenticateSocketIo } from 'civil-client/dist/components/use-auth'

// needs to be static because it used as a dependency in useEffect
const goToEnCiv = () => (location.href = 'https://enciv.org/')

const Intermission = props => {
  const { className = '', onDone = () => {}, round } = props
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useDeliberationContext()
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

  /**
   * Common batch upsert logic for temporary users
   * Uses HTTP route instead of socket API so the cookie can be updated with email
   *
   * - `emailAddress` - The user's email address
   * - `dataToSave` - Object containing the data fields to save (myPointById, myWhyByCategoryByParentId, etc.)
   * - `successMsg` - Success message to display after successful save
   */
  const doBatchUpsert = async (emailAddress, dataToSave, successMsg) => {
    setIsProcessing(true)
    setValidationError('')
    setSuccessMessage('')

    const batchData = {
      discussionId,
      round,
      email: emailAddress,
      data: dataToSave,
    }

    try {
      // Call batch-upsert HTTP route (allows cookie update)
      const response = await fetch('/api/batch-upsert-deliberation-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData),
        credentials: 'include', // Include cookies in request
      })
      const result = await response.json()
      setIsProcessing(false)
      if (!response.ok || result.error) {
        setValidationError(result?.error || 'Failed to save data. Please try again.')
      } else {
        // Success - update user in context with email
        const update = { user: { ...user, email: emailAddress } }
        // Update local points that had 'unknown' userId to actual userId
        if (userId) {
          for (const [id, point] of Object.entries(data.pointById || {})) {
            if (point.userId === 'unknown') {
              if (!update.pointById) update.pointById = {}
              update.pointById[id] = { ...point, userId }
            }
          }
        }
        update.uInfo = { [round]: { finished: true } } // only after the batch upsert is successful mark the round as finished
        upsert(update)
        // Clear localStorage for completed round if available
        if (storageAvailable) {
          LocalStorageManager.clear(discussionId, userId, round)
        }
        setSuccessMessage(successMsg)
        // Reconnect socket to get updated authentication with email in cookie
        authenticateSocketIo()
      }
    } catch (error) {
      setIsProcessing(false)
      console.error('batch-upsert fetch error:', error)
      setValidationError('Failed to save data. Please try again.')
    }
  }

  // Handle batch upsert for temporary users at Round 1 completion (full round data)
  const handleBatchUpsert = async emailAddress => {
    // Filter pointById to only include user's own points (matching userId or 'unknown')
    const myPointById = Object.fromEntries(Object.entries(data.pointById || {}).filter(([id, point]) => point.userId === userId || point.userId === 'unknown'))
    if (Object.keys(myPointById).length === 0) {
      console.log('No user points to save, skipping batch upsert')
      return
    }
    // Use data from context (which may be synced from localStorage)
    const dataToSave = {
      myPointById, // Only user's points (filtered from pointById)
      myWhyByCategoryByParentId: data.myWhyByCategoryByParentId || {},
      preRankByParentId: data.preRankByParentId || {}, // Initial rankings with 'pre' category
      postRankByParentId: data.postRankByParentId || {},
      whyRankByParentId: data.whyRankByParentId || {},
      // groupIdsLists and idRanks: undefined means not done yet, [] means done but empty
      groupIdsLists: data.groupIdsLists,
      jsformData: data.jsformData || {},
      idRanks: data.roundCompleteData?.[round]?.idRanks, // Pre-calculated from rerank step
    }

    await doBatchUpsert(emailAddress, dataToSave, `Success! Your data has been saved and we've sent a password reset email to ${emailAddress}.`)
  }

  // Handle batch upsert for temporary users who only completed the Answer step
  // (not enough participants to continue, so round is not complete)
  const handleBatchUpsertAnswer = async emailAddress => {
    // Filter pointById to only include user's own points (matching userId or 'unknown')
    const myPointById = Object.fromEntries(Object.entries(data.pointById || {}).filter(([id, point]) => point.userId === userId || point.userId === 'unknown'))
    if (Object.keys(myPointById).length === 0) {
      console.log('No user points to save, skipping batch upsert')
      return
    }

    // Only include answer data (myPointById and myWhyByCategoryByParentId)
    const dataToSave = {
      myPointById, // Only user's points (filtered from pointById)
      myWhyByCategoryByParentId: data.myWhyByCategoryByParentId || {},
    }

    await doBatchUpsert(emailAddress, dataToSave, `Success! Your answer has been saved and we've sent a password reset email to ${emailAddress}. We'll invite you back when more participants join.`)
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
    const isRound1Complete = round === 0 && data.roundCompleteData?.[0]?.idRanks // roundCompleteData[0].idRanks being defined means round 1 is complete

    if (isTemporaryUser && isRound1Complete) {
      // Use batch-upsert flow for temporary users with complete round
      handleBatchUpsert(email)
    } else if (isTemporaryUser && round === 0 && !data.roundCompleteData?.[0]?.idRanks) {
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

  const roundCompleted = data.roundCompleteData?.[round]?.idRanks !== undefined
  const userIsRegistered = !!user?.email
  const nextRoundAvailable = round < lastRound
  const allRoundsCompleted = roundCompleted && round >= finalRound
  const conclusionAvailable = data.topPointAndWhys
  const isTemporaryUser = user?.id && !user?.email
  const isRound1Complete = round === 0 && roundCompleted

  useEffect(() => {
    if (!conclusionAvailable && allRoundsCompleted && userIsRegistered) {
      window.socket.emit('get-conclusion', data.discussionId, topPointAndWhys => {
        if (topPointAndWhys) upsert({ topPointAndWhys })
      })
    }
  }, [allRoundsCompleted])

  // the ref of the object the user's answer is stored in will change when they edit their answer
  // this is built around there being only one answer per user per round. When that changes we need to revisit this
  const myPoint = round === 0 && Object.entries(data.pointById || {}).filter(([id, point]) => point.userId === userId || point.userId === 'unknown')[0]
  // Save answer data for registered users when round is not complete
  // This handles the case where a user with email returns, edits their answer, and arrives at intermission
  useEffect(() => {
    if (myPoint && userIsRegistered && !roundCompleted && round === 0) {
      // Filter pointById to only include user's own points
      const myPointById = { [myPoint._id]: myPoint }

      // Only save if there's data to save
      if (Object.keys(myPointById).length > 0) {
        const batchData = {
          discussionId,
          round,
          email: user.email,
          data: {
            myPointById,
            myWhyByCategoryByParentId: data.myWhyByCategoryByParentId || {},
          },
        }

        window.socket.emit('batch-upsert-deliberation-data', batchData, result => {
          if (result?.error) {
            console.error('Failed to save answer data:', result.error)
          }
        })
      }
    }
  }, [myPoint, data.myWhyByCategoryByParentId]) // only do this on mount or the data changes - if userIsRegistered changes (from not registered to registered) the batch upsert was done when they assigned their email

  const handleCopyLink = async () => {
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
  }

  let valid
  let onNext
  let conditionalResponse
  if (conclusionAvailable) {
    conditionalResponse = <div className={classes.headlineSmall}>Great! You have completed the deliberation, and the conclusion is ready!</div>
    valid = true
    onNext = null
  } else if (isTemporaryUser && isRound1Complete) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Great! You've completed Round 1. Please provide your email to save your progress and continue to the next round.</div>
        {isProcessing ? (
          <StatusBox className={classes.infoMessage} status="notice" subject="Processing your responses..." />
        ) : (
          <>
            <input type="text" className={classes.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Please provide your email" disabled={isProcessing} />
            <div className={classes.buttonContainer}>
              <PrimaryButton onClick={handleEmail} title="Save and Continue" disabled={isProcessing} disableOnClick={false}>
                Save and Continue
              </PrimaryButton>
            </div>
          </>
        )}
      </>
    )
    valid = false
  } else if (isTemporaryUser && !isRound1Complete) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Great! You've answered the question. To continue we need to be able to invite you back. So now is the last change to associate your email with this discussion.</div>
        {isProcessing ? (
          <StatusBox className={classes.infoMessage} status="notice" subject="Processing your responses..." />
        ) : (
          <>
            <input type="text" className={classes.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Please provide your email" disabled={isProcessing} />
            <div className={classes.buttonContainer}>
              <PrimaryButton onClick={handleEmail} title="Invite me back" disabled={isProcessing} disableOnClick={false}>
                Invite me back
              </PrimaryButton>
            </div>
          </>
        )}
      </>
    )
    valid = false
  } else if (allRoundsCompleted) {
    conditionalResponse = (
      <div className={classes.headlineSmall}>
        Wonderful, you've completed all the rounds of this deliberation. We will notify you when the conclusion is ready. Please feel free to share this discussion with others.
        <ShareButtons url={window.location.href} subject={data.subject} description={data.description} copied={copied} onCopyClick={handleCopyLink} className={classes.shareButtons} />
      </div>
    )
    valid = true
    onNext = goToEnCiv
  } else if (!roundCompleted) {
    let responsesNeeded = (data?.dturn?.group_size || 10) * 2 - 1 - (data.participants || 1)
    // if above is negative, its because we don't have an available group yet, so calculate the number needed to fill the next group
    const groupSize = (data?.dturn?.group_size || 10) - (round == 0 ? 1 : 0)
    if (responsesNeeded < 0) responsesNeeded = (responsesNeeded % groupSize) + groupSize
    if (round === 0)
      conditionalResponse = (
        <div className={classes.headlineSmall}>
          Great! You've answered the question, when we get responses from {responsesNeeded} more people, we will invite you back to continue this round. Sharing this will help us reach that goal sooner.
          <ShareButtons url={window.location.href} subject={data.subject} description={data.description} copied={copied} onCopyClick={handleCopyLink} className={classes.shareButtons} />
        </div>
      )
    else
      conditionalResponse = (
        <div className={classes.headlineSmall}>
          There are not enough responses yet to proceed with round {round + 1}. When we hear from more people, we will invite you back to continue the deliberation. Sharing this will help us reach that goal sooner.
          <ShareButtons url={window.location.href} subject={data.subject} description={data.description} copied={copied} onCopyClick={handleCopyLink} className={classes.shareButtons} />
        </div>
      )
    valid = false
    onNext = null
  } else if (nextRoundAvailable) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Would you like to continue onto Round {round + 1 + 1}, or come back tomorrow? Sometimes it’s good to take a break and come back with fresh eyes. We will send you an email reminder</div>
        <div className={classes.buttonContainer}>
          <PrimaryButton title="Yes, Continue" disabled={false} disableOnClick={false} onClick={() => onDone({ valid: true, value: 'continue', onNext: null })}>
            Yes, Continue
          </PrimaryButton>
          <SecondaryButton title="Remind Me Later" disabled={false} disableOnClick={false} onClick={() => setSuccessMessage('We will send you a reminder email tomorrow')}>
            Remind Me Later
          </SecondaryButton>
        </div>
      </>
    )
    if (successMessage) {
      valid = true
      onNext = goToEnCiv
    } else valid = false
  } else {
    conditionalResponse = (
      <div className={classes.headlineSmall}>
        {`Great you've completed Round ${round + 1}, we will send you an invite to continue the discussion after more people make it this far. In the meantime, feel free to share this discussion with others.`}
        <ShareButtons url={window.location.href} subject={data.subject} description={data.description} copied={copied} onCopyClick={handleCopyLink} className={classes.shareButtons} />
      </div>
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
      {successMessage && <StatusBox className={classes.successMessage} status="done" subject={successMessage} />}
      {validationError && <StatusBox className={classes.errorMessage} status="error" subject={validationError} />}
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
  shareButtons: {
    marginTop: '1.5rem',
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
