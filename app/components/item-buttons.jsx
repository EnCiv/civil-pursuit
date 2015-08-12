'use strict';

import React            from 'react';
import Button           from './util/button';
import Icon             from './util/icon';

class ItemButtons extends React.Component {
  render () {
    let { item } = this.props;

    return (
      <section className="item-buttons">
        <Button>
          {  item.promoted }
          <Icon icon="bullhorn" />
        </Button>
      </section>
    );
  }
}

export default ItemButtons;
