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

exports.button = class TotalsButton extends React.Component {
    donothing() {
        return false;
      }

    render() {
        const { active, item, requireAnswered } = this.props;
        var inactive=false;

        if(requireAnswered && typeof item.answeredAll !== 'undefined') {
            inactive=!item.answeredAll;
        } 
        const buttonName = this.props.buttonName || "Totals";
        const buttonTitle = this.props.buttonTitle || {
            active: "See the community totals",
            success: "Return to the higher level of this discusion",
            inactive: "You need to participate before you can see the totals"
        };
        var number = ' ';
        var success = false;
        var title = "";
        var onClick=this.props.onClick;
        if(!this.props.user) return null; // no button if user not logged in

        if(inactive){
            onClick = this.donothing.bind(this);
            title = buttonTitle.inactive;
        } else if (active) {
            success = true;
            title = buttonTitle.success;
        } else {
            title = buttonTitle.active;
        }

        return (
            <ButtonGroup>
                <span className="civil-button-info">{number} </span>
                <Button small shy success={success} inactive={inactive} title={title} onClick={onClick} className="totals-button" title={title}>
                    <span className="civil-button-text">{buttonName}</span>
                </Button>
            </ButtonGroup>
        );
    }
}

exports.panel = class TotalsPanel extends React.Component {
    state = {typeList: null};
    mounted = false;
    render() {
        const { active, style, item, rasp } = this.props;
        const panelType=this.props.type || this.props.item.subtype; // might be passed as part of the button definition
        if(!this.props.user) return null; // no panel if user not logged in
        if ((this.mounted === false && active === false)) return null; // don't render this unless it's active, or been rendered before
        else {
            if (!this.mounted) {
                this.mounted = true;
            }
            return (
                <div className="toggler totals" key={item._id + '-toggler-' + this.constructor.name}>
                    <Accordion
                        active={active}
                        style={style}
                    >
                        <PanelStore parent={this.props.item}
                            type={panelType}
                            limit={20} >
                            <TotalsPanelShared {...this.props} >
                            </TotalsPanelShared>
                        </PanelStore>
                    </Accordion>
                </div>
            )
        }
    }
}

class TotalsPanelShared extends React.Component {
    render() {
        var sections={};
        let qbuttons=this.props.qbuttons || QSortButtonList;
        Object.keys(qbuttons).forEach(s=>sections[s]=[]);
        return (
            <QSortFinale {...this.props} shared={{ items: this.props.panel && this.props.panel.items, sections }} />
        )
    }
}
