'use strict';

import React              from 'react';
import ItemStore          from '../components/store/item';
import Item               from '../components/item';

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
                            collapsed =  { false }  //collapsed if there is an active item and it's not this one
                            toggle  =   { toggle }
                            focusAction={null}
                            truncateItems={null}
                        />
                    </ItemStore>
                </div>
        );

    }
}