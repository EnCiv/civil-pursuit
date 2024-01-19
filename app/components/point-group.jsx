// https://github.com/EnCiv/civil-pursuit/issues/35

'use strict'

import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import Point from './point.jsx';
import PointLeadButton from './point-lead-button.jsx';
import PointRemoveButton from './point-remove-button.jsx';
import SvgChevronUp from '../svgr/chevron-up';
import SvgChevronDown from '../svgr/chevron-down';
import SvgClose from '../svgr/close';

// vState for Point: default, selected, disabled, collapsed
const CreatePoint = (pointObj, vState, children = null) => {
  const { subject, description, groupedPoints } = pointObj;
  return (
    <Point
      subject={subject}
      description={description}
      vState={vState}
      children={children}
      groupedPoints={groupedPoints}
    />
  )
}


const PointGroup = (props) => {
  const { pointObj, defaultVState, className, ...otherProps } = props;

  // vState for pointGroup: ['default', 'edit', 'view', 'selectLead', 'collapsed']
  const [vState, setVState] = useState(defaultVState);
  const classes = useStylesFromThemeFunction();
  const [isHovered, setIsHovered] = useState(false);
  const { subject, description, groupedPoints } = pointObj;


  const onMouseIn = () => {
    setIsHovered(true)
  };

  const onMouseOut = () => {
    setIsHovered(false)
  };

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
            <SvgClose />
          </div>
          <div className={classes.selectPointsContainer}>
            {groupedPoints.map(point => {
              return (
                <div key={point._id} className={classes.selectPoints}>
                  {CreatePoint(point, 'default', [<PointLeadButton />])}
                </div>
              );
            })}
          </div>
          <div className={classes.selectButtonContainer}>
            <button className={cx(classes.doneButton, classes.selectDoneButton)}>Done</button>
          </div>
        </div>
      )}
      {vState !== 'collapsed' && vState !== 'selectLead' && (
        <div className={cx(classes.borderStyle, classes.defaultWidth, classes.contentContainer, classes.informationGrid)}>
          <div className={classes.SvgContainer}>
            {vState === 'default' && (<SvgChevronDown />)}
            {vState === 'edit' && (<SvgChevronUp />)}
            {vState === 'view' && (<SvgChevronUp />)}
          </div>
          {subject && <div className={cx(classes.subjectStyle)}>{subject}</div>}
          {description && (
            <div className={cx(classes.descriptionStyle)}>{description}</div>
          )}
          {vState === 'edit' && (
            <div>
              <p className={classes.titleGroup}>Edit the response you'd like to lead with</p>
              {groupedPoints.map(point => {
                return (
                  <div key={point._id} className={classes.subPoints} >
                    {CreatePoint(point, 'default', [<PointLeadButton />, <PointRemoveButton />])}
                  </div>);
              })}
            </div>
          )}
          {vState === 'view' && (
            <div>
              <p className={classes.titleGroup}>Other Responses</p>
              {groupedPoints.map(point => {
                return (
                  <div key={point._id} className={classes.subPoints}>
                    {CreatePoint(point, 'view')}
                  </div>);
              })}
            </div>
          )}
          {vState !== 'view' && (
            <div className={classes.bottomButtons}>
              {vState === 'default' && (
                <button className={classes.editButton} onClick={() => setVState('edit')}>Edit</button>)}
              {vState === 'edit' && (
                <button className={classes.doneButton} onClick={() => setVState('default')}>Done</button>)}
              <a className={classes.ungroupButton}>Ungroup</a>
            </div>)}
        </div>
      )}
    </div>
  );
};

const useStylesFromThemeFunction = createUseStyles(theme => ({
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
    ...theme.font,
    backgroundColor: theme.colors.white,
    color: 'black',
    border: 'solid 0.125rem' + theme.colors.encivYellow,
    borderRadius: '0.5rem',
    padding: '0.625rem 2.75rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },

  ungroupButton: {
    ...theme.font,
    backgroundColor: theme.colors.white,
    color: 'black',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    textDecoration: 'underline',
    marginLeft: '1.5rem',
  },

  doneButton: {
    ...theme.font,
    backgroundColor: theme.colors.white,
    color: 'black',
    border: 'solid 0.125rem #000f4f',
    borderRadius: '0.5rem',
    padding: '0.625rem 3rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
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

  selectButtonContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },

  selectDoneButton: {
    width: '16rem',
  },

}));

export default PointGroup;