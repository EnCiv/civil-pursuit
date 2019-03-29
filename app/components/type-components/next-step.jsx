'use strict';

import React from 'react';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHeading from '../panel-heading';

class NextStep extends React.Component {
    render(){
        return (
            <ReactActionStatePath {...this.props}>
                <PanelHeading items={[]} cssName={'syn-next-step'} panelButtons={['Instruction']}>
                    <RASPNextStep/>
                </PanelHeading>
            </ReactActionStatePath>
        )
    }
}

class RASPNextStep extends ReactActionStatePathClient {
    constructor(props) {
        super(props, 'itemId', 0);
    }

    render() {
        const { rasp,
                nextList=[
                    {   action: { type: "UNFOCUS_STATE", distance: (4- rasp.depth)},
                        title: "Move on to the next question",
                        name: "Continue to the next Question"
                    },
                    {   action: {type: "RESET_TO_BUTTON", nextPanel: 1},
                        title: "Provide another answer for this question",
                        name: "Contribute an Idea"
                    },
                    {   action: {type: "RESET_TO_BUTTON", nextPanel: 0},
                        title:  "Sort through more of the ideas that people have written",
                        name: "Sort More Ideas"
                    }
                ]
        } = this.props;

        return (
            <section id="syn-next-step">
                <div className="syn-next-step">
                    {   nextList.map(nextButton=>(
                            <button 
                                onClick={()=>rasp.toParent(nextButton.action)} 
                                className="syn-next-step-button"
                                title={nextButton.title}
                                key={nextButton.name}
                            >
                                <span>{nextButton.name}</span>
                            </button>
                    ))}
                </div>
            </section>
        );
    }
}

export default NextStep;



