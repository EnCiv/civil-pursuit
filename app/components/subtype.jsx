'use strict';

import React                      from 'react';
import Loading                    from './util/loading';
import PanelItems                 from './panel-items';
import makePanelId                from '../lib/app/make-panel-id';
import itemType                   from '../lib/proptypes/item';
import panelType                  from '../lib/proptypes/panel';

class Subtype extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    item : itemType,
    active : React.PropTypes.bool,
    panels : React.PropTypes.arrayOf(panelType)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.id = makePanelId( { type : this.props.item.subtype, parent : this.props.item._id });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    if ( this.status === 'iddle' && props.active ) {
      this.status = 'ready';

      if ( ! props.panels[this.id] ) {
        window.Dispatcher.emit('get items', { type : props.item.subtype, parent : props.item._id });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let content = ( <Loading message="Loading related" /> );

    if ( this.props.panels[this.id] && this.status === 'ready' ) {
      content = <div>
        <PanelItems { ...this.props } panel={ this.props.panels[this.id] } />
      </div>;
    }

    return (
      <section className={`item-subtype gutter-top ${this.props.className}`}>
        { content }
      </section>
    );
  }
}

export default Subtype;
