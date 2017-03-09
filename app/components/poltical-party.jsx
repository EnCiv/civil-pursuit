'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import Select                         from './util/select';


class PoliticalParty extends React.Component {

    state={loaded: false};

    constructor(props){
        super(props);
        if ( PoliticalParty.options === 'undefined' ) {
            PoliticalParty.options=[];
            window.socket.emit('get political parties', this.okGotChoices.bind(this));
        }else{
            this.state.loaded=true;
        }
    }

    okGotChoices(choices){
        PoliticalParty.options=choices.map(choice => (
            <option value={ choice._id } key={ choice._id }>{ choice.name }</option>
        ));
        this.setState({loaded: true});
    }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveChoice () {
    let value = ReactDOM.findDOMNode(this.refs.choice).value;

    if ( value ) {
      if(this.props.onChange) this.props.onChange({party: value});
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { user } = this.props;
    let option1 = (this.state.loaded ? <option value=''>Choose one</option> : <option value=''>Loading Options</option>);

    return (
        <Row baseline className="gutter-y">
            <Column span={this.props.split}>
              Political Party
            </Column>
            <Column span={100-this.props.split}>
                <Select block medium ref="choice" defaultValue={ user.party } onChange={ this.setChoice.bind(this) }>
                    { option1 }
                    { PoliticalParty.options }
                </Select>
          </Column>
        </Row>
    );
  }
}

export default PoliticalParty;
