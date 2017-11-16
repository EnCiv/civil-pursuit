'use strict';

import React from 'react';
import Accordion from 'react-proactive-accordion';
import Icon from '../util/icon';
import ItemStore from '../store/item';
import PanelStore from '../store/panel';
import config from '../../../public.json';
import ReactActionStatePath from 'react-action-state-path';
import Item from '../item';
import PanelHead from '../panel-head';
import PanelItems from '../panel-items';
import RASPPanelItems from '../rasp-panel-items';

class AnswerCount extends React.Component {
    constructor(props) {
        super(props);
        this.updateSort(props);
        this.state = { sortedItems: [], answeredAll: false };
    }

    index = [];

    updateSort(props) {
        let parentId;
        if (parentId = ((props.parent && props.parent._id) || (props.panel && props.panel.parent && props.panel.parent._id) || props.parent || (props.panel && props.panel.parent))) {
            window.socket.emit("get qvote item parent count", parentId, this.okGetQVoteItemParentCount.bind(this))
            props.panel.items.forEach((item, i) =>{
                 this.index[item._id] = item; // indexify the items
                 if(typeof item.answeredAll === 'undefined') item.answeredAll=false;
                 if(typeof item.answerCount === 'undefined') item.answerCount=0;
            })
        }
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.panel || !newProps.panel.items) return;
        if (!this.props.panel) return this.updateSort(newProps);
        if ((newProps.panel.items !== this.props.panel.items) || (newProps.panel.items.length != this.props.panel.items.length) || newProps.panel.items.some((item, i) => item._id != this.props.panel.items[i]._id))
            this.updateSort(newProps);
        if (this.props.rasp.shape === 'title' && newProps.rasp.shape !== 'title') {
            let parentId;
            if (parentId = ((newProps.parent && newProps.parent._id) || (newProps.panel && newProps.panel.parent && newProps.panel.parent._id) || newProps.parent || (newProps.panel && newProps.panel.parent)))
                window.socket.emit("get qvote item parent count", parentId, this.okGetQVoteItemParentCount.bind(this)); // update votes
        }
    }

    okGetQVoteItemParentCount(results) {
        // index points to the items, so does panel.items.  Changing answerCount through either pointer changes the item pointed to, which can be referenced by either pointer.  Think 'C' pointers.
        if (results) {
            results.forEach(result => {
                if((typeof this.index[result._id].answerCount !== 'undefined') && (this.index[result._id].answerCount !== result.count)) {
                    this.index[result._id].answerCount=result.count; // set it here but also notify child
                    this.props.rasp.toParent({type: "CHILD_UPDATE", shortId: result.id, item: {answerCount: result.count}});
                }
            })
        }
        var sortedItems = this.props.panel.items.slice().sort((a, b) => a.answerCount - b.answerCount)
        var answeredAll= !sortedItems.some(item=>item.answerCount===0)
        if(answeredAll !== this.state.answeredAll) 
            sortedItems.forEach(item=>{
                this.props.rasp.toParent({type: "CHILD_UPDATE", shortId: item.id, item: {answeredAll}});
                item.answeredAll=answeredAll;
            })
        this.setState({ sortedItems, answeredAll });
    }

    renderChildren(moreProps) {
        return React.Children.map(this.props.children, (child, i) => {
            var { children, ...newProps } = this.props;
            Object.assign(newProps, moreProps, { key: 'ph-' + i });
            return React.cloneElement(child, newProps, child.props.children)
        });
    }

    render() {
        return (
            <section>
                {this.renderChildren(this.state)}
            </section>
        )
    }
}

class RASPPanelQuestions extends RASPPanelItems {
    constructor(props){
        super(props);
        console.info("RASPPanelQuestions.constructor");
    }

    render() {

        const { limit, skip, type, parent, items, count, rasp, createMethod, cssName, sortedItems, panel, answeredAll, ...otherProps } = this.props;
        delete otherProps['new']; // this is a bad name for a property

        let title = 'Loading items', name, content, loadMore;

        let bgc = 'white';
        let positiveBGC = '#d3d3d3';

        var buttons = type.buttons || ['Answer'];

        content = sortedItems.map(item => {
            if (!this.mounted[item.id]) { // only render this once
                this.mounted[item.id] = (
                    <ItemStore item={item}>
                        <Item
                            {...otherProps}
                            parent={parent}
                            rasp={this.childRASP(this.vM.childShape(rasp, item), item.id)}
                            buttons={buttons}
                            visualMethod={this.vM.childVisualMethod()}
                        />
                    </ItemStore>
                );
            }
            return (
                <Accordion active={this.vM.childActive(rasp, item)} name='item' key={item._id + '-panel-item'} style={{ backgroundColor: (item.answerCount > 0 && rasp.shape === 'truncated') ? positiveBGC : bgc }} >
                    {this.mounted[item.id]}
                </Accordion>
            );
        });

        const end = skip + limit;

        return (
            <section>
                <Accordion active={answeredAll && !rasp.shortId} key="done-directions" >
                    <div className='instruction-text'>
                        {this.props.doneDirections || "Congratulations!! You have completed the community discussion.\n\nYou can use the Community button to see the overal response from the community.\n\n Be sure to come back to this discussion again to add things that you have thought of, or to check on the community response."}
                    </div>
                </Accordion>
                {content}
                {loadMore}
            </section>
        );
    }
}

export class PanelQuestions extends React.Component {
    render() {
        const { panel } = this.props;
        const storeProps = panel ? panel : this.props;

        logger.trace("PanelQuestions render");
        return (
            <PanelStore { ...storeProps }>
                <ReactActionStatePath {...this.props} >
                    <AnswerCount>
                        <PanelHead cssName={'syn-panel-item'} >
                            <RASPPanelQuestions />
                        </PanelHead>
                    </AnswerCount>
                </ReactActionStatePath>
            </PanelStore>
        );
    }
}


export default PanelQuestions;




