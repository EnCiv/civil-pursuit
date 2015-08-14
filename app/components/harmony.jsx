'use strict';

import React from 'react';
import Loading from './util/loading';
import Row from './util/row';
import Column from './util/column';
import Panel from './panel';

class Harmony extends React.Component {
  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = { left: null, right: null, irrelevant : false, loaded : false };
  }

  componentWillReceiveProps (props) {
    if ( props.show && this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  get () {
    if ( typeof window !== 'undefined' ) {

      let { harmony } = this.props.item.type;

      if ( ! harmony.length ) {
        this.setState({ irrelevant : true });
      }
      else {
        Promise.all([
          new Promise((ok, ko) => {
            window.socket.emit('get items', { type : harmony[0]._id, parent : this.props.item._id })
              .on('OK get items', (panel, items) => {
                if ( panel.type === harmony[0]._id ) {
                  ok({ panel, items });
                }
              })
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get items', { type : harmony[1]._id, parent : this.props.item._id })
              .on('OK get items', (panel, items) => {
                if ( panel.type === harmony[1]._id ) {
                  ok({ panel, items });
                }
              })
          })
        ])
        .then(
          results => {
            let [ left, right ] = results;
            this.setState({ left, right, loaded : true });
          }
        );
      }
    }
  }

  render () {
    let content = ( <Loading /> );

    let { irrelevant, left, right, loaded } = this.state;
    let { type } = this.props.item;

    if ( loaded ) {
      if ( irrelevant ) {
        content = ( <hr/> );
      }
      else if ( left || right ) {
        let panels = [];

        if ( left ) {
          panels.push(
            <Panel { ...left.panel } title={ type.harmony[0].name }>
              { left.items }
            </Panel>
          );
        }

        if ( right ) {
          panels.push(
            <Panel { ...right.panel } title={ type.harmony[1].name }>
              { right.items }
            </Panel>
          );
        }

        content = (
          <Row>
            <Column span="50">
              { panels[0] }
            </Column>

            <Column span="50">
              { panels[1] }
            </Column>
          </Row>
        );
      }
      else {
        content = ( <div>...</div> );
      }
    }

    return (
      <section className="subtype text-center">
        { content }
      </section>
    );
  }
}

export default Harmony;
