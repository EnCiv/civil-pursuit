'use strict';

import React                      from 'react';
import Loading                    from './util/loading';
import PanelItems                 from './panel-items';
import makePanelId                from '../lib/app/make-panel-id';
import itemType                   from '../lib/proptypes/item';
import panelType                  from '../lib/proptypes/panel';
import PanelStore                 from './store/panel';

class Subtype extends React.Component {


  status = 'iddle';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (nextProps) {
    console.info("subtype.componentWillReceiveProps", nextProps, this);
    if ( this.status === 'iddle' && nextProps.active ) {
      this.status = 'ready';

      if ( ! nextProps.panels[this.id] ) {
        window.Dispatcher.emit('get items', { type : nextProps.item.subtype, parent : nextProps.item._id });
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
