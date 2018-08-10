'use strict';

import React from 'react';
import ItemStore from '../store/item';
import smoothScroll from '../../lib/app/smooth-scroll';
import QSortButtonList from '../qsort-button-list';
import QVoteTotals from '../store/qvote-totals';
import Accordion from 'react-proactive-accordion';
import Item from '../item';
import PanelHeading from '../panel-heading';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import union from 'lodash/union';
import RASPFocusHere from '../rasp-focus-here';
import ItemsQVoteSortStore from '../store/items-qvote-sort';
import publicConfig from '../../../public.json';

const styles = cssInJS({
    "synLoadMore": {
        'text-align': 'center'
    },
    "synLoadMoreButton": {
        padding: '0',
        'background-color': 'white',
        border: 'none'
    },
    "synLoadMoreButton:hover": {
        'background-color': '#e0eff'
    }
});

export default class QSortItemsSummary extends React.Component {
    state = { type: null, limit: publicConfig.dbDefaults.limit };

    constructor(props) {
        super(props);
        const { type } = props;
        this.state.limit=this.props.limit || publicConfig.dbDefaults.limit;
        if (typeof type === 'string' && typeof window !== 'undefined') {
            window.socket.emit('get listo type', [type], this.okGetListoType.bind(this))
        } else
            this.state.type=this.props.type;
    }

    okGetListoType(typeList) {
        if (typeList && typeList.length && typeList[0]._id === this.props.type)
            this.setState({ type: typeList[0] });
    }

    loadMore(){
        this.setState({limit: this.state.limit+10})

    }

    render() {
        if(!this.state.type) return null; // don't render until the type info has been filled in
        const QSortButtonList=this.props.qbuttons || QSortButtonList;
        var sort={};
        Object.keys(QSortButtonList).slice(1).forEach(key=>(sort[key]=-1));
        return (
                 <ItemsQVoteSortStore {...this.props} type={this.state.type} sort={sort} limit={this.state.limit}>
                    <ReactActionStatePath >
                        <RASPFocusHere filterTypes={['COMPONENT_DID_MOUNT',{type: 'DESCENDANT_FOCUS', distance: 1}, {type: 'DESCENDANT_FOCUS', distance: 2}]} >
                            <PanelHeading cssName={'syn-qsort-items-summary'} panelButtons={['Instruction']} >
                                <RASPQSortItemsSummary loadMore={this.loadMore.bind(this)} />
                            </PanelHeading>
                        </RASPFocusHere>
                    </ReactActionStatePath>
                </ItemsQVoteSortStore>
        );
    }
}

class RASPQSortItemsSummary extends ReactActionStatePathClient {
    state={loadMore: false};

    constructor(props) {
        super(props, 'shortId', 0);
        this.createDefaults();
    }

    actionToState(action, rasp, source, initialRASP, delta) {
        var nextRASP = {};
        if (action.type === "DESCENDANT_FOCUS" && action.distance > 0) {
            if (!action.shortId) logger.error("RASPQFortFinale.actionToState action without shortId", action);
            if (action.shortId) {
                delta.shortId = action.shortId;
                delta.shape = 'open';
                if (rasp.shortId) {
                    if (rasp.shortId !== action.shortId) {
                        this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
                    }
                }
            }
        } else if (action.type === "DESCENDANT_UNFOCUS" && (action.distance === 1 || action.distance==3)) {
            delta.shortId = null; // turn off the shortId
        } else if (action.type === "RESET") {
            if (this.props.resetStore) this.props.resetStore();
            return null;
        } else if (action.type === "TOGGLE_FOCUS" && rasp.shortId) {
            delta.shortId = null;
        } else if (action.type === "TOGGLE_FOCUS" && !rasp.shortId) {
            this.queueUnfocus(action);
        } else if (action.type==="UNFOCUS_STATE") {
            delta.shortId = null;
        } else if (action.type==="FOCUS_STATE") {
            if(action.shortId && this.toChild[action.shortId]) delta.shortId=action.shortId;
        } else if (Object.keys(delta).length) {
            ; // no need to do anything, it's been done. But do continue on to calculating the nextRASP
        } else
            return null;
        Object.assign(nextRASP, rasp, delta);
        if (nextRASP.shortId) nextRASP.shape = 'open';
        else nextRASP.shape = initialRASP.shape;
        if (nextRASP.shape === 'open') nextRASP.pathSegment = nextRASP.shortId;
        else nextRASP.pathSegment = null;
        return nextRASP;
    }

    // set the state from the pathSegment. 
    // the shortId is the path segment
    segmentToState(action) {
        var nextRASP = { shape: 'truncated', pathSegment: action.segment };
        var shortId = action.segment;
        if (!shortId) console.error("PanelItems.segmentToState no shortId found");
        else {
            nextRASP.shape = 'open';
            nextRASP.shortId = shortId;
        }
        return { nextRASP, setBeforeWait: false }
    }

    componentWillReceiveProps(newProps){
        if(this.state.loadMore && (this.props.items.length !== newProps.items.length))
            this.state.loadMore=false;  // no need to set state here the props change is going to cause the rerender anyway
    }

    shouldComponentUpdate(newProps){
        if(union(Object.keys(this.props.rasp),Object.keys(newProps.rasp)).some(key=>{
            if(['toParent','depth','raspId','creator','instruction'].includes(key)) return false;  // ignore these attributes.
            return(this.props.rasp[key]!==newProps.rasp[key])
        })) return true;
        if(this.props.items != newProps.items) {console.info("QSortFinaly.shouldComponentUpdate finale changed"); return true};
        if(this.props.items.length !== newProps.items.length) return true;
        if(this.props.limit !== newProps.limit) return true;
        return false;
    }

    loadMore(){
        this.setState({loadMore: true});
        this.props.loadMore();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const { user, rasp, items, total, type } = this.props;
        const { createMethod = "visible", promoteMethod = "visible", feedbackMethod = 'visible' } = type;
        const QSortButtonList=this.props.qbuttons || QSortButtonList;

        let content = [], direction = [], loading = [], loadMore=null;

        if (!items.length) {
            loading.push(
                <div key="loading" className="gutter text-center">
                    <p>Loading ...</p>
                </div>
            );
        } else {
            items.forEach(qitem => {
                var qbuttonTotals = [];
                Object.keys(QSortButtonList).forEach(button => qbuttonTotals[button] = Object.assign({}, QSortButtonList[button], { total: qitem.qvotes[button] || 0 }));
                let active = rasp.shortId ? rasp.shortId === qitem.id ? true : false : true;
                content.push(
                    {
                        user: user,
                        item: qitem,
                        buttons: [
                            { component: 'QSortButtons', qbuttons: qbuttonTotals },
                            {   component: 'Harmony', 
                                visualMethod: 'titleize', 
                                shape: 'title', 
                                limit: 5, 
                                hideFeedback: feedbackMethod==='hidden', 
                                createMethod: 'visible', 
                                promoteMethod: 'visible', 
                                active: active,
                                buttonName: 'Dissect'
                            }
                        ],
                        qbuttons: qbuttonTotals,
                        id: qitem._id,
                        rasp: this.childRASP('truncated', qitem.id),
                        active: active,
                        createMethod: createMethod,
                        promoteMethod: promoteMethod,
                        hideFeedback: feedbackMethod === 'hidden'
                    }
                );
            });
        }
        if(rasp.shortId){
            loadMore=null;
        } else if(this.state.loadMore){
            loadMore=(                
                <div className={styles["synLoadMore"]}>
                    {"loading ..."}
                </div>)
        } else if(items.length && items.length< total){
            loadMore=(
                <div className={styles["synLoadMore"]}>
                    <button className={styles["synLoadMoreButton"]} onClick={this.loadMore.bind(this)}>{items.length+' of '+total+' ...load 10 more'}</button>
                </div>
            )
        } else {
            loadMore=(
                <div className={styles["synLoadMore"]}>
                   {'Total '+items.length}
                </div>
            )
        }

        return (
            <section id="syn-qvote-item-summary">
                {direction}
                <div key="flip-list" style={{ position: 'relative', display: 'block' }}>
                    <div className="qsort-flip-move-articles">
                        {content.map(article => <QSortFlipItemHarmony {...article} key={article.id} />)}
                    </div>
                </div>
                {loading}
                {loadMore}
            </section>
        );
    }
}


class QSortFlipItemHarmony extends React.Component {
    render() {
        const { active, item, qbuttons, ...otherProps } = this.props;
        return (
            <Accordion active={active} name='item' key={item._id + '-qsort-item-summary'} style={{ backgroundColor: qbuttons['unsorted'].color }}>
               <Item {...otherProps} item={item} />
            </Accordion>
        );
    }
}