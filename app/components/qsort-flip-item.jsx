'use strict';

import React              from 'react';
import ItemStore          from '../components/store/item';
import Item               from '../components/item';

class QSortFlipItem extends React.Component {


    render(){
        const {qbuttons, sectionName, item, user, rasp } = this.props;

        return(
                <div style={{backgroundColor: qbuttons[sectionName].color}} key={ `item-${item._id}` }>
                    <ItemStore item={ item } key={ `item-${item._id}` }>
                        <Item
                            item    =   { item }
                            user    =   { user }
                            buttons =   { ['QSortButtons'] }
                            qbuttons =  {qbuttons}
                            rasp    =   { rasp }
                        />
                    </ItemStore>
                </div>
        );

    }
}

export default QSortFlipItem;