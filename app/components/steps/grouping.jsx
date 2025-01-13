// https://github.com/EnCiv/civil-pursuit/issues/49
// https://github.com/EnCiv/civil-pursuit/issues/198

// groupedPoints and pointList are both a list of pointObj
// groupedPoints is shared across states (user may move back and forth between states)
// pointList is the original list of points, we set groupedPoints to pointList if it is empty
'use strict'
import React, { useRef, useState, useEffect, useContext } from 'react'
import DeliberationContext from '../deliberation-context'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PointGroup from '../point-group'
import { PrimaryButton, SecondaryButton } from '../button'
import StatusBadge from '../status-badge'
import { cloneDeep, isEqual } from 'lodash'

export default function GroupingStep(props) {
  const { onDone, ...otherProps } = props
  const { data, upsert } = useContext(DeliberationContext)

  const args = deriveReducedPointGroupList(data)

  const handleOnDone = ({ valid, value, delta }) => {
    if (delta) {
      upsert({ postRankByParentId: { [delta.parentId]: delta } })
      window.socket.emit('put-groupings', discussionId, round, delta)
    }
    onDone({ valid, value })
  }
  // fetch previous data
  if (typeof window !== 'undefined')
    useState(() => {
      // on the browser, do this once and only once when this component is first rendered
      const { discussionId, round, pointById } = data

      window.socket.emit('get-points-for-round', discussionId, round, result => {
        if (!result) return // there was an error

        const [points] = result
        const pointById = points.reduce((pointById, point) => ((pointById[point._id] = point), pointById), {})
        const groupings = points.map(pt => [pt._id, ...pt.groupedPoints.map(gp => gp._id)])

        upsert({ pointById, uInfoByRounds: { [round]: { groupings: groupings } } })

        if (points.length <= 1) {
          onDone({ valid: false, value: 'intermission' })
        }
      })
    })
  return <GroupPoints {...args} round={data.round} discussionId={data.discussionId} onDone={handleOnDone} {...otherProps} />
}

export function GroupPoints(props) {
  const { pointGroupList, onDone = () => {}, shared = {}, className, ...otherProps } = props
  const { pointList, groupedPointList } = shared

  const classes = useStylesFromThemeFunction(props)

  const [pointById, setPointById] = useState(
    (pointGroupList || []).reduce((pointById, groupingPoint) => {
      pointById[groupingPoint._id] = groupingPoint
      return pointById
    }, {})
  )

  useEffect(() => {
    const newPointById = (pointGroupList || []).reduce((pointById, groupingPoint) => {
      pointById[groupingPoint._id] = groupingPoint
      return pointById
    }, {})
    let updated = false
    for (const pointDoc of Object.values(newPointById)) {
      if (isEqual(pointDoc, pointById[pointDoc._id])) {
        newPointById[pointDoc._id] = pointById[pointDoc._id]
      } else updated = true
    }
    if (updated) {
      setPointById(newPointById)
    }
  }, [pointById])

  // using an object for gs (grouping-state) makes it easier understand which variable in the code refers to the new value being generated, and which refers to the old
  // also reduces the number of different set-somethings that have to be called each time.
  const [gs, setGs] = useState({
    selectedPoints: [], // points the user has clicked on, for combining into a group
    pointsToGroup: cloneDeep(groupedPointList?.length ? groupedPointList.filter(p => !p.groupedPoints?.length) : pointGroupList || pointList || []), // points from the pointList input that have not been added to a group - cloneDeep because this will mutate the points
    yourGroups: cloneDeep(groupedPointList?.length ? groupedPointList.filter(p => p.groupedPoints?.length) : []), // points that have been grouped
    yourGroupsSelected: [], // points that have been grouped that have been selected again to be incorporated into a group
    selectLead: null, // the new point, with no subject/description but with goupedPoints for selecting the Lead
  })

  // Don't render if list is missing
  if (!pointGroupList) return null

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
      for (const point of oldGs.pointsToGroup) {
        if (oldGs.selectedPoints.some(_id => _id === point._id)) groupedPoints.push(point)
        else pointsToGroup.push(point)
      }
      // do not add yourGroups to the notSelected if they are not selected
      for (const point of oldGs.yourGroups) {
        if (oldGs.selectedPoints.some(_id => _id === point._id)) {
          groupedPoints.push(point)
          yourGroupsSelected.push(point)
        } else yourGroups.push(point)
      }
      onDone({ valid: false, value: {} })
      return {
        ...oldGs,
        pointsToGroup,
        yourGroups,
        yourGroupsSelected,
        selectedPoints: [],
        selectLead: { groupedPoints },
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
        else pointsToGroup.push(point)
      }
      if (value.pointDoc) {
        yourGroups.push(value.pointDoc)
        // we have to change it because the new one may have different children
      }
      shared.groupedPointList = pointsToGroup.concat(yourGroups) // shareing this data with other components
      onDone({ valid: true, value: shared.groupedPointList })
      return { ...oldGs, pointsToGroup, yourGroups, yourGroupsSelected: [], selectLead: null }
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
          <PointGroup pointDoc={gs.selectLead} vState={'selectLead'} onDone={onSelectLeadDone} />
        </div>
      ) : null}
      <div className={classes.groupsContainer}>
        {gs.pointsToGroup.map(point => (
          <PointGroup key={point._id} pointDoc={point} vState="default" select={gs.selectedPoints.some(id => id === point._id)} onClick={() => togglePointSelection(point._id)} />
        ))}
      </div>
      {!!gs.yourGroups.length && (
        <div className={classes.yourGroupsWrapper}>
          <div className={classes.yourGroupsTitle}>{'Your Groups'}</div>
          <div className={classes.groupsContainer}>
            {gs.yourGroups.map(point => {
              return (
                <PointGroup
                  className={classes.yourGroupsPoint}
                  key={point._id}
                  pointDoc={point}
                  vState="editable"
                  select={gs.selectedPoints.some(id => id === point._id)}
                  onClick={() => togglePointSelection(point._id)}
                  onDone={onYourPointEdited}
                />
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

export function deriveReducedPointGroupList(data) {
  const local = useRef({ groupingPointsById: {} }).current

  const { pointById } = data
  console.log(data)
  let updated = false

  const { groupingPointsById } = local

  if (local.pointById !== pointById) {
    for (const point of Object.values(pointById)) {
      console.log(point)
      if (!groupingPointsById[point._id]) {
        groupingPointsById[point._id] = { point }
        updated = true
      }
    }
    local.groupingPointsById = groupingPointsById
  }
  if (updated) local.pointGroupList = Object.values(local.groupingPointsById)
  return { pointGroupList: local.pointGroupList }
}
