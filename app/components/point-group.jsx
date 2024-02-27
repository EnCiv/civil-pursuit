// https://github.com/EnCiv/civil-pursuit/issues/35

'use strict'

import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import Point from './point.jsx';
import SvgChevronUp from '../svgr/chevron-up';
import SvgChevronDown from '../svgr/chevron-down';
import SvgClose from '../svgr/close';
import Theme from './theme'
import { ModifierButton, TextButton, SecondaryButton } from './button.jsx'
import DemInfo from './dem-info.jsx'


// vState for Point: default, selected, disabled, collapsed
const CreatePoint = (pointObj, vState, children = null, className = null) => {
  const { subject, description } = pointObj;
  return (
    <Point
      subject={subject}
      description={description}
      vState={vState}
      children={children}
      className={cx(className)}
    />
  )
}


const PointGroup = (props) => {
  const { pointObj, defaultVState, className, ...otherProps } = props;

  // vState for pointGroup: ['default', 'edit', 'view', 'selectLead', 'collapsed']
  const [vState, setVState] = useState(defaultVState);
  const classes = useStylesFromThemeFunction();
  const { subject, description, groupedPoints, user } = pointObj;
  const singlePoint = groupedPoints.length === 0;


  return (
    <div className={cx(className)}{...otherProps}>
      {vState === 'collapsed' && (
        <div className={cx(classes.borderStyle, classes.collapsedBorder, classes.defaultWidth, classes.contentContainer, classes.informationGrid)}>
          {subject && <div className={cx(classes.subjectStyle, classes.collapsedSubject)}>{subject}</div>}
        </div>
      )}

      {vState === 'selectLead' && (
        <div className={cx(classes.borderStyle, classes.selectWidth, classes.contentContainer, classes.selectWidth)}>
          <p className={classes.titleGroup}>Please select the response you want to lead with</p>
          <div className={classes.SvgContainer}>
            <button className={classes.chevronButton}><SvgClose /></button>
          </div>
          <div className={classes.selectPointsContainer}>
            {groupedPoints.map(point => {
              return (
                <div key={point._id} className={classes.selectPoints}>
                  {CreatePoint(point, 'default', [<DemInfo user={point.user} />,
                  <div className={classes.selectSelectButton}>
                    <ModifierButton className={classes.selectSelectButton} title="Select as Lead" children="Select as Lead" onDone={null} disabled={false} disableOnClick={false} />
                  </div>
                  ],
                    cx(classes.selectPointsPassDown, classes.noBoxShadow))}
                </div>
              );
            })}
          </div>
          <div className={classes.selectButtonContainer}>
            <SecondaryButton className={classes.selectDoneButton} title="Done" children="Done" />
          </div>
        </div>
      )}

      {vState !== 'collapsed' && (vState !== 'selectLead') && (
        <div className={cx(classes.borderStyle, classes.defaultWidth, classes.contentContainer, classes.informationGrid)}>
          {!singlePoint && <div className={classes.SvgContainer}>
            {vState === 'default' && (<button className={classes.chevronButton} onClick={() => setVState('view')}><SvgChevronDown /></button>)}
            {vState === 'edit' && (<button className={classes.chevronButton} onClick={() => setVState('default')}><SvgChevronUp /></button>)}
            {vState === 'view' && (<button className={classes.chevronButton} onClick={() => setVState('default')}><SvgChevronUp /></button>)}
          </div>}
          {subject && <div className={cx(classes.subjectStyle)}>{subject}</div>}
          {description && (
            <div className={cx(classes.descriptionStyle)}>{description}</div>
          )}
          {user && <DemInfo user={user} />}
          {vState === 'edit' && (
            <div>
              {!singlePoint && <p className={classes.titleGroup}>Edit the response you'd like to lead with</p>}
              {groupedPoints.map(point => {
                return (
                  <div key={point._id} className={classes.subPoints} >
                    {CreatePoint(point, 'default', [<DemInfo user={point.user} />,
                    <div className={classes.pointWidthButton}>
                      <ModifierButton className={classes.pointWidthButton} title="Select as Lead" children="Select as Lead" onDone={null} disabled={false} disableOnClick={false} />
                    </div>,
                    <div className={classes.pointWidthButton}>
                      <TextButton className={classes.pointWidthButton} title="Remove" children="Remove from Group" />
                    </div>], classes.noBoxShadow)}
                  </div>);
              })}
            </div>
          )}
          {vState === 'view' && (
            <div>
              {!singlePoint && <p className={classes.titleGroup}>Other Responses</p>}
              {groupedPoints.map(point => {
                return (
                  <div key={point._id} className={classes.subPoints}>
                    {CreatePoint(point, 'view', null, classes.noBoxShadow)}
                  </div>);
              })}
            </div>
          )}
          {vState !== 'view' && !singlePoint && (
            <div className={classes.bottomButtons}>
              {vState === 'default' && (
                <ModifierButton className={classes.editButton} onDone={() => setVState('edit')} title="Edit" children="Edit" disableOnClick={true} />)}
              {vState === 'edit' && (
                <SecondaryButton className={classes.doneButton} onDone={() => setVState('default')} title="Done" children="Done" disableOnClick={true} />)}
              <TextButton className={classes.ungroupButton} title="Ungroup" children="Ungroup" />
            </div>)}
        </div>
      )
      }
    </div >
  );
};

const useStylesFromThemeFunction = createUseStyles(theme => ({
  fullWidth: {
    width: '100% !important',
  },
  borderStyle: {
    borderRadius: '0.9375rem',
    boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.5rem rgba(217, 217, 217, 0.40)',
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
  },

  defaultWidth: {
    width: '32rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '16rem',
    },
  },

  selectWidth: {
    width: '70rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '16rem',
    },
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
    marginLeft: '1.5rem',
    width: '5rem',
  },

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

  subPoints: {
    margin: '1.5rem 0',
    width: '28rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '17rem',
    },
  },

  bottomButtons: {
    padding: '1.5rem 1rem 0 1rem',
  },

  SvgContainer: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '1.5rem',
  },

  selectPointsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 1rem',
    width: '68rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '16rem',
      margin: '0',
    },
  },

  selectPoints: {
    flex: '0 0 45%',
    margin: '1rem 1.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flex: '0 0 100%',
      margin: '1rem 0',
    },
  },

  selectPointsPassDown: {
    height: '100%',
  },

  selectButtonContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },

  pointWidthButton: {
    width: '24rem',
    textAlign: 'center',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '13rem',
    },
  },

  selectDoneButton: {
    width: '18rem',
  },

  selectSelectButton: {
    width: '27rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '13rem',
    },
  },

  chevronButton: {
    background: 'none',
    color: 'inherit',
    padding: 0,
    border: 'none',
    outline: 'inherit',
    '&:hover': {
      background: 'none',
      color: 'none',
    }
  },

  noBoxShadow: {
    boxShadow: 'none',
    border: '1px solid rgba(217, 217, 217, 0.40)',
  },

}));

export default PointGroup;