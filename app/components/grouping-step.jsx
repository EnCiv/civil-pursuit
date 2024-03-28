// https://github.com/EnCiv/civil-pursuit/issue/49
'use strict'
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import Point from './point';

// creates a pointGroup, will render a single point if the pointObj contains no groupedPoints
// vState for Point: default, selected, disabled, collapsed
const CreatePointGroup = (pointObj, vState, children = null, className = null) => {
  const { subject, description } = pointObj;
  return (
    <PointG
      subject={subject}
      description={description}
      vState={vState}
      children={children}
      className={cx(className)}
    />
  )
}

export default function GroupingStep(props) {
  const { onDone, shared, className, ...otherProps } = props;
  // groupedPoints and pointList are both a list of pointObj
  // groupdPoints is shared across states (user may move back and forth between states)
  // pointList is the original list of points, we set groupedPoints to pointList if it is empty
  const { pointList, groupedPointList } = shared;
  const classes = useStylesFromThemeFunction(props);
  const [groupedPoints, setGroupedPoints] = useState([...groupedPointList]);


  useEffect(() => {
    if (groupedPoints.length === 0 || !groupedPoints) {
      setGroupedPoints([...pointList]);
    }
    onDone({ valid: true, value: groupedPoints });
  }, [groupedPoints, pointList, onDone]);

  return (
    <div className={cx(className)} {...otherProps}>
      {groupedPoints.map((point, index) => (
        <Point
          key={index}
          subject={point.subject}
          description={point.description}
          vState={point.vState}
        />
      ))}
    </div>
  );
}

const useStylesFromThemeFunction = createUseStyles((theme) => ({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  },
}));