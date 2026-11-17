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
import { TextButton, SecondaryButton } from './button'
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

  const { group = [], point } = pG ?? {}
  const { subject, description, demInfo } = point ?? {}

  const singlePoint = !group || group.length === 0
  const [selected, setSelected] = useState('')
  const selectedLeadPoint = group.find(point => point._id === selected)
  const [isHovered, setIsHovered] = useState(false)
  const [isUngrouping, setIsUngrouping] = useState(false)
  const [ungroupResult, setUngroupResult] = useState(null)

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

  useEffect(() => {
    const mobile = window.matchMedia?.('(max-width: 40rem)').matches
    const isMobileModal = mobile && (vs === 'selectLead' || (vs === 'edit' && expanded && vState === 'editable'))
    if (!isMobileModal) return

    const body = document.body
    const root = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousRootOverflow = root.style.overflow
    body.style.overflow = 'hidden'
    root.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      root.style.overflow = previousRootOverflow
    }
  }, [vs, expanded, vState])

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
    <div
      className={cx(classes.pointGroup, vs === 'edit' && expanded && vState === 'editable' && classes.mobileEditModal, isUngrouping && classes.pointGroupExiting, className)}
      {...otherProps}
      onAnimationEnd={event => {
        if (event.target !== event.currentTarget || !isUngrouping) return
        setIsUngrouping(false)
        if (ungroupResult) onDone(ungroupResult)
      }}
    >
      {vs === 'collapsed' && (
        <div className={cx(classes.borderStyle, classes.collapsedBorder, classes.contentContainer, classes.informationGrid)}>{subject && <H className={cx(classes.subjectStyle, classes.collapsedSubject)}>{subject}</H>}</div>
      )}
      {vs === 'selectLead' && (
        <div className={cx(classes.borderStyle, classes.contentContainer, classes.selectLeadContent)}>
          <H className={cx(classes.titleGroup, classes.selectLeadTitle)}>Please select the response you want to lead with</H>
          <div className={classes.selectedLeadSummary} aria-live="polite">
            {selectedLeadPoint ? `${selectedLeadPoint.subject} selected as lead` : 'Make a selection'}
          </div>
          <div className={classes.SvgContainer}>
            <TextButton title="Ungroup and close" aria-label="Ungroup and Close" onClick={ungroupAndClose}>
              <span className={classes.chevronButton}>
                <SvgClose />
              </span>
            </TextButton>
          </div>
          <div className={cx(classes.expandableContent, expanded && classes.contentExpanded, classes.selectLeadExpandable)} aria-hidden={!expanded} inert={!expanded}>
            <div className={cx(classes.expandableContentInner, classes.selectLeadInner)}>
              <Level>
                <div className={cx(classes.selectPointsContainer, classes.selectLeadPointsContainer)}>
                  {group?.map(pD => {
                    return (
                      <div key={pD._id} className={classes.selectPoints}>
                        <div className={classes.selectionIndicator} aria-hidden="true">
                          <div className={cx(classes.radioIndicator, pD._id === selected && classes.checkedIndicator)} />
                        </div>
                        <Point
                          point={pD}
                          demInfoTopRight
                          vState={pD._id === selected ? 'selected' : 'default'}
                          className={cx(classes.selectPointsPassDown, classes.noBoxShadow, classes.leadSelectablePoint)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={pD._id === selected}
                          title={pD._id === selected ? `Selected as Lead: ${pD.subject}` : `Select as Lead: ${pD.subject}`}
                          aria-label={pD._id === selected ? `${pD.subject}, Selected as Lead` : `Select ${pD.subject} as Lead`}
                          onClick={() => {
                            setSelected(pD._id)
                          }}
                          onKeyDown={event => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              setSelected(pD._id)
                            }
                          }}
                        >
                          {pD._id === selected && <span className={classes.leadSelectedLabel}>Selected as Lead</span>}
                        </Point>
                      </div>
                    )
                  })}
                </div>
              </Level>
            </div>
          </div>
          <div className={cx(classes.bottomButtons, classes.bottomButtonsOne, classes.selectLeadActions)}>
            <span className={classes.buttonSpan}>
              <SecondaryButton
                className={classes.leadDoneButton}
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
              <SecondaryButton
                title="Ungroup this selection and close"
                children="Ungroup"
                onDone={ungroupAndClose}
              />
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
            vs === 'edit' && expanded && vState === 'editable' && classes.mobileEditContent,
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
          {subject && <H className={cx(classes.subjectStyle, vState === 'disabled' && classes.disabledSubject)}>{subject}</H>}
          {description && <div className={cx(classes.descriptionStyle, vState === 'disabled' && classes.disabledDescription)}>{description}</div>}
          {demInfo && <DemInfo {...demInfo} />}
          {childrenWithProps}
          {vs === 'edit' && expanded && vState === 'editable' && (
            <div className={cx(classes.SvgContainer, classes.mobileEditClose)}>
              <TextButton
                title="Done editing group"
                aria-label="Done editing group"
                onClick={() => {
                  setExpanded(false)
                  onDone({ valid: true, value: { pointGroup: pG } })
                }}
              >
                <span className={classes.chevronButton}><SvgClose /></span>
              </TextButton>
            </div>
          )}
          {vs === 'edit' && !singlePoint && (
            <div className={cx(classes.expandableContent, expanded && classes.contentExpanded, expanded && vState === 'editable' && classes.mobileEditExpandable)} aria-hidden={!expanded} inert={!expanded}>
              <div className={cx(classes.expandableContentInner, expanded && vState === 'editable' && classes.mobileEditInner)}>
                <div className={classes.defaultWidth}>
                  <H className={classes.titleGroup}>Select the response you'd like to lead with</H>
                  <Level>
                    <div className={cx(classes.selectPointsContainer, expanded && vState === 'editable' && classes.mobileEditPoints)}>
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
                          demInfoTopRight
                          vState={'default'}
                          className={cx(classes.selectPointsPassDown, classes.noBoxShadow, classes.leadSelectablePoint)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Select ${pD.subject} as Lead`}
                          title={`Select as Lead: ${pD.subject}`}
                          onClick={event => {
                            const interactive = event.target.closest('button, a, input, label, select, textarea, [role="button"], [role="link"], [role="radio"], [role="checkbox"], [role="switch"]')
                            if (interactive && interactive !== event.currentTarget) return
                            doSelectLead()
                          }}
                          onKeyDown={event => {
                            if (event.target !== event.currentTarget) return
                            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                              event.preventDefault()
                              doSelectLead()
                            }
                          }}
                        >
                          <div className={classes.pointBottomButtons}>
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
                      </div>
                  </Level>
                </div>
              </div>
            </div>
          )}
          {vs !== 'edit' && (
            <div className={cx(classes.expandableContent, expanded && classes.contentExpanded)} aria-hidden={!expanded} inert={!expanded}>
              <div className={classes.expandableContentInner}>
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
              </div>
            </div>
          )}
          {(vs === 'selectLead' || (vs === 'edit' && vState !== 'selectLead')) && !singlePoint && (
            <div className={cx(classes.bottomButtons, classes.bottomButtonsTwo, expanded && vState === 'editable' && classes.mobileEditActions)}>
              {expanded ? (
                <span>
                  <SecondaryButton
                    className={classes.leadDoneButton}
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
                  <SecondaryButton
                    className={cx(classes.leadDoneButton, classes.buttonPress)}
                    onDone={() => {
                      setVState('edit')
                      setExpanded(true)
                    }}
                    title="Edit Lead Point"
                    children="Edit Lead Point"
                    disableOnClick={true}
                  />
                </span>
              )}
              <span>
                <SecondaryButton
                  className={cx(classes.ungroupButton, classes.buttonPress)}
                  title="Ungroup"
                  children="Ungroup"
                  onDone={() => {
                    const pG = {
                      point,
                      group: [],
                    } // This is a point object, not a component
                    setUngroupResult({
                      valid: true,
                      value: { pointGroup: pG, removedPgs: group.map(pD => ({ point: pD, group: [] })) },
                    })
                    setIsUngrouping(true)
                  }}
                />
              </span>
            </div>
          )}
          {!singlePoint && (
            <TextButton
              className={cx(classes.expandButton, expanded && vState === 'editable' && classes.mobileEditExpandButton)}
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Collapse Group' : 'Expand Group'}
              aria-label={expanded ? 'Collapse Group' : 'Expand Group'}
              aria-expanded={expanded}
            >
              <span className={classes.chevronButton}>{expanded ? <SvgChevronUp /> : <SvgChevronDown />}</span>
            </TextButton>
          )}
        </div>
      )}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  pointGroup: {
    display: 'flex',
    width: '100%',
    minWidth: 0,
    containerType: 'inline-size',
    containerName: 'pointGroupActions',
  },
  mobileEditModal: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      width: '100vw',
      height: '100vh',
      height: '100dvh',
      overflow: 'hidden',
      backgroundColor: theme.colors.white,
      flexDirection: 'column',
      '& $expandButton': {
        display: 'none',
      },
      '& $selectionIndicator': {
        display: 'none',
      },
    },
  },
  pointGroupExiting: {
    animation: '$pointGroupExit 220ms ease-in both',
    pointerEvents: 'none',
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '1ms',
    },
  },
  '@keyframes pointGroupExit': {
    from: {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },
    to: {
      opacity: 0,
      transform: 'translateY(0.5rem) scale(0.98)',
    },
  },
  buttonPress: {
    transition: 'transform 120ms ease',
    '&:active:not(:disabled)': {
      transform: 'scale(0.97)',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
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
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      marginLeft: 0,
      marginRight: 0,
      padding: '1.25rem 1rem',
    },
  },

  selectLeadContent: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      marginLeft: 0,
      marginRight: 0,
      padding: 'calc(env(safe-area-inset-top) + 1rem) 1rem calc(env(safe-area-inset-bottom) + 0.75rem)',
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none',
      overflow: 'hidden',
      alignItems: 'stretch',
    },
  },

  selectLeadTitle: {
    paddingRight: '2.5rem',
  },

  selectedLeadSummary: {
    alignSelf: 'flex-start',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    backgroundColor: theme.colors.lightSuccess,
    color: theme.colors.success,
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: '1.25rem',
  },

  mobileEditContent: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      height: '100%',
      margin: 0,
      padding: 'calc(env(safe-area-inset-top) + 3.25rem) 1rem calc(env(safe-area-inset-bottom) + 0.5rem)',
      borderRadius: 0,
      boxShadow: 'none',
      overflow: 'hidden',
      alignItems: 'stretch',
    },
  },

  mobileEditClose: {
    display: 'none',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'block',
      top: 'calc(env(safe-area-inset-top) + 0.75rem)',
      right: '1rem',
      zIndex: 2,
    },
  },

  mobileEditExpandButton: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },

  mobileEditExpandable: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flex: '1 1 auto',
      minHeight: 0,
      '&$contentExpanded': {
        gridTemplateRows: 'minmax(0, 1fr)',
      },
    },
  },

  mobileEditInner: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      height: '100%',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
    },
  },

  mobileEditPoints: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      gap: '1.25rem',
      padding: '1rem 0.5rem 1.25rem',
    },
  },

  mobileEditActions: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      flexShrink: 0,
      gap: '0.75rem',
      padding: '0.75rem 0 calc(0.5rem + env(safe-area-inset-bottom))',
      '& > span': {
        width: '100%',
        flex: '0 0 auto',
      },
    },
  },

  selectLeadExpandable: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flex: '1 1 auto',
      minHeight: 0,
      '&$contentExpanded': {
        gridTemplateRows: 'minmax(0, 1fr)',
      },
    },
  },

  selectLeadInner: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  },

  selectLeadActions: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexShrink: 0,
      marginTop: 'auto',
      paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
    },
  },

  defaultWidth: {
    width: '100%',
  },

  expandableContent: {
    display: 'grid',
    gridTemplateRows: '0fr',
    opacity: 0,
    width: '100%',
    transition: 'grid-template-rows 300ms ease, opacity 200ms ease',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },

  contentExpanded: {
    gridTemplateRows: '1fr',
    opacity: 1,
  },

  expandableContentInner: {
    minHeight: 0,
    overflow: 'hidden',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      '&$mobileEditInner': {
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      },
    },
  },

  informationGrid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.9375rem',
    alignSelf: 'stretch',
  },

  buttonSpan: {
    display: 'flex',
    gap: '1.5rem',
    width: '100%',
    '& > button': {
      flex: '1 1 0',
      minWidth: 0,
      width: '50%',
    },
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      gap: '0.75rem',
      '& > button': {
        width: '100%',
      },
    },
  },

  leadDoneButton: {
    backgroundColor: `${theme.colors.primaryButtonBlue} !important`,
    color: `${theme.colors.white} !important`,
    border: `0.125rem solid ${theme.colors.primaryButtonBlue} !important`,
    '&:hover, &.hover, &:active': {
      backgroundColor: `${theme.colors.primaryButtonBlue} !important`,
      color: `${theme.colors.white} !important`,
      borderColor: `${theme.colors.primaryButtonBlue} !important`,
    },
    '&[aria-disabled="true"]': {
      backgroundColor: `${theme.colors.inactiveGray} !important`,
      color: `${theme.colors.white} !important`,
      borderColor: `${theme.colors.inactiveGray} !important`,
    },
  },

  ungroupButton: {},

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
      gap: '1.5rem',
      '& span': {
        flex: '1 1 0',
        minWidth: 0,
        textAlign: 'center',
      },
      '& span > button': {
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0,
      },
    },
    '&$bottomButtonsOne': {
      '& span': {
        flex: '0 0 100%',
        textAlign: 'center',
      },
    },
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '1rem 0.75rem 0',
    },
    '@container pointGroupActions (max-width: 34rem)': {
      '&$bottomButtonsTwo': {
        flexDirection: 'column',
        gap: '0.75rem',
        '& > span': {
          flex: '0 0 auto',
          width: '100%',
        },
        '& > span > button': {
          width: '100%',
          whiteSpace: 'nowrap',
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
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      top: 'calc(env(safe-area-inset-top) + 0.75rem)',
      right: '0.75rem',
    },
  },

  selectPointsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(calc(min(100%,20rem)), 1fr))',
    gap: '2rem',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem',
  },

  selectLeadPointsContainer: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '1.25rem',
    overflowX: 'auto',
    overflowY: 'auto',
    boxSizing: 'border-box',
    padding: '0.5rem 0.5rem 0.75rem',
    '& $selectPoints': {
      flex: '1 0 18rem',
      minWidth: '18rem',
    },
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      overflowX: 'hidden',
      overflowY: 'auto',
      gap: '1.25rem',
      padding: '1rem 0.5rem 1.25rem',
      '& $selectPoints': {
        flex: '0 0 auto',
        minWidth: 0,
        width: '100%',
        margin: 0,
      },
      flex: '1 1 auto',
      minHeight: 0,
      maxHeight: 'none',
    },
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

  leadSelectablePoint: {
    cursor: 'pointer',
  },

  pointWidthButton: {
    margin: '.5rem',
  },

  leadSelectedLabel: {
    alignSelf: 'flex-start',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    backgroundColor: theme.colors.lightSuccess,
    color: theme.colors.success,
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: '1.25rem',
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

  expandButton: {
    alignSelf: 'stretch',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '3rem',
    marginTop: '1.25rem',
    marginBottom: '-1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      minHeight: '2.75rem',
      marginTop: '0.75rem',
      marginBottom: '-0.75rem',
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
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
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
