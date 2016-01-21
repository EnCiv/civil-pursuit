'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import Icon                 from './util/icon';
import Accordion            from './util/accordion';
import Loading              from './util/loading';
import Creator              from './creator';
import Join                 from './join';
import userType             from '../lib/proptypes/user';
import panelType            from '../lib/proptypes/panel';
import makePanelId          from '../lib/app/make-panel-id';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes    =   {
    heading : React.PropTypes.elem,
    className : React.PropTypes.string
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const { heading, className } = this.props;

    return (
      <section className={ className + " syn-panel" } ref="panel">
        <section className="syn-panel-heading">
          { heading }
        </section>
        <section className="syn-panel-body">
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;

import Item from './item';
