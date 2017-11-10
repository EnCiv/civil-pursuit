'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import PanelStore from '../store/panel';
import ItemCreator from '../item-creator';


exports.panel = class CreateHarmonyPanel extends React.Component {
    render() {
        const { style, item, rasp, side } = this.props;  // side is passed through Item from it's parent .. qsort-why
        const nextRASP = { shape: 'truncated', depth: rasp.depth, toParent: rasp.toParent } // RASP 1 to 1 case - subcomponents always start truncated, I'm not saving state so no change in depth, my parent is your parent
        const hIndex=side==='left' ? 0 : 1;


        if (item.harmony && item.harmony.types[hIndex]) {
            var type=item.harmony.types[hIndex];
            return (
                <div className="toggler create-harmony" key={item._id + '-toggler-' + this.constructor.name}>
                    <PanelStore type={type} parent={item} own={true} >
                        <ListItemCreators {...this.props} type={type} parent={item} item={undefined} rasp={nextRASP} />
                    </PanelStore >
                </div>
            )
        } else
            return null;
    }
}

class ListItemCreators extends React.Component {
    render (){
        console.info("ListItemCreators", this.props);
        var items=this.props.panel && this.props.panel.items && this.props.panel.items.length ? this.props.panel.items : [{}]; // items must have at least one entry
        return (
            <div>{
                items.map(item=>{
                    return (
                        <ItemCreator
                            {...this.props}
                            item={item}
                            key={'item-creator-'+item._id}
                        />
                    )
                })
            }</div>
        );
    }
}