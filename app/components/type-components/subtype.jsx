'use strict';

import React                      from 'react';
import Loading                    from '../util/loading';
import PanelItems                 from '../panel-items';
import PanelStore                 from '../store/panel';

class Subtype extends React.Component {

  render () {
    const { panel } = this.props;
    const storeProps= panel ? panel : this.props;

    let content = ( <Loading message="Loading related" /> );

    // panelStore will fill the panel with items and replace this.prop.panel with the new on when it renders PanelItems
    // all other props are passed to PanelItems
      content = (
        <PanelStore { ...storeProps }>
          <PanelItems {...this.props} /> 
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
export {Subtype};