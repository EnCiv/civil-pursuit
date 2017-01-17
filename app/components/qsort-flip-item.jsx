'use strict';

import React              from 'react';
import ItemStore          from '../components/store/item';
import Item               from '../components/item';
import QSortButtons       from './qsort-buttons';

class QSortFlipItem extends React.Component {


    render(){
        const {qbuttons, sectionName, item, user, toggle, buttonstate } = this.props;

        return(
                <div style={{backgroundColor: qbuttons[sectionName].color}}>
                    <ItemStore item={ item } key={ `item-${item._id}` }>
                        <Item
                            item    =   { item }
                            user    =   { user }
                            buttons =   { (
                                <ItemStore item={ item }>
                                    <QSortButtons
                                        item    =   { item }
                                        user    =   { user }
                                        toggle  =   { toggle }
                                        buttonstate = { buttonstate }
                                        qbuttons= { qbuttons }
                                        />
                                </ItemStore>
                            ) }
                            vs={{state: 'truncated'}}
                            toggle  =   { toggle }
                            focusAction={null}
                        />
                    </ItemStore>
                </div>
        );

    }
}

export default QSortFlipItem;