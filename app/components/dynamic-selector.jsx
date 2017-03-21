'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import Select                         from './util/select';




class DynamicSelector extends React.Component {

/**
 * 
 * a selector made up of choices from a collection in the database on the server
 * 
 *  the collection is loaded on first use and stored within the Class so the choices are immediately available for future use by any other object
 * 
 */

    state={loaded: false};

    constructor(props){
        super(props);
        const {collection}=props;
        if ( typeof DynamicSelector.collections === 'undefined' ) DynamicSelector.collections=[];
        if ( typeof DynamicSelector.collections[collection] === 'undefined')
        {
            DynamicSelector.collections[collection]={options: [], choices: []};
            window.socket.emit('get dynamic '+collection, this.okGotChoices.bind(this));
        }else{
            this.state.loaded=true;
        }
    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    okGotChoices(choices){
        const {collection}=this.props;
        choices.forEach(choice => DynamicSelector.collections[collection].choices[choice._id]=choice.name);
        DynamicSelector.collections[collection].options=choices.map(choice => (
            <option value={ choice._id } key={ choice._id }>{ choice.name }</option>
        ));
        this.setState({loaded: true});
    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// get the value of the selector the user has chosen and 
// send an object with the property set to that value to onChange
  saveChoice () {
    var obj={};
    const {property}=this.props;
    obj[property] = ReactDOM.findDOMNode(this.refs.choice).value;
    if(obj[property] && this.props.onChange) this.props.onChange(obj);
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    static gotChoices(collection, choice, onComplete, choices){
        choices.forEach(choice => DynamicSelector.collections[collection].choices[choice._id]=choice.name);
        DynamicSelector.collections[collection].options=choices.map(choice => (
            <option value={ choice._id } key={ choice._id }>{ choice.name }</option>
        ));
        if(onComplete) onComplete(DynamicSelector.collections[collection].choices[choice]);
    }




 //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 // return the value of the choice from the collection
 // if the collection has not been loaded yet, return null, load the collection, and call onComplete with the result when it's available
 //
  static value(collection, choice, onComplete) {
    var onCompleted= onComplete || null;  // onComplete might not be passed, but it must be passed to gotChoices
    if ( typeof DynamicSelector.collections === 'undefined' ) DynamicSelector.collections=[];
    if ( typeof DynamicSelector.collections[collection] === 'undefined') {
        DynamicSelector.collections[collection]={options: [], choices: []};
        window.socket.emit('get dynamic '+collection, DynamicSelector.gotChoices.bind(collection, choice, onCompleted))
        return(null);
    }else{
        return(DynamicSelector.collections[collection].choices[choice]);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const { info, property, collection, valueOnly, style } = this.props;
    let option1 = (this.state.loaded ? <option value=''>{property}</option> : <option value=''>Loading Options</option>);

    if(valueOnly)
        if(this.state.loaded)
            return (
                <span>DynamicSelector.collections[collection].choices[info[property]]</span>
            );
        else return(<span></span>);
    else
        return (
            <Select {...this.props}  ref="choice" defaultValue={ info[property] } onChange={ this.saveChoice.bind(this) } >
                { option1 }
                { DynamicSelector.collections[collection].options }
            </Select>
        );
    }
}

export default DynamicSelector;
