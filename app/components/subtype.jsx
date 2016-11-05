'use strict';

import React                      from 'react';
import Loading                    from './util/loading';
import PanelItems                 from './panel-items';
import makePanelId                from '../lib/app/make-panel-id';
import itemType                   from '../lib/proptypes/item';
import panelType                  from '../lib/proptypes/panel';
import PanelStore                 from './store/panel';

class Subtype extends React.Component {

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
    const { panel, type, user, parent, active } = this.props;

    let content = ( <Loading message="Loading related" /> );

      content = (
        <PanelStore type={ type} parent={ parent }>
          <PanelItems user={ user } />
        </PanelStore>
      );

    return (
      <section className={`item-subtype ${this.props.className}`}>
        { content }
      </section>
    );
  }
}

export default Subtype;
