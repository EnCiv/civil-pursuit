// https://github.com/EnCiv/civil-pursuit/issue/49

// groupedPoints and pointList are both a list of pointObj
// groupdPoints is shared across states (user may move back and forth between states)
// pointList is the original list of points, we set groupedPoints to pointList if it is empty
'use strict'
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import PointGroup from './point-group';
import { TextButton, PrimaryButton, SecondaryButton } from './button';
import StatusBadge from './status-badge';
import Point from './point';


// vState for Point: default, selected, disabled, collapsed
const CreatePoint = ({ pointObj, vState, children, className, onClick }) => {
  const { subject, description } = pointObj;
  return (
    <Point
      subject={subject}
      description={description}
      vState={vState}
      children={children}
      className={className}
      onClick={onClick}
    />
  );
};

export default function GroupingStep(props) {
  const { onDone, shared, className, ...otherProps } = props;
  const { pointList, groupedPointList } = shared;
  
  const classes = useStylesFromThemeFunction(props);
  const [groupedPoints, setGroupedPoints] = useState([...groupedPointList]);
  const [groupsCreated, setGroupsCreated] = useState(0);
  const [responseSelected, setResponseSelected] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState(new Array(groupedPoints.length).fill(false));
  
  useEffect(() => {
    if (groupedPoints.length === 0 || !groupedPoints) {
      setGroupedPoints([...pointList]);
    }
    onDone({ valid: true, value: groupedPoints });
  }, [groupedPoints, pointList, onDone]);

  useEffect(() => {
    const selectedCount = selectedPoints.filter(Boolean).length;
    setResponseSelected(selectedCount);
  }, [selectedPoints]);

  const togglePointSelection = (index) => {
    const updatedSelections = [...selectedPoints];
    updatedSelections[index] = !updatedSelections[index];
    setSelectedPoints(updatedSelections);
  };

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.statusContainer}>
        <div className={classes.statusBadges}>
          <StatusBadge name="Groups Created" status="" number={groupsCreated} />
          <StatusBadge name="Response Selected" status="" number={responseSelected} />
        </div>
        <div className={classes.buttons}>
          <div className={classes.primaryButton}>
          <PrimaryButton disabled={responseSelected < 2}>Create Group</PrimaryButton>
          </div>
          <SecondaryButton disabled={groupsCreated < 1}>+ Add to Existing Group</SecondaryButton>
        </div>
      </div>
      <div className={classes.groupsContainer}>
      {groupedPoints.map((point, index) => (
          <CreatePoint
            key={index}
            pointObj={point}
            vState={selectedPoints[index] ? "selected" : "default"}
            onClick={() => togglePointSelection(index)}
          />
        ))}
      </div>
    </div>
  );
}

const useStylesFromThemeFunction = createUseStyles((theme) => ({
  wrapper: {
  },
  groupsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    width: '100%',
    gap: '1.25rem', 
    // Ensure theme.condensedWidthBreakPoint is in pixels. Then, for the media query:
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
  statusContainer: {
    display: 'flex',
    marginTop: '2.5rem', 
    marginBottom: '2.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  buttons: {
    display: 'flex',
    marginLeft: 'auto',
    gap: '0.875rem',
    marginRight: '0',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      width: '100%',
      marginBottom: '1rem',
      order: -1,
      alignItems: 'center',
    }
  },
  primaryButton: {
  },
  statusBadges: {
    display: 'flex',
    marginTop: '0.5rem',
    gap: '0.875rem',
    align: 'center',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      marginTop: '0',
      width: '100%',
      justifyContent: 'center',
    }
  },
}));
