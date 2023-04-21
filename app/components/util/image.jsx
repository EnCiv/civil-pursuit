'use strict';

import React from 'react';
import cx from 'classnames';
import injectSheet from 'react-jss'

const styles={
  'syn-img-responsive': {
    display: 'block',
    'max-width': '13em',
    'max-height': '7em',
    height: 'auto'
  }
}


class Image extends React.Component {
  render () {
    const {className, classes, src, onLoad}=this.props;

    let classNames = [];

    if ( this.props.responsive ) {
      classNames.push(classes['syn-img-responsive']);
    }

    return (
      <img alt="Synappp" src={ src } className={ cx(className, ...classNames) } onLoad={onLoad} />
    );
  }
}

export default injectSheet(styles)(Image);
