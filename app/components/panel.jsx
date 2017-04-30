'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import ClassNames          from 'classnames';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const { heading, className, uim, noHeading } = this.props;
    const vShape=uim ? uim.shape : '';
    const cShape= vShape ? 'vs-'+vShape : '';


    return (
      <section
        { ...this.props }
        className     =   {ClassNames((className || ''), "syn-panel", cShape )}
        ref           =   "panel"
      >
        <section className={ClassNames("syn-panel-heading", cShape, {'no-heading': vShape==='collapsed'})}>
          { heading }
        </section>
        <section className={ClassNames("syn-panel-body", cShape)}>
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;
