'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import ClassNames          from 'classnames';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const { heading, className, uim, noHeading } = this.props;
    const vState=uim ? uim.shape : '';
    const cState= vState ? 'vs-'+vState : '';


    return (
      <section
        { ...this.props }
        className     =   {ClassNames((className || ''), "syn-panel", cState )}
        ref           =   "panel"
      >
        <section className={ClassNames("syn-panel-heading", cState, {'no-heading': uim.shape==='collapsed'})}>
          { heading }
        </section>
        <section className={ClassNames("syn-panel-body", cState)}>
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;
