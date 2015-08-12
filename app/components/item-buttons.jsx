'use strict';

import React            from 'react';
import Button           from './util/button';
import Icon             from './util/icon';

class ItemButtons extends React.Component {
  render () {
    let { item } = this.props;

    console.log({ item });

    return (
      <section className="item-buttons">
        <Button>
          { item.promotions }
          <Icon icon="bullhorn" />
        </Button>

        <Button>
          { item.popularity.number + '%' }
          <Icon icon="signal" />
        </Button>
      </section>
    );
  }
}

export default ItemButtons;
