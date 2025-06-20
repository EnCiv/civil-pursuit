// https://github.com/EnCiv/civil-pursuit/issues/49
// https://github.com/EnCiv/civil-pursuit/issues/198
// https://github.com/EnCiv/civil-pursuit/issues/249

// groupedPoints and pointList are both a list of pointObj
// pointList is the original list of points, we set groupedPoints to pointList if it is empty
'use strict'
import React, { useRef, useState, useContext, useEffect } from 'react'
import DeliberationContext, { deriveReducedPointList } from '../deliberation-context'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PointGroup from '../point-group'
import { PrimaryButton } from '../button'
import StatusBadge from '../status-badge'

const MIN_GROUPS = 0 // the minimum number of groups the user has to make

export default function GroupingStep(props) {
  const { onDone, ...otherProps } = props
  const { data, upsert } = useContext(DeliberationContext)

  const { discussionId, round } = data
  const args = deriveReducedPointList(data, useRef({}).current)

  const handleOnDone = ({ valid, delta }) => {
    if (delta) {
      const groupings = delta.map(pG => [pG.point._id, ...(pG.group || []).map(gp => gp._id)]).filter(g => g.length > 1)
      upsert({ groupIdsLists: groupings })
      window.socket.emit('post-point-groups', discussionId, round, groupings)
    }
    onDone({ valid })
  }
  // fetch previous data
  if (typeof window !== 'undefined')
    useState(() => {
      // on the browser, do this once and only once when this component is first rendered
      const { discussionId, round } = data

      window.socket.emit('get-points-for-round', discussionId, round, result => {
        if (!result) return onDone({ valid: true, value: 'Intermission' }) // there was an error

        const points = result
        const pointById = points.reduce((pointById, point) => ((pointById[point._id] = point), pointById), {})
        upsert({ pointById })

        if (points.length <= 1) {
          onDone({ valid: true, value: 'Intermission' })
        }
      })
    })
  return <GroupPoints {...args} round={data.round} discussionId={data.discussionId} onDone={handleOnDone} {...otherProps} />
}

// pG stand for point group meaning {point, group}

export function GroupPoints(props) {
  const { reducedPointList, onDone = () => {}, className, discussionId, round } = props

  const classes = useStylesFromThemeFunction(props)
  const delayedOnDone = value => setTimeout(() => onDone(value), 0)

  // Don't render if list is missing
  if (!reducedPointList) return null

  // using an object for gs (grouping-state) makes it easier understand which variable in the code refers to the new value being generated, and which refers to the old
  // also reduces the number of different set-somethings that have to be called each time.
  const [gs, setGs] = useState({
    selectedIds: [], // points the user has clicked on, for combining into a group
    pGsToGroup: reducedPointList?.filter(pO => !pO.group?.length) || [], // points from the pointList input that have not been added to a group - cloneDeep because this will mutate the points
    yourGroups: reducedPointList?.filter(pO => pO.group?.length > 0) || [], // points that have been grouped
    yourGroupsSelected: [], // points that have been grouped that have been selected again to be incorporated into a group
    selectLead: null, // the new point group, with no point but with a group for selecting the Lead
  })

  // on original render, notify parent this is done (if it is)
  useEffect(() => {
    if (!gs.selectedIds.length && !gs.selectLead && !gs.yourGroupsSelected.length) delayedOnDone({ valid: true, value: {} })
  }, [])

  const [prev] = useState({ reducedPointList })
  if (prev.reducedPointList !== reducedPointList) {
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
      // if the _id is already in there, remove it
      const selectedIds = oldGs.selectedIds.filter(id => id !== _id)
      // if the _id wasn't in there, push it
      if (selectedIds.length === oldGs.selectedIds.length) selectedIds.push(_id)
      if (selectedIds.length) delayedOnDone({ valid: false })

      return { ...oldGs, selectedIds }
    })
  }

  const handleCreateGroupClick = () => {
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
            yourGroups.splice(index, 1, pointGroup)
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

  return (
    <div className={cx(classes.groupingStep, className)}>
      <div className={classes.statusContainer}>
        <div className={classes.statusBadges}>
          <StatusBadge name="Groups Created" status={gs.yourGroups.length == 0 ? 'inactive' : 'complete'} number={gs.yourGroups.length} />
          <StatusBadge name="Responses Selected" status={'response'} number={gs.selectedIds.length} />
        </div>
        <div className={classes.buttons}>
          <div className={classes.primaryButton}>
            <PrimaryButton disabled={gs.selectedIds.length < MIN_GROUPS} className={`${classes.primaryButton} ${gs.selectedIds.length < MIN_GROUPS ? classes.createGroupDisabled : ''}`} onClick={handleCreateGroupClick}>
              Create Group
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
      {gs.selectLead != null ? (
        <div className={classes.selectLead}>
          <PointGroup pointGroup={gs.selectLead} vState={'selectLead'} onDone={onSelectLeadDone} />
        </div>
      ) : null}
      <div className={classes.groupsContainer}>
        {gs.pGsToGroup.map(pGD => (
          <PointGroup key={pGD.point._id} pointGroup={pGD} vState="default" select={gs.selectedIds.some(id => id === pGD.point._id)} onClick={() => togglePointSelection(pGD.point._id)} />
        ))}
      </div>
      {!!gs.yourGroups.length && (
        <div className={classes.yourGroupsWrapper}>
          <div className={classes.yourGroupsTitle}>{'Your Groups'}</div>
          <div className={classes.groupsContainer}>
            {gs.yourGroups.map(pointGroup => {
              return (
                pointGroup && (
                  <PointGroup
                    className={classes.yourGroupsPoint}
                    key={pointGroup.point?._id}
                    pointGroup={pointGroup}
                    vState="editable"
                    select={gs.selectedIds.some(id => id === pointGroup.point._id)}
                    onClick={() => togglePointSelection(pointGroup.point._id)}
                    onDone={onYourPointEdited}
                  />
                )
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  groupingStep: {},
  groupsContainer: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.25rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
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
      alignItems: 'center',
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
      marginBottom: '1rem',
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
      marginTop: '0',
      gap: '0',
      gap: '0.875rem',
      flexDirection: 'column', // Make sure this is 'row' to keep badges on left and right
      width: '100%',
    },
  },
  primaryButton: {
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
  selectLead: {
    marginTop: '3.125rem',
    marginBottom: '3.125rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '100%',
    },
  },
  yourGroupsWrapper: {
    marginTop: '2rem',
    width: '100%',
    backgroundColor: theme.colors.lightGray,
    paddingBottom: '2rem',
  },
  yourGroupsTitle: {
    marginLeft: '2rem',
    paddingTop: '.5rem',
    paddingBottom: '1rem',
    fontSize: '2rem',
    lineHeight: '2.625rem',
  },
  yourGroupsPoint: {
    backgroundColor: 'white',
  },
}))
