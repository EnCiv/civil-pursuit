'use strict';

import React from 'react';
import PanelStore from '../store/panel';
import Item from '../item';
import {ReactActionStatePathFilter} from 'react-action-state-path';
import ObjectID from 'bson-objectid';

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
class OneItemCreator extends ReactActionStatePathFilter {
    constructor(props){
        super(props,'itemId',0); // parents key is itemId
    }

    componentDidMount(){
        // parent (QSortWhy) needs to be notified with POST_ITEM when the item is posted. If it's already there, it will be in panel.items when this is mounted, because PanelStore does not render children until there are items
        if(this.props.panel.items.length)
            this.queueAction({type: "POST_ITEM", item: this.props.panel.items[0], distance: 1, from: "OneItemCreator"});
        else {
            var _id=(new ObjectID()).toHexString();
            var item={_id, type: this.props.panel.type, parent: this.props.panel.parent}
            setTimeout(()=>this.props.PanelCreateItem(item));
        }
    }

    actionFilters={
        POST_ITEM: (action, delta)=>{
            if(action.from!=="OneItemCreator")  // don't react to my own actions
                setTimeout(()=>this.props.PanelCreateItem(action.item));
            return true; // let this one propagate further
        }
    }

    render (){
        const {panel, ...otherProps}=this.props;
        if(!(panel.items && panel.items.length)) return null;
        const item=panel.items[0];
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