// https://github.com/EnCiv/civil-pursuit/issues/35
// https://github.com/EnCiv/civil-pursuit/issues/80
// https://github.com/EnCiv/civil-pursuit/issues/390

'use strict'

import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Point from './point'
import SvgChevronUp from '../svgr/chevron-up'
import SvgChevronDown from '../svgr/chevron-down'
import SvgClose from '../svgr/close'
import { ModifierButton, TextButton, SecondaryButton } from './button'
import DemInfo from './dem-info'
import { H, Level } from 'react-accessible-headings'

// vState for Point: default, selected, disabled, collapsed
const PointGroup = props => {
  const { pointGroup, vState, select, children = [], className = '', onDone = () => {}, ...otherProps } = props
  const onClick = otherProps.onClick
  delete otherProps.onClick
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

  const ungroupAndClose = () => {
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
  }
  return (
    <div className={cx(classes.pointGroup, className)} {...otherProps}>
      {vs === 'collapsed' && (
        <div className={cx(classes.borderStyle, classes.collapsedBorder, classes.contentContainer, classes.informationGrid)}>{subject && <H className={cx(classes.subjectStyle, classes.collapsedSubject)}>{subject}</H>}</div>
      )}
      {vs === 'selectLead' && (
        <div className={cx(classes.borderStyle, classes.contentContainer)}>
          <H className={classes.titleGroup}>Please select the response you want to lead with</H>
          <div className={classes.SvgContainer}>
            <TextButton title="Ungroup and close" aria-label="Ungroup and close" onClick={ungroupAndClose}>
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
            <span className={classes.buttonSpan}>
              <SecondaryButton
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
              <SecondaryButton title="Ungroup" children="Ungroup" onDone={ungroupAndClose} />
            </span>
          </div>
        </div>
      )}
      {vs !== 'collapsed' && vs !== 'selectLead' && (
        <div
          className={cx(
            classes.borderStyle,
            classes.contentContainer,
            classes.informationGrid,
            {
              [classes.selectedBorder]: select,
              [classes.clickable]: (vState === 'view' || vState === 'editable') && vState !== 'disabled',
            },
            vState === 'disabled' && classes.disabledBorder
          )}
          {...((vState === 'view' || vState === 'editable') &&
            vState !== 'disabled' && {
              role: 'checkbox',
              'aria-checked': !!select,
              tabIndex: 0,
              'aria-label': `${select ? 'Deselect' : 'Select'} point group${subject ? `: ${subject}` : ''}`,
              title: select ? 'Selected for grouping' : 'Select for grouping',
              onClick: e => {
                const interactive = e.target.closest('button, a, input, label, select, textarea, [role="button"], [role="link"], [role="radio"], [role="checkbox"], [role="switch"]')
                if (interactive && interactive !== e.currentTarget) return
                onClick?.(e)
              },
              onKeyDown: e => {
                if (e.target !== e.currentTarget) return
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                  e.preventDefault()
                  onClick?.(e)
                }
              },
            })}
        >
          {/* Selection indicator checkbox for clickable points */}
          {(vState === 'view' || vState === 'editable') && (
            <div className={classes.selectionIndicator}>
              <div className={cx(classes.radioIndicator, select && classes.checkedIndicator)} aria-hidden="true" />
            </div>
          )}
          {!singlePoint && (
            <div className={classes.SvgContainer}>
              {expanded ? (
                <TextButton
                  onClick={e => {
                    e.stopPropagation()
                    setExpanded(false)
                  }}
                  title="collapse"
                  aria-label="Collapse group"
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
                  aria-label="Expand group"
                  tabIndex={0}
                >
                  <span className={classes.chevronButton}>
                    <SvgChevronDown />
                  </span>
                </TextButton>
              )}
            </div>
          )}
          {subject && <H className={cx(classes.subjectStyle, vState === 'disabled' && classes.disabledSubject)}>{subject}</H>}
          {description && <div className={cx(classes.descriptionStyle, vState === 'disabled' && classes.disabledDescription)}>{description}</div>}
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
                          <div className={classes.pointBottomButtons}>
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
                        <Point point={pD} className={cx(classes.selectPointsPassDown, classes.noBoxShadow)} vState={vState} />
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
                      // the pointGroup has changed, notify the parent
                      onDone({ valid: true, value: { pointGroup: pG } })
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
  pointGroup: {
    display: 'flex',
  },
  borderStyle: {
    borderRadius: '0.9375rem',
    boxShadow: theme.boxShadow,
    '&:hover': {
      outline: `0.1875rem solid ${theme.colors.success}`,
    },
    '&:hover $subjectStyle': {
      color: theme.colors.success,
    },
    '&:hover $descriptionStyle': {
      color: theme.colors.success,
    },
  },

  clickable: {
    cursor: 'pointer',
    '&:focus-visible': {
      outline: `${theme.focusOutline}`,
    },
    '&:focus-visible $selectionIndicator::before': {
      opacity: 1,
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
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
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

  buttonSpan: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
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
    right: '3.5rem',
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
  disabledSubject: {
    opacity: 0.5,
    color: theme.colors.title,
  },
  disabledDescription: {
    opacity: 0.5,
    color: theme.colors.title,
  },
  disabledBorder: {
    opacity: 0.5,
    outline: `1px solid ${theme.colors.borderGray}`,
    background: theme.colors.white,
    cursor: 'not-allowed',
    '&:hover ': {
      outline: 'none',
    },
  },

  // Selection indicator styles
  selectionIndicator: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    zIndex: 2,
    pointerEvents: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '2.25rem',
      height: '2.25rem',
      borderRadius: '50%',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: theme.colors.focusRing,
      opacity: 0,
      transition: 'opacity 0.2s ease',
      pointerEvents: 'none',
      zIndex: 0,
    },
  },

  radioIndicator: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    border: `0.125rem solid ${theme.colors.radioButtonUnselected}`,
    backgroundColor: 'white',
    position: 'relative',
    pointerEvents: 'none',
    zIndex: 1,
    display: 'inline-block',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '0.75rem',
      height: '0.75rem',
      borderRadius: '50%',
      backgroundColor: theme.colors.radioButtonSelected,
      transform: 'translate(-50%, -50%)',
      opacity: 0,
      transition: 'opacity 0.15s ease',
    },
  },

  checkedIndicator: {
    borderColor: theme.colors.radioButtonSelected,
    '&::after': {
      opacity: 1,
    },
  },
}))

export default PointGroup
