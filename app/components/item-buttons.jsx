'use strict';

import React            from 'react';
import Button           from './util/button';
import ButtonGroup      from './util/button-group';
import Icon             from './util/icon';

class ItemButtons extends React.Component {
  render () {
    let { item } = this.props;

    console.log({ item });

    return (
      <section className="item-buttons">
        <ButtonGroup>
          <Button small shy onClick={ this.toggleCreator.bind(this) }>
            <span>{ item.promotions } </span>
            <Icon icon="bullhorn" />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button small shy>
            <span>{ item.popularity.number + '%' } </span>
            <Icon icon="signal" />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button small shy>
            <span>{ item.promotions } </span>
            <Icon icon="fire" />
          </Button>

          <Button small shy>
            <span>{ item.popularity.number + '%' } </span>
            <Icon icon="music" />
          </Button>
        </ButtonGroup>
      </section>
    );
  }
}

export default ItemButtons;
