'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import ClassNames          from 'classnames';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const { heading, className, vs } = this.props;
    const vState=vs ? vs.state : '';
    const cState= vState ? 'vs-'+vState : '';


    return (
      <section
        { ...this.props }
        className     =   {ClassNames((className || ''), "syn-panel", cState )}
        ref           =   "panel"
      >
        <section className={ClassNames("syn-panel-heading", cState)}>
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
