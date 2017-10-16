'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Input from './util/input';
import Button from './util/button';
import superagent from 'superagent';
import ProfileComponent from './profile-component';
import Row                            from './util/row';
import Column                         from './util/column';
import DynamicSelector from './dynamic-selector';
import us_abbreviations from 'us-abbreviations';
import ButtonGroup from './util/button-group';

var shortToLongState = us_abbreviations('postal','full');

class StreetAddress extends React.Component {
    name = 'street_address';
    street_address={};
    profiles=['Line1', 'City','DynamicSelector.State.state', 'Zip'];
    apiKey='';
    info={};

    addressString(){
        const {line1, city, state, zip}=this.info;
        return (
            line1 + ', ' + city + ' ' + DynamicSelector.value('state',state,this.forceUpdate.bind(this)) + zip
        )
    }

    constructor(props) {
        super(props);
        Object.assign(this.info, this.props.info[this.name] || {});
        this.state = { hint: false, info: {}};
        this.profiles.forEach(profile=>this.state.info[profile]=null);
        Object.assign(this.state.info, this.props.info[this.name])
        this.apiKey="AIzaSyDoVHuAQTcGwAGQxqWdyKEg29N5BzThqC8";
        if ( ! this.apiKey ) {
            throw new Error('Missing API KEY');
        }
    }

    isAddressComplete(){
        return !Object.keys(this.info).some(key=>!this.info[key])
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    saveInfo(property,value) {
        Object.assign(this.info,value);
        if(!this.isAddressComplete()) return(this.setState({hint: true}));
        this.validate(this.addressString())
        .then((success)=>{
            if(success==='check') {
                this.setState({ hint: true })
            } else if(success==='fail') {
                this.setState({hint: false})
            } else if(success==='done'){
                this.setState({info: this.info, hint: false});
                this.props.onChange({[this.name]: this.info })
            }
        })
    }

    validate(streetAddress) {
        return new Promise((ok, ko) => {
          try {
            superagent
              .get('https://www.googleapis.com/civicinfo/v2/representatives')
              .query({key: this.apiKey})
              .query({address: streetAddress})
              .end((err, res) => {
                let updated=false;
                switch ( res.status ) {
                    case 200:
                        console.info("StreetAddress.validate", res.body);
                        if(typeof res.body !== 'object') ko();
                        if(!(res.body.kind && res.body.kind === 'civicinfo#representativeInfoResponse')) ko();
                        ['line1','city','zip'].forEach(prop=>{
                            if(this.info[prop]!==res.body.normalizedInput[prop]){
                                this.info[prop]=res.body.normalizedInput[prop];
                                this.setState({info: {[prop]: this.info[prop]}})
                                updated=true;
                            }
                        })
                        let state=DynamicSelector.find(shortToLongState(res.body.normalizedInput.state));
                        if(state && this.info.state!==state) {
                            this.info.state=state;
                            this.setState({info: {state: state}})
                            updated=true;
                        }
                        ok(updated ? 'check' : 'done');
                        break;
    
                    default:
                        console.info('error', res.status, res.body);
                        ok('fail');
                        break;
                }
              });
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        let { hint, info } = this.state;

        return (
            <div>
                <div className='item-profile-panel' style={{maxWidth: "40em", margin: "auto", padding: "1em"}}>
                    {   this.profiles.map(component=>{
                            var title=ProfileComponent.title(component);            
                            return(
                                <SelectorRow name={title} key={ProfileComponent.property(component)} >
                                    <ProfileComponent block medium component={component} info={info} onChange={this.saveInfo.bind(this,ProfileComponent.property(component))}/>
                                </SelectorRow>
                            );
                        }) 
                    }
                </div>
                <div style={{ display: hint ? 'block' : 'none' }}>
                    <span>Is this address correct?</span>
                    <ButtonGroup>
                        <Button small shy onClick={()=>this.props.onChange({[this.name]: info })}>
                            <span className="civil-button-text">Yes</span>
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    }
}

export default StreetAddress;

class SelectorRow extends React.Component{
    render(){
      return(
          <Row baseline className="gutter">
            <Column span="25">
              {this.props.name}
            </Column>
            <Column span="75">
              {this.props.children}
            </Column>
          </Row>
      );
    }
  }
