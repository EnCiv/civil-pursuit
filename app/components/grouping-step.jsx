// https://github.com/EnCiv/civil-pursuit/issue/49

// groupedPoints and pointList are both a list of pointObj
// groupdPoints is shared across states (user may move back and forth between states)
// pointList is the original list of points, we set groupedPoints to pointList if it is empty
'use strict'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PointGroup from './point-group'
import { TextButton, PrimaryButton, SecondaryButton } from './button'
import StatusBadge from './status-badge'
import Point from './point'
import { update } from 'lodash'

// vState for Point: default, selected, disabled, collapsed
const CreatePointGroup = ({ pointObj, vState, children, select, className, onClick }) => {
  return (
    <PointGroup
      pointObj={pointObj}
      vState={vState}
      select={select}
      children={children}
      className={className}
      onClick={onClick}
    />
  )
}

const createPointObj = (_id, subject, description, groupedPoints, user) => {
  return {
    _id,
    subject,
    description,
    groupedPoints,
    user,
  }
}

export default function GroupingStep(props) {
  const { onDone, shared, className, ...otherProps } = props
  const { pointList, groupedPointList } = shared

  const classes = useStylesFromThemeFunction(props)
  const [pointsToGroup, setPointsToGroup] = useState([...pointList])
  const [yourGroups, setYourGroups] = useState([])
  const [yourGroupsSelected, setYourGroupsSelected] = useState([]) // points that have been grouped that have been selected again to be incorporated into a group
  const [selectedPoints, setSelectedPoints] = useState([])
  // the grouping step to select a lead
  const [selectLead, setSelectLead] = useState(null)

  /**useEffect(() => {
    if (pointsToGroup.length === 0 || !pointsToGroup) {
      setPointsToGroup([...pointList])
    }
    onDone({ valid: true, value: pointsToGroup })
  }, [pointsToGroup, pointList, onDone])*/

  const togglePointSelection = _id => {
    // if the _id is already in there, remove it
    const updatedSelectedPoints = selectedPoints.filter(id => id !== _id)
    // if the _id wasn't in there, push it
    if (updatedSelectedPoints.length === selectedPoints.length) updatedSelectedPoints.push(_id)
    setSelectedPoints(updatedSelectedPoints)
  }

  const handleCreateGroupClick = () => {
    if (selectedPoints.length < 2) {
      return
    }
    let newPointsToGroup = []
    let newYourGroups = []
    let groupedPoints = []
    let newGroupedPointsSelected = []
    for (const point of pointsToGroup) {
      if (selectedPoints.some(_id => _id === point._id)) groupedPoints.push(point)
      else newPointsToGroup.push(point)
    }
    // do not add yourGroups to the notSelected if they are not selected
    for (const point of yourGroups) {
      if (selectedPoints.some(_id => _id === point._id)) {
        groupedPoints.push(point)
        newGroupedPointsSelected.push(point)
      } else newYourGroups.push(point)
    }
    setSelectLead({ groupedPoints }) // Store just the data
    setPointsToGroup(newPointsToGroup) // Remove selected points
    setYourGroups(newYourGroups)
    setYourGroupsSelected(newGroupedPointsSelected)
    setSelectedPoints([]) // Reset selection states
  }

  const handleAddExistingGroupClick = () => {}

  const onSelectLeadDone = ({ valid, value }) => {
    if (!valid) return
    let newPointsToGroup = [...pointsToGroup]
    let newYourGroups = [...yourGroups]
    for (const point of value.removedPointObjs || []) {
      // leave it in the yourGroups
      if (yourGroupsSelected.some(p => p._id === point._id)) {
        newYourGroups.push(point)
      }
      // move it back to the ungrouped points
      else newPointsToGroup.push(point)
    }
    if (value.pointObj) {
      newYourGroups.push(value.pointObj)
      // we have to change it because the new one may have different children
    }
    setYourGroups(newYourGroups)
    setYourGroupsSelected([])
    setPointsToGroup(newPointsToGroup)
    setSelectLead(null)
  }

  return (
    <div className={cx(classes.groupingStep, className)} {...otherProps}>
      <div className={classes.statusContainer}>
        <div className={classes.statusBadges}>
          <StatusBadge name="Groups Created" status={'progress'} number={yourGroups.length} />
          <StatusBadge
            name="Responses Selected"
            status={selectedPoints.length === 0 ? '' : 'complete'}
            number={selectedPoints.length}
          />
        </div>
        <div className={classes.buttons}>
          <div className={classes.primaryButton}>
            <PrimaryButton
              disabled={selectedPoints.length < 2}
              className={classes.primaryButton}
              onClick={handleCreateGroupClick}
            >
              Create Group
            </PrimaryButton>
          </div>
          <SecondaryButton
            disabled={yourGroups.length < 1}
            className={classes.secondaryButton}
            onClick={handleAddExistingGroupClick}
          >
            + Add to Existing Group
          </SecondaryButton>
        </div>
      </div>
      {selectLead != null ? (
        <div className={classes.selectLead}>
          <PointGroup pointObj={selectLead} vState={'selectLead'} onDone={onSelectLeadDone} />
        </div>
      ) : null}
      <div className={classes.groupsContainer}>
        {pointsToGroup.map(point => (
          <PointGroup
            key={point._id}
            pointObj={point}
            vState="default"
            select={selectedPoints.some(id => id === point._id)}
            onClick={() => togglePointSelection(point._id)}
          />
        ))}
      </div>
      {!!yourGroups.length && (
        <div className={classes.yourGroupsWrapper}>
          <div className={classes.yourGroupsTitle}>{'Your Groups'}</div>
          <div className={classes.groupsContainer}>
            {yourGroups.map(point => {
              return (
                <PointGroup
                  key={point._id}
                  pointObj={point}
                  vState="default"
                  select={selectedPoints.some(id => id === point._id)}
                  onClick={() => togglePointSelection(point._id)}
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
    width: '100%',
    backgroundColor: theme.colors.lightGray,
    paddingBottom: '2rem',
  },
  yourGroupsTitle: {
    marginLeft: '2rem',
    paddingTop: '2rem',
    paddingBottom: '1rem',
    fontSize: '2rem',
    lineHeight: '2.625rem',
  },
}))
