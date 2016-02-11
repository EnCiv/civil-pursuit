'use strict';

import React                        from 'react';
import Loading                      from './util/loading';
import Row                          from './util/row';
import Column                       from './util/column';
import PanelItems                   from './panel-items';
import makePanelId                  from '../lib/app/make-panel-id';
import itemType                     from '../lib/proptypes/item';
import panelType                    from '../lib/proptypes/panel';
import PanelStore                   from './store/panel';

class Harmony extends React.Component {


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.status = 'iddle';

    const { harmony } = this.props.item;

    this.leftId = null;
    this.rightId = null;

    if ( harmony.types && harmony.types.length ) {
      this.leftId = makePanelId( { type : harmony.types[0], parent : this.props.item._id });

      this.rightId = makePanelId( { type : harmony.types[1], parent : this.props.item._id });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    if ( this.status === 'iddle' && props.active ) {
      this.status = 'ready';

      if ( ! props.panels[this.leftId] ) {
        window.Dispatcher.emit('get items', {
          type        :   props.item.harmony.types[0],
          parent      :   props.item._id
        });
      }

      if ( ! props.panels[this.rightId] ) {
        window.Dispatcher.emit('get items', {
          type        :   props.item.harmony.types[1],
          parent      :   props.item._id
        });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, user } = this.props;

    let contentLeft = ( <Loading message="Loading" /> );

    let contentRight = ( <Loading message="Loading" /> );

    if ( active ) {
      contentLeft = (
        <section className="harmony-pro">
          <PanelStore type={ item.harmony.types[0] } parent={ item }>
            <PanelItems user={ user } />
          </PanelStore>
        </section>
      );

      contentRight = (
        <section className="harmony-con">
          <PanelStore type={ item.harmony.types[1] } parent={ item }>
            <PanelItems user={ user } />
          </PanelStore>
        </section>
      );
    }

    return (
      <section className={`item-harmony ${this.props.className}`}>
        <Row data-stack="phone-and-down">
          <Column span="50">
            { contentLeft }
          </Column>
          <Column span="50">
            { contentRight }
          </Column>
        </Row>
      </section>
    );
  }
}

export default Harmony;
