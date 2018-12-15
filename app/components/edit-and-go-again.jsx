'use strict';

import React              from 'react';
import Item            from './item';

// untested - but converted from ItemCreator to Item

class EditAndGoAgain extends React.Component {
  render () {
    const { item } = this.props;

    return (
      <section className="edit-and-go-again">
        <Item
          item      =   { item }
          visualMethod={edit}
          rasp={Object.assign({},this.props.rasp,{shape: 'edit'})}
          />
      </section>
    );
  }
}

export default EditAndGoAgain;
