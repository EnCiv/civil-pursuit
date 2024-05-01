// https://github.com/EnCiv/civil-pursuit/issues/35

'use strict'

import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Point from './point.jsx'
import SvgChevronUp from '../svgr/chevron-up'
import SvgChevronDown from '../svgr/chevron-down'
import SvgClose from '../svgr/close'
import { ModifierButton, TextButton, SecondaryButton } from './button.jsx'
import DemInfo from './dem-info.jsx'

// vState for Point: default, selected, disabled, collapsed
const CreatePoint = (pointObj, vState, children, className) => {
  const { subject, description } = pointObj
  return <Point subject={subject} description={description} vState={vState} children={children} className={className} />
}

const PointGroup = props => {
  const { pointObj, vState, select, className, onDone = () => {}, ...otherProps } = props

  // vState for pointGroup: ['default', 'edit', 'view', 'selectLead', 'collapsed']
  const [vs, setVState] = useState(vState === 'editable' ? 'edit' : vState)
  const [pO, setPointObj] = useState(pointObj)
  const [expanded, setExpanded] = useState(vState === 'selectLead' || vState === 'edit')
  const classes = useStylesFromThemeFunction()
  const { groupedPoints, ...soloPoint } = pO
  const { subject, description, user } = soloPoint
  const singlePoint = !groupedPoints || groupedPoints.length === 0
  const [selected, setSelected] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const onMouseIn = () => {
    setIsHovered(true)
  }

  const onMouseOut = () => {
    setIsHovered(false)
  }

  useEffect(() => {
    setVState(vState === 'editable' ? 'edit' : vState)
    setExpanded(vState === 'selectLead' || vState === 'edit')
  }, [vState]) // could be changed by parent component, or within this component
  useEffect(() => {
    setPointObj(pointObj)
  }, [pointObj]) // could be changed by parent component, or within this component

  return (
    <div className={cx(className)} {...otherProps}>
      {vs === 'collapsed' && (
        <div
          className={cx(
            classes.borderStyle,
            classes.collapsedBorder,
            classes.contentContainer,
            classes.informationGrid
          )}
        >
          {subject && <div className={cx(classes.subjectStyle, classes.collapsedSubject)}>{subject}</div>}
        </div>
      )}

      {vs === 'selectLead' && (
        <div className={cx(classes.borderStyle, classes.contentContainer)}>
          <p className={classes.titleGroup}>Please select the response you want to lead with</p>
          <div className={classes.SvgContainer}>
            <TextButton
              title="Ungroup and close"
              tabIndex={0}
              onClick={() => {
                setPointObj({})
                onDone({
                  valid: true,
                  value: { pointObj: undefined, removedPointObjs: groupedPoints },
                })
              }}
            >
              <span className={classes.chevronButton}>
                <SvgClose />
              </span>
            </TextButton>
          </div>
          {expanded && (
            <div className={classes.selectPointsContainer}>
              {groupedPoints?.map(point => {
                return (
                  <div key={point._id} className={classes.selectPoints}>
                    {CreatePoint(
                      point,
                      point._id === selected ? 'selected' : 'default',
                      [
                        <DemInfo user={point.user} />,
                        <div className={classes.invisibleElement}>
                          {/* this is here to take up space for the heigth calculation of every grid cell, but not be visible */}
                          <ModifierButton children={'Select as Lead'} />
                        </div>,
                        <div className={classes.selectButtonRow}>
                          {/* some grid cells will be taller than others, based on content. The real button is absolute positioned so they are all at the bottom of the grid cell 
                          We welcome an alternative to positioning the select button at the bottom of the grid cell when a cell is shorter than others in the row */}
                          <ModifierButton
                            className={cx(classes.selectSelectButton, point._id === selected && classes.selectedButton)}
                            title={`Select as Lead: ${point.subject}`}
                            tabIndex={0}
                            children="Select as Lead"
                            disabled={false}
                            disableOnClick={false}
                            onDone={() => {
                              setSelected(point._id)
                            }}
                          />
                        </div>,
                      ],
                      cx(classes.selectPointsPassDown, classes.noBoxShadow)
                    )}
                  </div>
                )
              })}
            </div>
          )}
          <div className={cx(classes.bottomButtons, classes.bottomButtonsOne)}>
            <SecondaryButton
              disabled={selected === ''}
              title="Done"
              tabIndex={0}
              children="Done"
              onDone={() => {
                const [p, g] = groupedPoints.reduce(
                  ([p, g], point) => {
                    if (point._id === selected) {
                      p = point
                      // need to flatten groupedPoints so children to not have children
                      if (point.groupedPoints) {
                        g.push(...point.groupedPoints)
                      }
                    } else {
                      g.push(point)
                      // need to flatten groupedPoints so children to not have children
                      if (point.groupedPoints) {
                        g.push(...point.groupedPoints)
                        delete point.groupedPoints
                      }
                    }
                    return [p, g]
                  },
                  [undefined, []]
                )
                const newPointObj = {
                  ...p,
                  groupedPoints: g,
                }
                setPointObj(newPointObj)
                onDone({
                  valid: true,
                  value: { pointObj: newPointObj },
                })
                setVState('edit')
                setExpanded(false)
              }}
            />
          </div>
        </div>
      )}

      {vs !== 'collapsed' && vs !== 'selectLead' && (
        <div
          className={cx(classes.borderStyle, classes.contentContainer, classes.informationGrid, {
            [classes.selectedBorder]: select,
          })}
        >
          {!singlePoint && (
            <div className={classes.SvgContainer}>
              {expanded ? (
                <TextButton
                  onClick={e => {
                    e.stopPropagation()
                    setExpanded(false)
                  }}
                  title="collapse"
                  tabIndex={0}
                >
                  <span className={classes.chevronButton}>
                    <SvgChevronUp />
                  </span>
                </TextButton>
              ) : (
                <TextButton
                  onClick={e => {
                    e.stopPropagation()
                    setExpanded(true)
                  }}
                  title="expand"
                  tabIndex={0}
                >
                  <span className={classes.chevronButton}>
                    <SvgChevronDown />
                  </span>
                </TextButton>
              )}
            </div>
          )}
          {subject && <div className={cx(classes.subjectStyle)}>{subject}</div>}
          {description && <div className={cx(classes.descriptionStyle)}>{description}</div>}
          {user && <DemInfo user={user} />}
          {vs === 'edit' && expanded && !singlePoint && (
            <div className={classes.defaultWidth}>
              {!singlePoint && <p className={classes.titleGroup}>Edit the response you'd like to lead with</p>}
              <div className={classes.selectPointsContainer}>
                {groupedPoints.map((point, leadIndex) => {
                  return (
                    <div key={point._id} className={classes.selectPoints}>
                      {CreatePoint(
                        point,
                        'default',
                        [
                          <DemInfo user={point.user} />,
                          <div className={classes.pointBottomButtons}>
                            <div className={classes.pointWidthButton}>
                              <ModifierButton
                                className={classes.pointWidthButton}
                                title={`Select as Lead: ${point.subject}`}
                                children="Select as Lead"
                                tabIndex={0}
                                onDone={() => {
                                  const newPointObj = {
                                    ...point,
                                    groupedPoints: [soloPoint, ...groupedPoints.filter((e, i) => i !== leadIndex)],
                                  }
                                  setPointObj(newPointObj)
                                  onDone({
                                    valid: true,
                                    value: { pointObj: newPointObj },
                                  })
                                }}
                                disabled={false}
                                disableOnClick={false}
                              />
                            </div>
                            <div className={classes.pointWidthButton}>
                              <TextButton
                                className={classes.pointWidthButton}
                                title={`Remove from Group: ${point.subject}`}
                                tabIndex={0}
                                children="Remove from Group"
                                onDone={() => {
                                  const newPointObj = {
                                    ...soloPoint,
                                    groupedPoints: groupedPoints.filter((e, i) => i !== leadIndex),
                                  }
                                  setPointObj(newPointObj)
                                  onDone({
                                    valid: true,
                                    value: { pointObj: newPointObj, removedPointObjs: [point] },
                                  })
                                }}
                              />
                            </div>
                          </div>,
                        ],
                        cx(classes.selectPointsPassDown, classes.noBoxShadow)
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {vs !== 'edit' && expanded && (
            <div className={classes.defaultWidth}>
              {!singlePoint && <p className={classes.titleGroup}>Other Responses</p>}
              <div className={classes.selectPointsContainer}>
                {groupedPoints.map(point => {
                  return (
                    <div key={point._id} className={classes.selectPoints}>
                      {CreatePoint(point, 'default', null, cx(classes.selectPointsPassDown, classes.noBoxShadow))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {(vs === 'edit' || vs === 'selectLead') && !singlePoint && (
            <div className={cx(classes.bottomButtons, classes.bottomButtonsTwo)}>
              {expanded ? (
                <SecondaryButton
                  className={classes.doneButton}
                  onDone={() => {
                    setExpanded(false)
                  }}
                  title="Done"
                  tabIndex={0}
                  children="Done"
                  disableOnClick={true}
                />
              ) : (
                <ModifierButton
                  className={classes.editButton}
                  onDone={() => {
                    setVState('edit')
                    setExpanded(true)
                  }}
                  title="Edit"
                  tabIndex={0}
                  children="Edit"
                  disableOnClick={true}
                />
              )}
              <TextButton
                className={classes.ungroupButton}
                title="Ungroup"
                tabIndex={0}
                children="Ungroup"
                onDone={() => {
                  const newPointObj = {
                    ...soloPoint,
                    groupedPoints: [],
                  }
                  setPointObj(newPointObj)
                  onDone({
                    valid: true,
                    value: { pointObj: newPointObj, removedPointObjs: groupedPoints },
                  })
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  borderStyle: {
    borderRadius: '0.9375rem',
    boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.5rem rgba(217, 217, 217, 0.40)',
    '&:hover': {
      outline: `0.1875rem solid ${theme.colors.success}`,
    },
    '&:hover $defaultSubject': {
      color: theme.colors.success,
    },
    '&:hover $defaultDescription': {
      color: theme.colors.success,
    },
  },

  collapsedBorder: {
    borderRadius: '0 !important',
    boxShadow: 'none !important',
    backgroundColor: 'rgba(235, 235, 235, 0.30)',
    '& $contentContainer': {
      padding: '1.25rem',
    },
  },

  subjectStyle: {
    ...theme.font,
    fontSize: '1.25rem',
    fontWeight: '400',
    lineHeight: '1.875rem',
  },

  collapsedSubject: {
    color: theme.colors.title,
    ...theme.font,
    fontSize: '1rem !important',
    fontWeight: '400',
    lineHeight: '1.5rem !important',
  },

  descriptionStyle: {
    ...theme.font,
    alignSelf: 'stretch',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5rem',
  },

  contentContainer: {
    padding: '2.1875rem 1.875rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.625rem',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    '& :focus': {
      outline: theme.focusOutline,
    },
  },

  defaultWidth: {
    width: '100%',
  },

  informationGrid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.9375rem',
    alignSelf: 'stretch',
  },

  editButton: {
    width: '8rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '7rem',
    },
  },

  ungroupButton: {},

  doneButton: {
    width: '17rem',
    '& :focus': {
      outline: theme.focusOutline,
    },
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '7rem',
    },
  },

  titleGroup: {
    ...theme.font,
    fontSize: '1rem',
    color: '#5d5d5d',
    fontWeight: '600',
    lineHeight: '1.5rem',
  },

  bottomButtonsTwo: {},
  bottomButtonsOne: {},

  bottomButtons: {
    width: '100%',
    padding: '1.5rem 1rem 0 1rem',
    display: 'flex',
    '&$bottomButtonsTwo': {
      '& span': {
        flex: '0 0 50%',
        textAlign: 'center',
        '$ :focus': {
          outline: theme.focusOutline,
        },
      },
    },
    '&$bottomButtonsOne': {
      '& span': {
        flex: '0 0 100%',
        textAlign: 'center',
        '$ :focus': {
          outline: theme.focusOutline,
        },
      },
    },
  },

  pointBottomButtons: {
    width: '100%',
    textAlign: 'center',
  },

  SvgContainer: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '1.5rem',
  },

  selectPointsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(calc(min(100%,20rem)), 1fr))',
    gap: '2rem',
    width: '100%',
  },

  selectPoints: {
    position: 'relative',
    flex: '1 1 41%',
    height: 'inherit',
    // margin: '1rem 1.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flex: '0 0 100%',
      margin: '1rem 0',
    },
  },

  selectPointsPassDown: {
    height: '100%',
  },

  pointWidthButton: {
    margin: '.5rem',
  },

  invisibleElement: {
    width: '100%',
    visibility: 'hidden',
  },

  selectButtonRow: {
    position: 'absolute',
    bottom: '1rem',
    left: 0,
    width: '100%',
    textAlign: 'center',
  },

  selectSelectButton: {
    width: '75%',
  },

  selectedButton: {
    backgroundColor: theme.colors.encivYellow,
    '&:hover, &.hover': {
      backgroundColor: theme.colors.encivYellow,
    },
  },

  chevronButton: {
    '& svg': {
      fontSize: '1.5rem',
      background: 'none',
      color: 'inherit',
      padding: 0,
      border: 'none',
      outline: 'inherit',
      '&:hover': {
        background: 'none',
        color: 'none',
      },
    },
  },

  noBoxShadow: {
    boxShadow: 'none',
    border: '1px solid rgba(217, 217, 217, 0.40)',
  },
  selectedSubject: {
    color: theme.colors.success,
  },
  selectedDescription: {
    color: theme.colors.success,
  },
  selectedBorder: {
    outline: `0.1875rem solid ${theme.colors.success}`,
    background: theme.colors.lightSuccess,
    '& $informationGrid': {
      color: theme.colors.success,
    },
  },
}))

export default PointGroup
