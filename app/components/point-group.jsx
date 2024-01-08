// https://github.com/EnCiv/civil-pursuit/issues/35

'use strict'

import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import Point from './point.jsx';
import PointLeadButton from './point-lead-button.jsx';
import PointRemoveButton from './point-remove-button.jsx';




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


const RemovePoint = () => {
  return
}


const PointGroup = (props) => {
  const { pointObj, defaultVState, className, ...otherProps } = props;

  // vState for pointGroup: ['default', 'edit', 'view', 'selectLead']
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
      {vState == 'SelectLead' ? (
        <div>
        </div>
      ) : (
        <div className={cx(classes.borderStyle)}>
          <div className={classes.contentContainer}>
            <div className={classes.informationGrid}>
              {subject && <div className={cx(classes.subjectStyle)}>{subject}</div>}
              {description && (
                <div className={cx(classes.descriptionStyle)}>{description}</div>
              )}

              {vState == 'edit' && (
                <div>
                  <div>
                    <p className={classes.editParagraph}>Edit the response you'd like to lead with</p>
                    {groupedPoints.map(point => {
                      return (
                        <div className={classes.editPoints}>
                          {CreatePoint(point, 'default', [<PointLeadButton />, <PointRemoveButton />])}
                        </div>);
                    })}
                  </div>
                </div>
              )}
              <div className={classes.bottomButtons}>
                {vState == 'default' && (
                  <button className={classes.editButton} onClick={() => setVState('edit')}>Edit</button>)}
                {vState == 'edit' && (
                  <button className={classes.doneButton} onClick={() => setVState('default')}>Done</button>)}
                <a className={classes.ungroupButton}>Ungroup</a>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const useStylesFromThemeFunction = createUseStyles(theme => ({
  borderStyle: {
    borderRadius: '0.9375rem',
    boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.5rem rgba(217, 217, 217, 0.40)',
    width: '32rem',
  },

  subjectStyle: {
    ...theme.font,
    fontSize: '1.25rem',
    fontWeight: '400',
    lineHeight: '1.875rem',
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
    marginLeft: '2rem',
  },

  doneButton: {
    ...theme.font,
    backgroundColor: theme.colors.white,
    color: 'black',
    border: 'solid 0.125rem #000f4f',
    borderRadius: '0.5rem',
    padding: '0.625rem 4.75rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },

  editParagraph: {
    ...theme.font,
    fontSize: '1rem',
    color: '#5d5d5d',
    fontWeight: '600',
    lineHeight: '1.5rem',
  },

  editPoints: {
    margin: '2rem 0 0 0',
    width: '28rem',
  },

  bottomButtons: {
    padding: '1.5rem 1rem 0 1rem',
  }
}));

export default PointGroup;