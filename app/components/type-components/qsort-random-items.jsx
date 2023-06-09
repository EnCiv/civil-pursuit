'use strict';

import React from 'react';
import Accordion from 'react-proactive-accordion';
import RandomItemStore from '../store/random-item';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import PanelHeading from '../panel-heading';
import { RASPQSortItems } from './qsort-items';
import RASPFocusHere from '../rasp-focus-here';


// 8 is hard coded. But it should come from something user configurable
class QSortRandomItems extends React.Component {
    constructor(props) {
        super(props);
        if (typeof window !== 'undefined' && this.props.type && this.props.type.harmony && this.props.type.harmony.length) {
            this.state = { typeList: null };
            this.getHarmony = true;
        } else
            this.getHarmony = false;
        Object.assign(this.props.shared, { parent: this.props.parent });
    }

    componentDidMount() {
        if (this.getHarmony)
            window.socket.emit('get listo type', this.props.type.harmony, this.okGetListoType.bind(this))
    }

    okGetListoType(typeList) {
        this.props.shared.type = typeList[0];
        this.setState({ typeList: typeList });
    }

    render() {
        const panelType=this.props.type;
        const randomType=this.props.shared.type;
        const randomParent=this.props.shared.parent;
        const randomItems=this.props.shared.items;

        if (this.getHarmony && !this.state.typeList)
            return null;
        else
            return (
                <ReactActionStatePath {...this.props} >
                    <RandomItemStore type={randomType} parent={randomParent} items={randomItems}>
                        <RASPFocusHere filterTypes={['FOCUS_STATE']}>
                            <PanelHeading type={panelType} cssName={'syn-qsort-random-items'} panelButtons={['Creator', 'Instruction']}>
                                <RASPQSortItems />
                            </PanelHeading>
                        </RASPFocusHere>
                    </RandomItemStore>
                </ReactActionStatePath>
            );
    }
}


export default QSortRandomItems;
