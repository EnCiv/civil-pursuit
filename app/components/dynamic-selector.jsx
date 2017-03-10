'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import Select                         from './util/select';


class DynamicSelector extends React.Component {

    state={loaded: false};

    constructor(props){
        super(props);
        const {property}=props;
        if ( typeof DynamicSelector.options === 'undefined' ) DynamicSelector.properties=[];
        if ( typeof DynamicSelector.properties[property] === 'undefined')
        {
            DynamicSelector.properties[property]={options: [], choices: []};
            window.socket.emit('get dynamic '+property, this.okGotChoices.bind(this));
        }else{
            this.state.loaded=true;
        }
    }

    okGotChoices(choices){
        const property=this.props.property;
        choices.forEach(choice => DynamicSelector.properties[property].choices[choice._id]=choice.name);
        DynamicSelector.properties[property].options=choices.map(choice => (
            <option value={ choice._id } key={ choice._id }>{ choice.name }</option>
        ));
        this.setState({loaded: true});
    }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveChoice () {
    var obj={};
    obj[this.props.property] = ReactDOM.findDOMNode(this.refs.choice).value;
    if(obj[this.props.property] && this.props.onChange) this.props.onChange(obj);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const { info, property, className, split, name, valueOnly } = this.props;
    let option1 = (this.state.loaded ? <option value=''>Choose one</option> : <option value=''>Loading Options</option>);

    if(valueOnly)
        if(this.state.loaded)
            return (
                <span>DynamicSelector.properties[property].choices[info[property]]</span>
            );
        else return(null);
    else
        return (
            <Row className={className}>
                <Column span={split}>
                {name}
                </Column>
                <Column span={100-split}>
                    <Select block medium ref="choice" defaultValue={ info[property] } onChange={ this.saveChoice.bind(this) }>
                        { option1 }
                        { DynamicSelector.properties[property].options }
                    </Select>
            </Column>
            </Row>
        );
    }
}

export default DynamicSelector;
