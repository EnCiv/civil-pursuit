'use strict';

import React from 'react';
import PanelStore from '../store/panel';
import Item from '../item';


exports.panel = class CreateHarmonyPanel extends React.Component {
    render() {
        const { item, side, buttons, ...otherProps } = this.props;  // side is passed through Item from it's parent .. qsort-why  buttons should not be passed to the child item
        const hIndex=side==='left' ? 0 : 1;

        if (item.type && item.type.harmony && item.type.harmony[hIndex]) {
            var type=item.type.harmony[hIndex];  // this type is only an Id
            return (
                <div className="toggler create-harmony" key={item._id + '-toggler-' + this.constructor.name}>
                    <PanelStore type={type} parent={item} own={true} >
                        <OneItemCreator {...otherProps} />
                    </PanelStore >
                </div>
            )
        } else
            return null;
    }
}

// this is intended for only one item.  If you were going to support more than one item, you would need to create a RASP and multiplex the multiple items.
class OneItemCreator extends React.Component {
    render (){
        const {panel, ...otherProps}=this.props;
        if(!panel) return null; // not ready yet
        const item=panel.items && panel.items.length ? panel.items[0] : {type: panel.type, parent: panel.parent}; // this type is an object, items must have at least one entry, to create them, must specify type and parent if applicable
        otherProps.rasp.shape=item.subject ? 'truncated' : 'edit';  // start in edit mode if item did not exist
        return (
                <Item
                    {...otherProps}
                    item={item}
                    visualMethod="edit"
                    key={'item-creator-'+item._id}
                />
        );
    }
}