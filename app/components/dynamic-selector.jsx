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
        if (DynamicSelector.initCollection(collection, ()=>this.setState({ loaded: true },()=>{
            let element=ReactDOM.findDOMNode(this.refs.choice);  // after getting choices, and rerendering options, set the value again because it may be one of the new options
            element.value=this.props.info[this.props.property];
        }))) this.state.loaded = true;
    }

    // initialize the collection in the static table, request data to populate it, and after fulfilled, call onComplete for the stacked up requests
    static initCollection(collection, onComplete) {
        if (typeof DynamicSelector.collections === 'undefined') DynamicSelector.collections = []; // this is the first call to DynamicSelector
        if (typeof DynamicSelector.collections[collection] === 'undefined') { // this collection has never been used before
            DynamicSelector.collections[collection] = { options: [], choices: [], names: [], completionStack: [] };
            if(onComplete) DynamicSelector.collections[collection].completionStack.push(onComplete);
            window.socket.emit('get dynamic ' + collection, DynamicSelector.okGotChoices.bind(this, collection)); // null to fill the spot for onComplete
            return false;
        } else { // collection population has at least started
            if(DynamicSelector.collections[collection].options.length) // the collection has been populated
                return true;
            else { // the request to populate made, but the collection is not populated
                DynamicSelector.collections[collection].completionStack.push(onComplete);
                return false;
            }
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    static okGotChoices(collection, choices) {
        choices.forEach(choice => {
            DynamicSelector.collections[collection].choices[choice._id] = choice.name;
            DynamicSelector.collections[collection].names[choice.name] = choice._id;
        })
        DynamicSelector.collections[collection].options = choices.map(choice => (
            <option value={choice._id} key={choice._id}>{choice.name}</option>
        ));
        let completionStack=DynamicSelector.collections[collection].completionStack;
        while(completionStack.length) completionStack.pop()(); 
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
    // return the value of the choice from the collection
    // if the collection has not been loaded yet, return null, load the collection, and call onComplete with the result immediately or when it's available
    //
    static value(collection, choice, onComplete) {
        if (DynamicSelector.initCollection(collection, ()=>onComplete ? onComplete(DynamicSelector.collections[collection].choices[choice]):null)) {
            var result=DynamicSelector.collections[collection].choices[choice];
            if(onComplete) onComplete(result);
            return result;
        }
        return null;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // return the object Id of the choice correspoinding to the choice name
    // if the collection has not been loaded yet, return null, load the collection, and call onComplete with the result immediately or when it's available
    //
    static id(collection, name, onComplete) {
        if (DynamicSelector.initCollection(collection, ()=>onComplete ? onComplete(DynamicSelector.collections[collection].names[name]):null)) {
            var result=DynamicSelector.collections[collection].names[name];
            if(onComplete) onComplete(result);
            return result;
        }
        return null;
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // if the value is changed from above, push it to the element.  Don't use state because this is an input field and the user may also change the input field.
    //
    componentWillReceiveProps(newProps){
        let {property}=this.props;
        let element=ReactDOM.findDOMNode(this.refs.choice);
        if(newProps.info && (newProps.info[property] || '') != element.value) { 
          element.value=newProps.info[property];
          element.style.backgroundColor= Color(element.style.backgroundColor || '#ffff').darken(0.5);
          setTimeout(()=>element.style.backgroundColor=null,1000)
        }
      }

    render() {

        const { info, property, valueOnly, style, ...newProps } = this.props;
        const collection = this.props.collection || property; // for backwards compatibility when there was only the property.
        delete newProps.collection;

        let option1 = (this.state.loaded ? <option value=''>{property}</option> : <option value=''>Loading Options</option>);

        if (valueOnly)
            if (this.state.loaded)
                return (
                    <span>DynamicSelector.collections[collection].choices[info[property]]</span>
                );
            else return (<span></span>);
        else
            return (
                <Select {...newProps} ref="choice" defaultValue={info[property]} onChange={this.saveChoice.bind(this)} >
                    {option1}
                    {DynamicSelector.collections[collection].options}
                </Select>
            );
    }
}

export default DynamicSelector;
