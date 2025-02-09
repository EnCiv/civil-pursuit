// https://github.com/EnCiv/civil-pursuit/issues/49
// https://github.com/EnCiv/civil-pursuit/issues/198

// groupedPoints and pointList are both a list of pointObj
// groupedPoints is shared across states (user may move back and forth between states)
// pointList is the original list of points, we set groupedPoints to pointList if it is empty
'use strict'
import React, { useRef, useState, useEffect, useContext } from 'react'
import DeliberationContext, { deriveReducedPointList } from '../deliberation-context'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PointGroup from '../point-group'
import { PrimaryButton, SecondaryButton } from '../button'
import StatusBadge from '../status-badge'
import { cloneDeep, isEqual } from 'lodash'

const { putGroupings } = require('../../dturn/dturn')

export default function GroupingStep(props) {
  const { onDone, ...otherProps } = props
  const { data, upsert } = useContext(DeliberationContext)

  const { discussionId, round } = data
  const args = deriveReducedPointList(data, useRef({}).current)

  const handleOnDone = ({ valid, delta }) => {
    if (delta) {
      putGroupings(discussionId, round, userId, delta)
      window.socket.emit('put-groupings', discussionId, round, delta)
    }
    onDone({ valid })
  }
  // fetch previous data
  if (typeof window !== 'undefined')
    useState(() => {
      // on the browser, do this once and only once when this component is first rendered
      const { discussionId, round, pointById } = data

      window.socket.emit('get-points-for-round', discussionId, round, result => {
        if (!result) return // there was an error

        const [pointGroupDocs] = result
        const pointById = pointGroupDocs.reduce((pointById, point) => ((pointById[point._id] = point), pointById), {})
        const groupings = pointGroupDocs.map(pGD => [pGD.point._id, ...pGD.group.map(gp => gp._id)])
        upsert({ pointById, uInfoByRounds: { [round]: { groupings: groupings } } })

        if (pointGroupDocs.length <= 1) {
          onDone({ valid: false, value: 'intermission' })
        }
      })
    })
  return <GroupPoints {...args} round={data.round} discussionId={data.discussionId} onDone={handleOnDone} {...otherProps} />
}

export function GroupPoints(props) {
  const { reducedPointList, onDone = () => {}, shared = {}, className, ...otherProps } = props
  const { pointList, groupedPointList } = shared

  const classes = useStylesFromThemeFunction(props)

  // Don't render if list is missing
  if (!reducedPointList) return null

  // using an object for gs (grouping-state) makes it easier understand which variable in the code refers to the new value being generated, and which refers to the old
  // also reduces the number of different set-somethings that have to be called each time.
  const [gs, setGs] = useState({
    selectedPoints: [], // points the user has clicked on, for combining into a group
    pointsToGroup: reducedPointList?.filter(pO => pO.group?.length === 0).map(pO => pO.point) || [], // points from the pointList input that have not been added to a group - cloneDeep because this will mutate the points
    yourGroups: reducedPointList?.filter(pO => pO.group?.length > 0).map(pO => pO.group) || [], // points that have been grouped
    yourGroupsSelected: [], // points that have been grouped that have been selected again to be incorporated into a group
    selectLead: null, // the new point, with no subject/description but with goupedPoints for selecting the Lead
  })

  if (reducedPointList) {
    useEffect(() => {
      const newPointsToGroup = reducedPointList.filter(pO => !pO.group).map(pO => pO.point)

      let updated = false
      for (const point of newPointsToGroup) {
        if (gs.pointsToGroup.some(pt => pt === point)) {
          newPointsToGroup.push(point)
        } else updated = true
      }

      if (updated) {
        setGs({ ...gs, pointsToGroup: newPointsToGroup })
      }
    }, [reducedPointList])
  }

  const handleGrouping = grouping => {
    let groupings

    const uniqueSet = [...new Set(grouping, ...gs.yourGroups)]
    setGs({ ...gs, yourGroups: uniqueSet })

    if (groupings) {
      setTimeout(() => onDone({ valid: false, delta: groupings }))
    }

    return gs
  }

  const togglePointSelection = _id => {
    setGs(oldGs => {
      // if the _id is already in there, remove it
      const selectedPoints = oldGs.selectedPoints.filter(id => id !== _id)
      // if the _id wasn't in there, push it
      if (selectedPoints.length === oldGs.selectedPoints.length) selectedPoints.push(_id)
      if (selectedPoints.length) onDone({ valid: false, value: {} })

      return { ...oldGs, selectedPoints }
    })
  }

  const handleCreateGroupClick = () => {
    setGs(oldGs => {
      if (oldGs.selectedPoints.length < 2) {
        return oldGs
      }
      let pointsToGroup = []
      let yourGroups = []
      let groupedPoints = []
      let yourGroupsSelected = []
      for (const pointGroupDoc of oldGs.pointsToGroup) {
        if (oldGs.selectedPoints.some(_id => _id === pointGroupDoc.point._id)) groupedPoints.push(pointGroupDoc)
        else pointsToGroup.push(pointGroupDoc)
      }
      // do not add yourGroups to the notSelected if they are not selected
      for (const point of oldGs.yourGroups) {
        if (oldGs.selectedPoints.some(_id => _id === point._id)) {
          groupedPoints.push(point)
          yourGroupsSelected.push(point)
        } else {
          yourGroups.push(point)
        }
      }
      onDone({ valid: false, value: {} })
      return {
        ...oldGs,
        pointsToGroup,
        yourGroups,
        yourGroupsSelected,
        selectedPoints: [],
        selectLead: { group: groupedPoints },
      }
    })
  }

  const onSelectLeadDone = ({ valid, value }) => {
    if (!valid) return
    setGs(oldGs => {
      let pointsToGroup = [...oldGs.pointsToGroup]
      let yourGroups = [...oldGs.yourGroups]

      for (const point of value.removedPointDocs || []) {
        // leave it in the yourGroups
        if (oldGs.yourGroupsSelected.some(p => p._id === point._id)) {
          yourGroups.push(point)
        }
        // move it back to the ungrouped points
        else {
          pointsToGroup.push({ point, group: [] })
        }
      }

      if (value.pointGroupDoc) {
        yourGroups.push(value.pointGroupDoc)
        // we have to change it because the new one may have different children
      }
      shared.groupedPointList = pointsToGroup.concat(yourGroups) // shareing this data with other components
      handleGrouping(yourGroups)

      setGs({ ...oldGs, pointsToGroup, yourGroups, yourGroupsSelected: [], selectLead: null })

      return gs
    })
  }

  const onYourPointEdited = ({ valid, value }) => {
    if (!valid) return
    setGs(oldGs => {
      let index
      let pointsToGroup = [...oldGs.pointsToGroup]
      let yourGroups = [...oldGs.yourGroups]
      let selectedPoints = [...oldGs.selectedPoints]
      for (const point of value.removedPointDocs || []) {
        // move it back to the ungrouped points
        pointsToGroup.push(point)
        yourGroups = yourGroups.filter(p => p._id !== point._id)
        selectedPoints = selectedPoints.filter(id => id !== point._id)
      }
      // it doeosn't create a new pointObj, but it delete it, or change the existing one.
      if (value.pointDoc) {
        if (!value.pointDoc.groupedPoints?.length) {
          // user has ungrouped this point
          if ((index = yourGroups.findIndex(p => value.pointDoc._id === p._id)) >= 0) {
            yourGroups.splice(index, 1)
            pointsToGroup.push(value.pointDoc)
          }
          selectedPoints = selectedPoints.filter(id => id !== value.pointDoc._id)
        } else if (yourGroups.some(p => p._id === value.pointDoc._id)) {
          //do nothing
        } else {
          // lead point is changed - find the old one
          index = yourGroups.findIndex(p => p.groupedPoints.some(p => p._id === value.pointObj._id))
          if (index >= 0) {
            yourGroups.splice(index, 1)
            yourGroups.push(value.pointDoc)
          } else {
            console.info("got new pointDoc don't know why")
            yourGroups.push(value.pointDoc)
          }
        }
      }
      shared.groupedPointList = pointsToGroup.concat(yourGroups) // shareing this data with other components
      onDone({ valid: true, value: shared.groupedPointList })
      return { ...oldGs, pointsToGroup, yourGroups, selectedPoints }
    })
  }

  return (
    <div className={cx(classes.groupingStep, className)} {...otherProps}>
      <div className={classes.statusContainer}>
        <div className={classes.statusBadges}>
          <StatusBadge name="Groups Created" status={'progress'} number={gs.yourGroups.length} />
          <StatusBadge name="Responses Selected" status={gs.selectedPoints.length === 0 ? '' : 'complete'} number={gs.selectedPoints.length} />
        </div>
        <div className={classes.buttons}>
          <div className={classes.primaryButton}>
            <PrimaryButton disabled={gs.selectedPoints.length < 2} className={classes.primaryButton} onClick={handleCreateGroupClick}>
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
          <PointGroup pointGroupDoc={gs.selectLead} vState={'selectLead'} onDone={onSelectLeadDone} />
        </div>
      ) : null}
      <div className={classes.groupsContainer}>
        {gs.pointsToGroup.map(pGD => (
          <PointGroup key={pGD.point._id} pointGroupDoc={pGD} vState="default" select={gs.selectedPoints.some(id => id === pGD.point._id)} onClick={() => togglePointSelection(pGD.point._id)} />
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
                    pointGroupDoc={pointGroup}
                    vState="editable"
                    select={gs.selectedPoints.some(id => id === pointGroup.point._id)}
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
    // Ensure theme.condensedWidthBreakPoint is in pixels. Then, for the media query:
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
      flexDirection: 'row', // Make sure this is 'row' to keep badges on left and right
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
