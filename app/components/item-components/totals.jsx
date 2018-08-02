'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Accordion          from 'react-proactive-accordion';
import QSortButtonList from '../qsort-button-list';
import QSortItemsSummary from '../type-components/qsort-items-summary'

exports.button = class TotalsButton extends React.Component {
    donothing() {
        return false;
      }

    render() {
        const { active, item, requireAnswered } = this.props;
        var inactive=false;

        if( requireAnswered >1 && !item.answeredAll )  {
            inactive=true;
        } 

        if(requireAnswered==1 && !item.answerCount) { // requireAnswered is a string 
            inactive=true;
        } 
        const buttonName = this.props.buttonName || "Totals";
        const buttonTitle = this.props.buttonTitle || {
            active: "See the community summary",
            success: "Return to the higher level of this discusion",
            inactive: "Answer the question to see the summary - we need your fresh unbiased thinking"
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
    mounted = false;
    render() {
        const { active, style, item, rasp } = this.props;
        const type=this.props.type || this.props.item.subtype; // might be passed as part of the button definition
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
                        <QSortItemsSummary parent={this.props.item} type={type} qbuttons={this.props.qbuttons || QSortButtonList} rasp={rasp} />
                    </Accordion>
                </div>
            )
        }
    }
}

