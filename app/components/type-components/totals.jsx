'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion          from 'react-proactive-accordion';
import TypeComponent from '../type-component';
import config from '../../../public.json';
import PanelStore from '../store/panel';
import QSortFinale from '../type-components/qsort-finale';
import QSortButtonList from '../qsort-button-list';

export default class Totals extends React.Component {
    render() {
        const { item } = this.props;
        return (
            <div className="toggler totals" key={item._id + '-toggler-' + this.constructor.name}>
                    <PanelStore parent={this.props.item}
                        type={this.props.type}
                        limit={this.props.limit || 20} >
                        <TotalsPanelShared {...this.props} >
                        </TotalsPanelShared>
                    </PanelStore>
            </div>
        )
    }
}

class TotalsPanelShared extends React.Component {
    render() {
        var sections={};
        const qbuttons=this.props.qbuttons || QSortButtonList;
        Object.keys(qbuttons).forEach(s=>sections[s]=[]);
        return (
            <QSortFinale {...this.props} shared={{ items: this.props.panel && this.props.panel.items, sections }} {...this.props.panel} />
        )
    }
}
