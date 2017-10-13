'use strict';

import React from 'react';
import panelType from '../../lib/proptypes/panel';
import ItemStore from '../store/item';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item'
import smoothScroll from '../../lib/app/smooth-scroll';
import Color from 'color';
import Button           from '../util/button';
import QSortButtonList from '../qsort-button-list';
import Creator            from '../creator';
import Accordion          from 'react-proactive-accordion';
import Icon               from '../util/icon';
import RandomItemStore from '../store/random-item';
import QVoteStore from '../store/qvote';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import update from 'immutability-helper';
import PanelHead from '../panel-head';
import {RASPQSortItems} from './qsort-items';


// 8 is hard coded. But it should come from something user configurable
class QSortRandomItems extends React.Component {
    render(){
        logger.info("QSortRandomItems.render", this.props);
        return(
            <RandomItemStore parent={this.props.shared.parent || this.props.parent}
                        type={this.props.shared.type || this.props.type}
                        sampleSize={this.props.sampleSize || 8} >
                <QVoteStore {...this.props}>
                    <PanelHead  cssName={'syn-qsort-items'} >
                        <ReactActionStatePath>
                            <RASPQSortItems />
                        </ReactActionStatePath>
                    </PanelHead>
                </QVoteStore>
            </RandomItemStore>
        );
    }
}


export default QSortRandomItems;
