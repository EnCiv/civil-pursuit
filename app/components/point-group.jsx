// https://github.com/EnCiv/civil-pursuit/issues/35

'use strict'

import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import Point from './point.jsx';

const PointGroup = (props) => {
  const { pointObj, vState, className, ...otherProps } = props;

  const classes = useStylesFromThemeFunction();

  const [isHovered, setIsHovered] = useState(false);

  const onMouseIn = () => {
    setIsHovered(true)
  };

  const onMouseOut = () => {
    setIsHovered(false)
  };

  return (
    <div>
      {pointObj}
      <p>This is the content of the App component.</p>
    </div>
  );
};

const useStylesFromThemeFunction = createUseStyles(theme => ({

}));

export default PointGroup;