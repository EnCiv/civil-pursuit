'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Row from './util/row';
import Column from './util/column';
import Select from './util/select';
import Color from 'color';



class DynamicSelector extends React.Component {

    /**
     * 
     * render a selector made up of choices from a collection in the database on the server
     * 
     *  the collection is loaded on first use and stored within this class so the choices are immediately available for future use by any other objects
     * 
     */

    state = { loaded: false };

    constructor(props) {
        super(props);
        const collection = props.collection || props.property;
        if (DynamicSelector.initCollection(collection, DynamicSelector.okGotChoices.bind(this, collection, () => this.setState({ loaded: true })))) this.state.loaded = true;
    }

    // initialize the collestion in the static table, request data to populate it, and after fulfilled, call onComplete
    static initCollection(collection, onComplete) {
        if (typeof DynamicSelector.collections === 'undefined') DynamicSelector.collections = [];
        if (typeof DynamicSelector.collections[collection] === 'undefined') {
            DynamicSelector.collections[collection] = { options: [], choices: [], names: [] };
            window.socket.emit('get dynamic ' + collection, onComplete);
            return false;
        } else {
            return true;
        }
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    static okGotChoices(collection, onComplete, choices) {
        choices.forEach(choice => {
            DynamicSelector.collections[collection].choices[choice._id] = choice.name;
            DynamicSelector.collections[collection].names[choice.name] = choice._id;
        })
        DynamicSelector.collections[collection].options = choices.map(choice => (
            <option value={choice._id} key={choice._id}>{choice.name}</option>
        ));
        onComplete();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // get the value of the selector the user has chosen and 
    // send an object with the property set to that value to onChange
    saveChoice() {
        var obj = {};
        const { property } = this.props;
        obj[property] = ReactDOM.findDOMNode(this.refs.choice).value;
        if (obj[property] && this.props.onChange) this.props.onChange(obj);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    static gotChoices(collection, choice, onComplete, choices) {
        choices.forEach(choice => DynamicSelector.collections[collection].choices[choice._id] = choice.name);
        DynamicSelector.collections[collection].options = choices.map(choice => (
            <option value={choice._id} key={choice._id}>{choice.name}</option>
        ));
        if (onComplete) onComplete(DynamicSelector.collections[collection].choices[choice]);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // return the value of the choice from the collection
    // if the collection has not been loaded yet, return null, load the collection, and call onComplete with the result when it's available
    //
    static value(collection, choice, onComplete) {
        var onCompleted = onComplete || null;  // onComplete might not be passed, but it must be passed to gotChoices
        if (DynamicSelector.initCollection(collection, onComplete)) return (DynamicSelector.collections[collection].choices[choice]);
        else return null;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // return the object Id of the choice correspoinding to the choice name
    // if the collection has not been loaded yet, return null, load the collection, and call onComplete with the result when it's available
    //
    static find(collection, name, onComplete) {
        var onCompleted = onComplete || null;  // onComplete might not be passed, but it must be passed to gotChoices
        if (DynamicSelector.initCollection(collection, onComplete)) return (DynamicSelector.collections[collection].names[name]);
        else return null;
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // if the value is changed from above, push it to the element.  Don't use state because this is an input field and the user may also change the input field.
    //
    componentWillReceiveProps(newProps){
        let {property}=this.props;
        let element=ReactDOM.findDOMNode(this.refs.choice);
        if(newProps.info && (newProps.info[property] !== element.value)) 
          element.value=newProps.info[property];
          element.style.backgroundColor= Color(element.style.backgroundColor || '#ffff').darken(0.5);
          setTimeout(()=>element.style.backgroundColor=null,1000)
      }

    render() {

        const { info, property, valueOnly, style } = this.props;
        const collection = this.props.collection || property; // for backwards compatibility when there was only the property.
        let option1 = (this.state.loaded ? <option value=''>{property}</option> : <option value=''>Loading Options</option>);

        if (valueOnly)
            if (this.state.loaded)
                return (
                    <span>DynamicSelector.collections[collection].choices[info[property]]</span>
                );
            else return (<span></span>);
        else
            return (
                <Select {...this.props} ref="choice" defaultValue={info[property]} onChange={this.saveChoice.bind(this)} >
                    {option1}
                    {DynamicSelector.collections[collection].options}
                </Select>
            );
    }
}

export default DynamicSelector;
