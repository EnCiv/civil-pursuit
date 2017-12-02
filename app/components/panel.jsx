'use strict';

import React                from 'react';
import ClassNames          from 'classnames';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const { children, heading, className, rasp, noHeading, ...sectionProps } = this.props;
    const vShape=rasp ? rasp.shape : '';
    const cShape= vShape ? 'vs-'+vShape : '';


    return (
      <section
        { ...sectionProps }
        className     =   {ClassNames((className || ''), "syn-panel", cShape )}
      >
        <section className={ClassNames("syn-panel-heading", cShape, {'no-heading': vShape==='collapsed'})}>
          { heading }
        </section>
        <section className={ClassNames("syn-panel-body", cShape)}>
          { children }
        </section>
      </section>
    );
  }
}

export default Panel;
