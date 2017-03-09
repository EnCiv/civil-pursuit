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
        if ( typeof DynamicSelector.options === 'undefined' ) DynamicSelector.options={};
        if ( typeof DynamicSelector.options[this.props.property] === 'undefined')
        {
            DynamicSelector.options[this.props.property]=[];
            window.socket.emit('get dynamic '+this.props.property, this.okGotChoices.bind(this));
        }else{
            this.state.loaded=true;
        }
    }

    okGotChoices(choices){
        DynamicSelector.options[this.props.property]=choices.map(choice => (
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

    let { info } = this.props;
    let option1 = (this.state.loaded ? <option value=''>Choose one</option> : <option value=''>Loading Options</option>);

    return (
        <Row className={this.props.className}>
            <Column span={this.props.split}>
              {this.props.name}
            </Column>
            <Column span={100-this.props.split}>
                <Select block medium ref="choice" defaultValue={ info[this.props.property] } onChange={ this.saveChoice.bind(this) }>
                    { option1 }
                    { DynamicSelector.options[this.props.property] }
                </Select>
          </Column>
        </Row>
    );
  }
}

export default DynamicSelector;
