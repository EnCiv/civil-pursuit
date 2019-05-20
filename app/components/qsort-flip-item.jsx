'use strict';

import React              from 'react';
import ItemStore          from '../components/store/item';
import Item               from '../components/item';

class QSortFlipItem extends React.Component {
    render(){
        const {qbuttons, sectionName, item, user, buttons=['QSortButtons'], rasp } = this.props;
        return(
            <div key={ `item-${item._id}` }>
                <ItemStore item={ item } key={ `item-${item._id}` }>
                    <Item
                        style={{backgroundColor: qbuttons[sectionName].color}}
                        user    =   { user }
                        buttons =   { buttons }
                        qbuttons =  {qbuttons}
                        rasp    =   { rasp }
                    />
                </ItemStore>
            </div>
        );
    }
}

export default QSortFlipItem;