// https://github.com/EnCiv/civil-pursuit/issues/35
// https://github.com/EnCiv/civil-pursuit/issues/80
// https://github.com/EnCiv/civil-pursuit/issues/256

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
import { H, Level } from 'react-accessible-headings'

// vState for Point: default, selected, disabled, collapsed
const PointGroup = props => {
  const { pointDoc, vState, select, children = [], className = '', onDone = () => {}, ...otherProps } = props
  // vState for pointGroup: ['default', 'edit', 'view', 'selectLead', 'collapsed']
  const [vs, setVState] = useState(vState === 'editable' ? 'edit' : vState)
  const [pD, setPointDoc] = useState(pointDoc)
  const [expanded, setExpanded] = useState(vState === 'selectLead' || vState === 'edit')
  const classes = useStylesFromThemeFunction()
  const { groupedPoints, ...soloPoint } = pD // solopoint contains everything but groupedPoint, and "everything" can change so we use a spread
  const { subject, description, demInfo } = pD
  const singlePoint = !groupedPoints || groupedPoints.length === 0
  const [selected, setSelected] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const onMouseIn = () => {
    setIsHovered(true)
  }

  const onMouseOut = () => {
    setIsHovered(false)
  }

  const childrenWithProps = React.Children.map(children?.props?.children ?? children, child => {
    return React.cloneElement(child, {
      className: cx(child.props.className, { isHovered: isHovered }),
      vState: vState,
    })
  })

  useEffect(() => {
    setVState(vState === 'editable' ? 'edit' : vState)
    setExpanded(vState === 'selectLead' || vState === 'edit')
  }, [vState]) // could be changed by parent component, or within this component
  useEffect(() => {
    setPointDoc(pointDoc)
  }, [pointDoc]) // could be changed by parent component, or within this component

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
          {subject && <H className={cx(classes.subjectStyle, classes.collapsedSubject)}>{subject}</H>}
        </div>
      )}
      {vs === 'selectLead' && (
        <div className={cx(classes.borderStyle, classes.contentContainer)}>
          <H className={classes.titleGroup}>Please select the response you want to lead with</H>
          <div className={classes.SvgContainer}>
            <TextButton
              title="Ungroup and close"
              onClick={() => {
                setPointDoc({})
                onDone({
                  valid: true,
                  value: { pointDoc: undefined, removedPointDocs: groupedPoints },
                })
              }}
            >
              <span className={classes.chevronButton}>
                <SvgClose />
              </span>
            </TextButton>
          </div>
          {expanded && (
            <Level>
              <div className={classes.selectPointsContainer}>
                {groupedPoints?.map(pD => {
                  return (
                    <div key={pD._id} className={classes.selectPoints}>
                      <Point
                        point={pD}
                        vState={pD._id === selected ? 'selected' : 'default'}
                        className={cx(classes.selectPointsPassDown, classes.noBoxShadow)}
                        onClick={() => {
                          setSelected(pD._id)
                        }}
                      >
                        <div className={classes.invisibleElement}>
                          {/* this is here to take up space for the heigth calculation of every grid cell, but not be visible */}
                          <ModifierButton children={'Select as Lead'} />
                        </div>
                        <div className={classes.selectButtonRow}>
                          {/* some grid cells will be taller than others, based on content. The real button is absolute positioned so they are all at the bottom of the grid cell
                          We welcome an alternative to positioning the select button at the bottom of the grid cell when a cell is shorter than others in the row */}
                          <ModifierButton
                            className={cx(classes.selectSelectButton, pD._id === selected && classes.selectedButton)}
                            title={`Select as Lead: ${pD.subject}`}
                            children="Select as Lead"
                            disabled={false}
                            disableOnClick={false}
                            onDone={() => {
                              setSelected(pD._id)
                            }}
                          />
                        </div>
                      </Point>
                    </div>
                  )
                })}
              </div>
            </Level>
          )}
          <div className={cx(classes.bottomButtons, classes.bottomButtonsOne)}>
            <span>
              <SecondaryButton
                className={classes.secondaryButton}
                disabled={selected === ''}
                title="Done"
                children="Done"
                onDone={() => {
                  const [p, g] = groupedPoints.reduce(
                    ([p, g], pD) => {
                      if (pD._id === selected) {
                        p = pD
                        // need to flatten groupedPoints so children to not have children
                        if (pD.groupedPoints) {
                          g.push(...pD.groupedPoints)
                        }
                      } else {
                        g.push(pD)
                        // need to flatten groupedPoints so children to not have children
                        if (pD.groupedPoints) {
                          g.push(...pD.groupedPoints)
                          delete pD.groupedPoints
                        }
                      }
                      return [p, g]
                    },
                    [undefined, []]
                  )
                  const newPointDoc = {
                    ...p,
                    groupedPoints: g,
                  } // This is a point object, not a component
                  setPointDoc(newPointDoc)
                  onDone({
                    valid: true,
                    value: { pointDoc: newPointDoc, groupedPoints: [] },
                  })
                  setVState('edit')
                  setExpanded(false)
                }}
              />
            </span>
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
          {subject && <H className={cx(classes.subjectStyle)}>{subject}</H>}
          {description && <div className={cx(classes.descriptionStyle)}>{description}</div>}
          {demInfo && <DemInfo {...demInfo} />}
          {childrenWithProps}
          {vs === 'edit' && expanded && !singlePoint && (
            <div className={classes.defaultWidth}>
              {!singlePoint && <H className={classes.titleGroup}>Edit the response you'd like to lead with</H>}
              <div className={classes.selectPointsContainer}>
                <Level>
                  {groupedPoints.map((pD, leadIndex) => {
                    return (
                      <div key={pD._id} className={classes.selectPoints}>
                        <Point
                          point={pD}
                          vState={'default'}
                          className={cx(classes.selectPointsPassDown, classes.noBoxShadow)}
                        >
                          <div className={classes.pointBottomButtons}>
                            <div className={classes.pointWidthButton}>
                              <ModifierButton
                                className={classes.pointWidthButton}
                                title={`Select as Lead: ${pD.subject}`}
                                children="Select as Lead"
                                onDone={() => {
                                  const newPointDoc = {
                                    ...pD,
                                    groupedPoints: [soloPoint, ...groupedPoints.filter((e, i) => i !== leadIndex)],
                                  }
                                  setPointDoc(newPointDoc)
                                  onDone({
                                    valid: true,
                                    value: { pointObj: newPointDoc },
                                  })
                                }}
                                disabled={false}
                                disableOnClick={false}
                              />
                            </div>
                            <div className={classes.pointWidthButton}>
                              <TextButton
                                className={classes.pointWidthButton}
                                title={`Remove from Group: ${pD.subject}`}
                                children="Remove from Group"
                                onDone={() => {
                                  const newPointDoc = {
                                    ...soloPoint,
                                    groupedPoints: groupedPoints.filter((e, i) => i !== leadIndex),
                                  }
                                  setPointDoc(newPointDoc)
                                  onDone({
                                    valid: true,
                                    value: { pointDoc: newPointDoc, removedPointDocs: [pD] },
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </Point>
                      </div>
                    )
                  })}
                </Level>
              </div>
            </div>
          )}
          {vs !== 'edit' && expanded && (
            <div className={classes.defaultWidth}>
              {!singlePoint && <H className={classes.titleGroup}>Other Responses</H>}
              <Level>
                <div className={classes.selectPointsContainer}>
                  {groupedPoints.map(pD => {
                    return (
                      <div key={pD._id} className={classes.selectPoints}>
                        <Point point={pD} className={cx(classes.selectPointsPassDown, classes.noBoxShadow)} />
                      </div>
                    )
                  })}
                </div>
              </Level>
            </div>
          )}
          {(vs === 'edit' || vs === 'selectLead') && !singlePoint && (
            <div className={cx(classes.bottomButtons, classes.bottomButtonsTwo)}>
              {expanded ? (
                <span>
                  <SecondaryButton
                    className={classes.doneButton}
                    onDone={() => {
                      setExpanded(false)
                    }}
                    title="Done"
                    children="Done"
                    disableOnClick={true}
                  />
                </span>
              ) : (
                <span>
                  <ModifierButton
                    className={classes.editButton}
                    onDone={() => {
                      setVState('edit')
                      setExpanded(true)
                    }}
                    title="Edit"
                    children="Edit"
                    disableOnClick={true}
                  />
                </span>
              )}
              <span>
                <TextButton
                  className={classes.ungroupButton}
                  title="Ungroup"
                  children="Ungroup"
                  onDone={() => {
                    const newPointDoc = {
                      ...soloPoint,
                      groupedPoints: [],
                    } // This is a point object, not a component
                    setPointDoc(newPointDoc)
                    onDone({
                      valid: true,
                      value: { pointDoc: newPointDoc, removedPointDocs: groupedPoints },
                    })
                  }}
                />
              </span>
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
    boxShadow: theme.boxShadow,
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
    gap: '1rem',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
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
  secondaryButton: {

    width: '40%',

    '&:disabled': {

      opacity: '30%',

    },

  },
  bottomButtons: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '1.5rem 1rem 0 1rem',
    display: 'flex',
    '&$bottomButtonsTwo': {
      '& span': {
        flex: '0 0 50%',
        textAlign: 'center',
      },
    },
    '&$bottomButtonsOne': {
      '& span': {
        flex: '0 0 100%',
        textAlign: 'center',
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
    paddingBottom: '0.683rem',
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
  width: '85%',

    '&:focus': {

      outline: 'none',

    },
  },

  selectedButton: {
    backgroundColor: theme.colors.encivYellow,
    '&:hover, &.hover': {
      backgroundColor: theme.colors.encivYellow,
        outline: 'none',
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
