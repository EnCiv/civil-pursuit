// https://github.com/EnCiv/civil-pursuit/issues/35
// https://github.com/EnCiv/civil-pursuit/issues/80
// https://github.com/EnCiv/civil-pursuit/issues/253
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
  const { pointGroup, vState, select, children = [], className = '', onDone = () => {}, ...otherProps } = props
  // vState for pointGroup: ['default', 'edit', 'view', 'selectLead', 'collapsed']
  const [vs, setVState] = useState(vState === 'editable' ? 'edit' : vState)
  const [pG, setPg] = useState(pointGroup)
  const [expanded, setExpanded] = useState(vState === 'selectLead' || vState === 'edit')
  const classes = useStylesFromThemeFunction()

  const { group, point } = pG
  const { subject, description, demInfo } = point ?? {}

  const singlePoint = !group || group.length === 0
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
    setPg(pointGroup)
  }, [pointGroup]) // could be changed by parent component, or within this component

  return (
    <div className={cx(className)} {...otherProps}>
      {vs === 'collapsed' && (
        <div className={cx(classes.borderStyle, classes.collapsedBorder, classes.contentContainer, classes.informationGrid)}>{subject && <H className={cx(classes.subjectStyle, classes.collapsedSubject)}>{subject}</H>}</div>
      )}
      {vs === 'selectLead' && (
        <div className={cx(classes.borderStyle, classes.contentContainer)}>
          <H className={classes.titleGroup}>Please select the response you want to lead with</H>
          <div className={classes.SvgContainer}>
            <TextButton
              title="Ungroup and close"
              onClick={() => {
                setPg({})
                onDone({
                  valid: true,
                  value: {
                    pointGroup: undefined,
                    removedPgs: group.map(point => ({
                      point,
                    })),
                  },
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
                {group?.map(pD => {
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
                          {/* this is here to take up space for the height calculation of every grid cell, but not be visible */}
                          <ModifierButton children={'Select as Lead'} />
                        </div>
                        <div className={classes.selectButtonRow}>
                          {/* some grid cells will be taller than others, based on content. The real button is absolute positioned so they are all at the bottom of the grid cell
                          We welcome an alternative to positioning the select button at the bottom of the grid cell when a cell is shorter than others in the row */}
                          <ModifierButton
                            className={cx(classes.selectSelectButton, pD._id === selected && classes.selectedButton)}
                            title={`Select as Lead: ${pD.subject}`}
                            children={`Select as Lead`}
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
                  const [p, g] = group.reduce(
                    ([p, g], pD) => {
                      if (pD._id === selected) {
                        p = pD
                      } else {
                        g.push(pD)
                      }
                      return [p, g]
                    },
                    [undefined, []]
                  )
                  const newPg = {
                    point: p,
                    group: g,
                  } // This is a point object, not a component
                  setPg(newPg)
                  onDone({
                    valid: true,
                    value: { pointGroup: newPg },
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
                  {group.map((pD, leadIndex) => {
                    function doSelectLead() {
                      const newPg = {
                        point: pD,
                        group: [point, ...group.filter((e, i) => i !== leadIndex)],
                      }
                      setPg(newPg)
                      return newPg
                    }
                    return (
                      <div key={pD._id} className={classes.selectPoints}>
                        <Point
                          point={pD}
                          vState={'default'}
                          className={cx(classes.selectPointsPassDown, classes.noBoxShadow)}
                          onClick={() => {
                            const pointGroup = doSelectLead()
                            onDone({
                              valid: true,
                              value: { pointGroup },
                            })
                          }}
                        >
                          <div className={cx(classes.pointWidthButton, classes.selectLeadButton)}>
                            <div className={classes.pointWidthButton}>
                              <ModifierButton className={classes.pointWidthButton} title={`Select as Lead: ${pD.subject}`} children={`Select as Lead`} onDone={doSelectLead} disabled={false} disableOnClick={false} />
                            </div>
                            <div className={classes.pointWidthButton}>
                              <TextButton
                                className={classes.pointWidthButton}
                                title={`Remove from Group: ${pD.subject}`}
                                children="Remove from Group"
                                onDone={() => {
                                  const newPg = {
                                    point,
                                    group: group.filter((e, i) => i !== leadIndex),
                                  }

                                  setPg(newPg)
                                  onDone({
                                    valid: true,
                                    value: { pointGroup: newPg, removedPgs: [{ point: pD, group: [] }] },
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
                  {group.map(pD => {
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
                    const pG = {
                      point,
                      group: [],
                    } // This is a point object, not a component
                    setPg(pG)

                    onDone({
                      valid: true,
                      value: { pointGroup: pG, removedPgs: group.map(pD => ({ point: pD, group: [] })) },
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
    backgroundColor: `${theme.colors.pointDefault} !important`,
    outline: `0.1875rem solid ${theme.colors.pointDefault} !important`,
    padding: '2.1875rem 1.875rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1rem',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '1.1875rem 0.875rem',
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

  ungroupButton: {
    flex: '1 1 auto',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      maxWidth: '9rem',
      paddingLeft: '4rem',
    },
  },

  doneButton: {
    width: '17rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '16rem',
    },
  },

  titleGroup: {
    ...theme.font,
    fontSize: '1rem',
    color: '#5d5d5d',
    fontWeight: '600',
    lineHeight: '1.5rem',
    marginTop: '5rem',
  },

  bottomButtonsTwo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& span': {
      flex: '1 1 auto',
      textAlign: 'center',
      minWidth: '9rem',
    },
  },
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
    padding: '0rem 1rem 0 1rem',
    display: 'flex',
    marginTop: '1rem',
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
  },

  selectPoints: {
    position: 'relative',
    flex: '1 1 auto',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flex: '0 0 100%',
      margin: '0.5rem 0',
    },
  },

  selectPointsPassDown: {
    height: '100%',
  },

  pointWidthButton: {
    width: '100%',
    textAlign: 'center',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '100%',
    },
  },

  selectLeadButton: {
    marginTop: '1rem',
  },

  invisibleElement: {
    width: '100%',
    visibility: 'hidden',
  },

  selectButtonRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 3.75rem)',
    padding: '0 1.875rem',
    textAlign: 'center',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: 'calc(100% - 3.75rem)',
      padding: '1rem 0',
      bottom: '0.5rem',
    },
  },

  selectSelectButton: {
    width: '100%',

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
    boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.1rem rgba(217, 217, 217, 0.40) !important',
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
