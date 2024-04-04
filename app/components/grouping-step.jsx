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
import StepFooter from './step-footer';
import StepIntro from './step-intro';
import StatusBadge from './status-badge';


export default function GroupingStep(props) {
  const { onDone, shared, className, ...otherProps } = props;
  const { pointList, groupedPointList } = shared;
  
  const classes = useStylesFromThemeFunction(props);
  const [groupedPoints, setGroupedPoints] = useState([...groupedPointList]);
  const [groupsCreated, setGroupsCreated] = useState(0);
  const [responseSelected, setResponseSelected] = useState(0);
  
  useEffect(() => {
    if (groupedPoints.length === 0 || !groupedPoints) {
      setGroupedPoints([...pointList]);
    }
    onDone({ valid: true, value: groupedPoints });
  }, [groupedPoints, pointList, onDone]);

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <StepIntro 
      subject = "Group Response"
      description = "Of these issues, please group similar responses to facilitate your decision-making by avoiding duplicates. If no duplicates are found, you may continue to the next section below."
      />
      <div className={classes.statusContainer}>
        <div className={classes.statusBadges}>
          <StatusBadge name="Groups Created" status="" number={groupsCreated} />
          <StatusBadge name="Response Selected" status="" number={responseSelected} />
        </div>
        <div className={classes.buttons}>
          <PrimaryButton>Create Group</PrimaryButton>
          <SecondaryButton>+ Add to Existing Group</SecondaryButton>
        </div>
      </div>
      <div className={classes.groupsContainer}>
        {groupedPoints.map((point, index) => (
          <PointGroup key={index} pointObj={point} vState={point.vState} />
        ))}
      </div>
      <StepFooter onDone={onDone} />
    </div>
  );
}

const useStylesFromThemeFunction = createUseStyles((theme) => ({
  wrapper: {
  },
  groupsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '2.5 rem',
  },
  buttons: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: '0',
  },
  statusBadges: {
    display: 'flex',
    alignItems: 'center',
  },
}));