// https://github.com/EnCiv/civil-pursuit/issues/49
// https://github.com/EnCiv/civil-pursuit/issues/198
// https://github.com/EnCiv/civil-pursuit/issues/249
// https://github.com/EnCiv/civil-pursuit/issues/390

// groupedPoints and pointList are both a list of pointObj
// pointList is the original list of points, we set groupedPoints to pointList if it is empty
'use strict'
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { useDeliberationContext, deriveReducedPointList } from '../deliberation-context'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PointGroup from '../point-group'
import { PrimaryButton } from '../button'
import StatusBadge from '../status-badge'
import StepIntro from '../step-intro'
import useFetchDemInfo from '../hooks/use-fetch-dem-info'

const MIN_GROUPS = 0 // the minimum number of groups the user has to make

export default function GroupingStep(props) {
  const { onDone, round, ...otherProps } = props
  const { data, upsert } = useDeliberationContext()
  const fetchDemInfo = useFetchDemInfo()

  const { discussionId } = data
  const args = deriveReducedPointList(data, useRef({}).current)

  const handleOnDone = ({ valid, delta }) => {
    if (delta) {
      const groupings = delta.map(pG => [pG.point._id, ...(pG.group || []).map(gp => gp._id)]).filter(g => g.length > 1)
      upsert({ groupIdsLists: groupings, uInfo: { [round]: { groupings } } })
      //window.socket.emit('post-point-groups', discussionId, round, groupings)
    }
    onDone({ valid })
  }
  // fetch previous data
  useEffect(() => {
    // on the browser, do this once and only once when this component is first rendered
    const { discussionId, uInfo } = data

    window.socket.emit('get-points-for-round', discussionId, round, points => {
      if (!points) return onDone({ valid: true, value: 'Intermission' }) // there was an error
      if (points.length <= 1) {
        onDone({ valid: true, value: 'Intermission' })
      }
      const pointById = {}
      const uInfoRound = uInfo?.[round] || {}
      if (!uInfoRound.shownStatementIds) uInfoRound.shownStatementIds = {}
      for (const point of points) {
        pointById[point._id] = point
        if (!uInfoRound.shownStatementIds[point._id]) {
          uInfoRound.shownStatementIds[point._id] = { rank: 0 } // initialize the shownStatementIds for this point
        }
      }
      upsert({ pointById, uInfo: { ...uInfo, [round]: uInfoRound } })

      // Fetch demographic info for all points
      const pointIds = points.map(p => p._id)
      fetchDemInfo(pointIds)
    })
  }, [round])
  return <GroupPoints {...args} round={round} discussionId={data.discussionId} onDone={handleOnDone} {...otherProps} />
}
// pG stand for point group meaning {point, group}

export function GroupPoints(props) {
  const { reducedPointList, onDone = () => {}, className, discussionId, round, stepIntro } = props

  const classes = useStylesFromThemeFunction(props)
  const delayedOnDone = value => setTimeout(() => onDone(value), 0)

  // using an object for gs (grouping-state) makes it easier understand which variable in the code refers to the new value being generated, and which refers to the old
  // also reduces the number of different set-somethings that have to be called each time.
  const [gs, setGs] = useState({
    selectedIds: [], // points the user has clicked on, for combining into a group
    pGsToGroup: reducedPointList?.filter(pO => !pO.group?.length) || [], // points from the pointList input that have not been added to a group - cloneDeep because this will mutate the points
    yourGroups: reducedPointList?.filter(pO => pO.group?.length > 0) || [], // points that have been grouped
    yourGroupsSelected: [], // points that have been grouped that have been selected again to be incorporated into a group
    selectLead: null, // the new point group, with no point but with a group for selecting the Lead
  })
  const [selectLeadMounted, setSelectLeadMounted] = useState(false)
  const [selectLeadPointGroup, setSelectLeadPointGroup] = useState(null)
  const [returningPointIds, setReturningPointIds] = useState([])
  const [departingPointGroups, setDepartingPointGroups] = useState([])
  const groupsContainerRef = useRef(null)
  const yourGroupsRef = useRef(null)
  const previousGroupPositions = useRef(null)
  const previousYourGroupsTop = useRef(null)

  useEffect(() => {
    if (gs.selectLead) {
      setSelectLeadPointGroup(gs.selectLead)
      setSelectLeadMounted(true)
    }
  }, [gs.selectLead])

  useLayoutEffect(() => {
    const previousPositions = previousGroupPositions.current
    previousGroupPositions.current = null
    const container = groupsContainerRef.current
    if (!previousPositions || !container || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    for (const element of container.children) {
      const pointId = element.dataset.pointId
      const previousPosition = previousPositions.get(pointId)
      if (!pointId || !previousPosition || typeof element.animate !== 'function') continue
      const currentPosition = element.getBoundingClientRect()
      const deltaX = previousPosition.left - currentPosition.left
      const deltaY = previousPosition.top - currentPosition.top
      if (!deltaX && !deltaY) continue
      element.animate([{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: 'translate(0, 0)' }], {
        duration: 420,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      })
    }
  }, [gs.pGsToGroup])

  useLayoutEffect(() => {
    const wrapper = yourGroupsRef.current
    if (!wrapper) {
      previousYourGroupsTop.current = null
      return
    }

    const currentTop = wrapper.getBoundingClientRect().top
    const previousTop = previousYourGroupsTop.current
    if (previousTop !== null && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      const deltaY = previousTop - currentTop
      if (deltaY && typeof wrapper.animate === 'function') {
        wrapper.animate([{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0)' }], {
          duration: 420,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        })
      }
    }
    previousYourGroupsTop.current = currentTop

    return () => {
      const currentWrapper = yourGroupsRef.current
      if (currentWrapper) previousYourGroupsTop.current = currentWrapper.getBoundingClientRect().top
    }
  }, [gs.pGsToGroup])

  // on original render, notify parent this is done (if it is)
  useEffect(() => {
    if (!gs.selectedIds.length && !gs.selectLead && !gs.yourGroupsSelected.length) delayedOnDone({ valid: true, value: {} })
  }, [])

  const [prev] = useState({ reducedPointList })
  if (prev.reducedPointList !== reducedPointList) {
    // Bidirectional data pattern (Variant B — render-time mutation): mutate gs
    // fields directly since the component is already re-rendering due to the
    // prop change. Calling setGs here would cause an extra re-render. See docs/bidirectional-data-pattern.md.
    // if changes from above, clear selected points and groups.  Maybe there is a way not to reset the users state, but this doesn't seem to be a common use case
    gs.selectedIds = []
    gs.pGsToGroup = reducedPointList?.filter(pG => !pG.group?.length) || []
    gs.yourGroups = reducedPointList?.filter(pG => pG.group?.length > 0) || []
    gs.yourGroupsSelected = []
    gs.selectLead = null
    prev.reducedPointList = reducedPointList
  }

  const togglePointSelection = _id => {
    setGs(oldGs => {
      if (oldGs.selectLead) return oldGs // ignore clicks while in selectLead mode
      // if the _id is already in there, remove it
      const selectedIds = oldGs.selectedIds.filter(id => id !== _id)
      // if the _id wasn't in there, push it
      if (selectedIds.length === oldGs.selectedIds.length) selectedIds.push(_id)
      if (selectedIds.length) delayedOnDone({ valid: false })
      const valid = !selectedIds.length && !oldGs.selectLead && !oldGs.yourGroupsSelected.length
      delayedOnDone({ valid, value: {} })
      return { ...oldGs, selectedIds }
    })
  }

  const handleCreateGroupClick = () => {
    if (gs.selectedIds.length < 2) return
    const container = groupsContainerRef.current
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (container && !reducedMotion) {
      const containerRect = container.getBoundingClientRect()
      const previousPositions = new Map()
      for (const element of container.children) {
        if (!element.dataset.pointId) continue
        const rect = element.getBoundingClientRect()
        previousPositions.set(element.dataset.pointId, { left: rect.left, top: rect.top })
      }
      previousGroupPositions.current = previousPositions
      const selectedIds = new Set(gs.selectedIds)
      setDepartingPointGroups(
        gs.pGsToGroup
          .filter(pGD => selectedIds.has(pGD.point._id))
          .map(pointGroup => {
            const rect = container.querySelector(`[data-point-id="${pointGroup.point._id}"]`)?.getBoundingClientRect()
            if (!rect) return null
            return {
              id: pointGroup.point._id,
              pointGroup,
              style: {
                left: rect.left - containerRect.left,
                top: rect.top - containerRect.top,
                width: rect.width,
                height: rect.height,
              },
            }
          })
          .filter(Boolean)
      )
    }
    setGs(oldGs => {
      if (oldGs.selectedIds.length < 2) {
        return oldGs
      }
      let pGsToGroup = []
      let yourGroups = []
      let groupedPoints = []
      let yourGroupsSelected = []
      for (const pG of oldGs.pGsToGroup) {
        if (oldGs.selectedIds.some(_id => _id === pG.point._id)) groupedPoints.push(pG)
        else pGsToGroup.push(pG)
      }
      // do not add yourGroups to the notSelected if they are not selected
      for (const pG of oldGs.yourGroups) {
        if (oldGs.selectedIds.some(_id => _id === pG.point._id)) {
          groupedPoints.push(pG)
          yourGroupsSelected.push(pG)
        } else {
          yourGroups.push(pG)
        }
      }
      delayedOnDone({ valid: false })
      return {
        ...oldGs,
        pGsToGroup,
        yourGroups,
        yourGroupsSelected,
        selectedIds: [],
        selectLead: { group: groupedPoints.map(({ point, group }) => point) }, // group is a list of points, not a list of pointGroups
      }
    })
  }

  const onSelectLeadDone = ({ valid, value }) => {
    if (!valid) return
    setGs(oldGs => {
      const pGsToGroup = [...oldGs.pGsToGroup]
      const yourGroups = [...oldGs.yourGroups]
      for (const pG of value.removedPgs || []) {
        // leave it in the yourGroups
        if (oldGs.yourGroupsSelected.some(pGo => pGo.point._id === pG.point._id)) {
          yourGroups.push(pG)
        }
        // move it back to the ungrouped points
        else {
          pGsToGroup.push(pG)
        }
      }
      if (value.pointGroup) {
        const subPoints = new Set(value.pointGroup.group || [])
        // need to gather the points from the groups in the other selected groups
        for (const { point, group } of oldGs.yourGroupsSelected) {
          for (const sP of group) {
            subPoints.add(sP)
          }
        }
        value.pointGroup.group = [...subPoints]
        yourGroups.push(value.pointGroup)
        // we have to change it because the new one may have different children
      }
      delayedOnDone({ valid: true, delta: yourGroups })
      return { ...oldGs, pGsToGroup, yourGroups, yourGroupsSelected: [], selectLead: null }
    })
  }

  const onYourPointEdited = ({ valid, value }) => {
    if (!valid) return
    const returnedPointIds = (value.removedPgs || []).map(pG => pG.point?._id).filter(Boolean)
    if (returnedPointIds.length) {
      setReturningPointIds(currentIds => [...new Set([...currentIds, ...returnedPointIds])])
    }
    setGs(oldGs => {
      let index
      const pGsToGroup = [...oldGs.pGsToGroup]
      let yourGroups = [...oldGs.yourGroups]
      let selectedIds = [...oldGs.selectedIds]
      for (const pG of value.removedPgs || []) {
        // move it back to the ungrouped points
        pGsToGroup.push(pG)
        yourGroups = yourGroups.filter(pGD => pGD.point._id !== pG._id)
        selectedIds = selectedIds.filter(id => id !== pG._id)
      }
      // it doesn't create a new pointObj, but it delete it, or change the existing one.
      if (value.pointGroup) {
        if (!value.pointGroup.group.length) {
          // user has ungrouped this point
          if ((index = yourGroups.findIndex(pGD => value.pointGroup.point._id === pGD.point._id)) >= 0) {
            yourGroups.splice(index, 1)
            pGsToGroup.push(value.pointGroup)
          }
          selectedIds = selectedIds.filter(id => id !== value.pointGroup.point._id)
        } else if ((index = yourGroups.findIndex(pGD => pGD.point._id === value.pointGroup.point._id)) >= 0) {
          // group has changed in the pointGroup, replace it
          yourGroups.splice(index, 1, value.pointGroup)
        } else {
          // lead point is changed - find the old one
          index = yourGroups.findIndex(pGD => pGD.group.some(p => p._id === value.pointGroup.point._id))
          if (index >= 0) {
            yourGroups.splice(index, 1, value.pointGroup)
          } else {
            console.info("got new pointDoc don't know why")
            yourGroups.push(value.pointGroup)
          }
        }
      }
      delayedOnDone({ valid: true, delta: pGsToGroup.concat(yourGroups) })
      return { ...oldGs, pGsToGroup, yourGroups, selectedIds }
    })
  }

  // Don't render if list is missing or if there's nothing to group yet, but do call all the hooks because they can't change after the first render
  if (!reducedPointList || reducedPointList.length <= 1) return null

  return (
    <div className={cx(classes.groupingStep, className)}>
      <StepIntro {...stepIntro} />
      <div className={classes.statusContainer}>
        <div className={classes.statusBadges}>
          <StatusBadge name="Groups Created" status={gs.yourGroups.length == 0 ? 'inactive' : 'complete'} number={gs.yourGroups.length} />
          <StatusBadge name="Responses Selected" status={'response'} number={gs.selectedIds.length} />
        </div>
        <div className={classes.buttons}>
          <div className={classes.primaryButton}>
            <PrimaryButton disabled={gs.selectedIds.length < 2} className={`${classes.primaryButton} ${gs.selectedIds.length < 2 ? classes.createGroupDisabled : ''}`} onDone={handleCreateGroupClick}>
              <span>Group Selected Responses</span>
              <span className={classes.countBadge}>{gs.selectedIds.length}</span>
            </PrimaryButton>
          </div>
          {/* ui works without this but need design feedback
           <SecondaryButton
            disabled={gs.yourGroups.length < 1}
            className={classes.secondaryButton}
            onClick={handleAddExistingGroupClick}
          >
            + Add to Existing Group
          </SecondaryButton> */}
        </div>
      </div>
      {(gs.selectLead || selectLeadMounted) && (
        <div
          role="region"
          aria-label="Select lead response"
          className={cx(classes.selectLead, gs.selectLead ? classes.selectLeadOpening : classes.selectLeadClosing)}
          onAnimationEnd={event => {
            if (event.target === event.currentTarget && !gs.selectLead) {
              setSelectLeadMounted(false)
              setSelectLeadPointGroup(null)
            }
          }}
        >
          <PointGroup pointGroup={gs.selectLead || selectLeadPointGroup} vState={'selectLead'} onDone={onSelectLeadDone} />
        </div>
      )}
      {
        /*!gs.selectLead&& */ <div ref={groupsContainerRef} className={classes.groupsContainer} role="group" aria-label="Available responses to group">
          {departingPointGroups.map(({ id, pointGroup, style }) => (
            <div
              key={`departing-${id}`}
              className={classes.departingPoint}
              style={style}
              aria-hidden="true"
              onAnimationEnd={event => {
                if (event.target === event.currentTarget) setDepartingPointGroups(current => current.filter(item => item.id !== id))
              }}
            >
              <PointGroup pointGroup={pointGroup} vState="view" select onClick={() => {}} />
            </div>
          ))}
          {gs.pGsToGroup.map((pGD, index) => {
            const pointId = pGD.point._id
            const isReturning = returningPointIds.includes(pointId)
            return (
              <div
                key={pointId}
                data-point-id={pointId}
                className={cx(isReturning && classes.returnedPoint)}
                onAnimationEnd={event => {
                  if (event.target === event.currentTarget && isReturning) {
                    setReturningPointIds(currentIds => currentIds.filter(id => id !== pointId))
                  }
                }}
              >
                <PointGroup pointGroup={pGD} vState={gs.selectLead ? 'disabled' : 'view'} select={gs.selectedIds.some(id => id === pointId)} onClick={() => togglePointSelection(pointId)} />
              </div>
            )
          })}
        </div>
      }
      {
        /*!gs.selectLead && **/ !!gs.yourGroups.length && (
          <div ref={yourGroupsRef} className={classes.yourGroupsWrapper}>
            <div className={classes.yourGroupsTitle}>{'Your Groups'}</div>
            <div className={classes.groupsContainer} role="group" aria-label="Your grouped responses">
              {gs.yourGroups.map(pointGroup => {
                return (
                  pointGroup && (
                    <PointGroup
                      className={classes.yourGroupsPoint}
                      key={pointGroup.point?._id}
                      pointGroup={pointGroup}
                      vState={gs.selectLead ? 'disabled' : 'editable'}
                      select={gs.selectedIds.some(id => id === pointGroup.point._id)}
                      onClick={() => togglePointSelection(pointGroup.point._id)}
                      onDone={onYourPointEdited}
                    />
                  )
                )
              })}
            </div>
          </div>
        )
      }
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  groupingStep: {
    marginBottom: '1rem', // for box shadow of children
    containerType: 'inline-size',
    containerName: 'groupingStep',
  },
  groupsContainer: {
    position: 'relative',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '1.25rem',
    '@container groupingStep (min-width: 40rem)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@container groupingStep (min-width: 70rem)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
    '@container groupingStep (min-width: 90rem)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
      paddingTop: '1rem',
      paddingBottom: '1.25rem',
      rowGap: '1.25rem',
    },
  },
  statusContainer: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
    display: 'flex',
    marginTop: '2.5rem',
    marginBottom: '2.5rem',
    gap: '0.875rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      boxSizing: 'border-box',
      padding: '0.625rem 0.75rem',
      margin: 0,
      gap: '0.5rem',
      backgroundColor: theme.colors.white,
      boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.12)',
    },
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: '0.875rem',
    marginRight: '0',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      width: '100%',
      marginBottom: 0,
      order: -1,
      alignItems: 'stretch',
    },
  },
  statusBadges: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    justifyContent: 'space-between',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      alignItems: 'center',
      gap: '0.375rem',
      width: '100%',
      '& > span': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        minWidth: 0,
        padding: '0.25rem 0.375rem',
        fontSize: '0.75rem',
      },
      '& > span > span:last-child': {
        marginLeft: '0.25rem',
      },
    },
  },
  primaryButton: {
    transition: 'transform 120ms ease, box-shadow 120ms ease',
    '&:active:not(:disabled)': {
      transform: 'scale(0.97)',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '100%',
    },
  },
  secondaryButton: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '100%',
    },
  },
  createGroupDisabled: {
    backgroundColor: `${theme.colors.primaryButtonBlue} !important`,
    color: `${theme.colors.white} !important`,
    border: `0.125rem solid ${theme.colors.primaryButtonBlue} !important`,
    opacity: 0.3,
  },
  returnedPoint: {
    animation: '$pointReturns 360ms ease-out both',
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  departingPoint: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    animation: '$pointDeparts 320ms ease-in both',
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  '@keyframes pointDeparts': {
    from: {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },
    to: {
      opacity: 0,
      transform: 'translateY(-0.75rem) scale(0.96)',
    },
  },
  '@keyframes pointReturns': {
    from: {
      opacity: 0,
      transform: 'translateY(-1rem) scale(0.96)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },
  },
  selectLead: {
    width: '100%',
    marginTop: '3.125rem',
    marginBottom: '3.125rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      position: 'fixed',
      inset: 0,
      zIndex: 1090,
      display: 'flex',
      width: '100vw',
      height: '100vh',
      height: '100dvh',
      margin: 0,
      overflow: 'hidden',
      backgroundColor: theme.colors.white,
      '& > div': {
        width: '100%',
        height: '100%',
        minHeight: 0,
      },
    },
  },
  selectLeadOpening: {
    animation: '$selectLeadOpen 280ms ease-out both',
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  selectLeadClosing: {
    animation: '$selectLeadClose 220ms ease-in both',
    pointerEvents: 'none',
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  '@keyframes selectLeadOpen': {
    from: {
      opacity: 0,
      transform: 'translateY(-0.75rem)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes selectLeadClose': {
    from: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    to: {
      opacity: 0,
      transform: 'translateY(-0.5rem)',
    },
  },
  yourGroupsWrapper: {
    marginTop: '2rem',
    width: '100%',
    backgroundColor: theme.colors.lightGray,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    boxShadow: '0 0.25rem 0.875rem rgba(0, 0, 0, 0.12)',
    paddingBottom: '2rem',
  },
  yourGroupsTitle: {
    padding: '1.125rem 2rem 1rem',
    fontSize: '2rem',
    lineHeight: '2.625rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '1rem 1rem 0.875rem',
    },
  },
  yourGroupsPoint: {
    backgroundColor: 'white',
  },

  countBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '1.5rem',
    height: '1.5rem',
    padding: '0 0.5rem',
    marginLeft: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    borderRadius: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'inherit',
  },
}))
