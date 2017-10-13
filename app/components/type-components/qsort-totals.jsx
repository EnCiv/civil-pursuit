'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion          from 'react-proactive-accordion';
import config from '../../../public.json';
import PanelStore from '../store/panel';
import QSortFinale from '../type-components/qsort-finale';
import QSortButtonList from '../qsort-button-list';

export class QSortTotals extends React.Component {
    state = {typeList: null};
    render() {
        const { style, item, rasp } = this.props;
        if(!this.props.user) return null; // no panel if user not logged in
        else {
            const parent= (this.props.shared && this.props.shared.parent) || (this.props.panel && this.props.panel.parent) || this.props.parent || null;
            const type=(this.props.shared && this.props.shared.type) || (this.props.panel && this.props.panel.type) || this.props.type;
            const limit= Math.max(this.props.limit || 0, this.props.panel && this.props.panel.limit || 0);

            return (
                <div className="toggler totals" >
                    <Accordion
                        active={true}
                        style={style}
                    >
                        <PanelStore parent={parent} type={type} limit={limit} >
                            <QSortTotalsPanel {...this.props} />
                        </PanelStore>
                    </Accordion>
                </div>
            )
        }
    }
}

class QSortTotalsPanel extends React.Component {
    render() {
        var sections={};
        Object.keys(QSortButtonList).forEach(s=>sections[s]=[]);
        return (
            <QSortFinale {...this.props} shared={{ items: this.props.panel && this.props.panel.items, sections }} />
        )
    }
}

export default QSortTotals;
