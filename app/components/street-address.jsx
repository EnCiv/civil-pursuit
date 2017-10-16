'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Input from './util/input';
import superagent from 'superagent';
import ProfileComponent from './profile-component';
import Row                            from './util/row';
import Column                         from './util/column';
import DynamicSelector from './dynamic-selector';

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
        this.state = { hint: this.props && this.props.info /**&& this.validate(this.addressString())**/ };
        this.apiKey="AIzaSyDoVHuAQTcGwAGQxqWdyKEg29N5BzThqC8";
        if ( ! this.apiKey ) {
            throw new Error('Missing API KEY');
        }
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    saveInfo(property,value) {
        Object.assign(this.info,value);
        if(Object.keys(this.info).some(key=>!this.info[key]))
            return(this.setState({hint: true}));
        this.validate(this.addressString())
        .then((success)=>{
            if(success) {
                if (this.props.onChange) this.props.onChange({ street_address: this.info });
                this.setState({ hint: false })
            } else
                this.setState({hint: true})
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
                // if ( err ) {
                //   return ko(err);
                // }
                switch ( res.status ) {
                  case 404:
                    console.error('Server Not Found', res.body);
                    break;
    
                    case 401:
                    console.error('unauthorized',res.body);
                      break;
    
                    case 200:
                        console.info("StreetAddress.validate", res.body);
                        if(typeof res.body !== 'object') ko();
                        if(!(res.body.kind && body.kind === 'civicinfo#representativeInfoResponse')) ko();
                        this.info.line1=res.body.normalizedInput.line1;
                        this.info.city=res.body.normalizedInput.city;
                        this.info.city=res.body.normalizedInput.zip;
                        this.info.state=DynamicSelector.find(res.body.normalizedInput.state) || 'null';
                      ok(true);
                      // location.href = '/page/profile';
                      break;
    
                    default:
                        console.error('Unknown error', res.body);
                      break;
                }
                ok(false);
              });
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        let { info } = this.props;
        let { hint } = this.state;

        return (
            <div>
                <div className='item-profile-panel' style={{maxWidth: "40em", margin: "auto", padding: "1em"}}>
                    {   this.profiles.map(component=>{
                            var title=ProfileComponent.title(component);            
                            return(
                                <SelectorRow name={title} >
                                    <ProfileComponent block medium component={component} info={info[this.name] || {}} onChange={this.saveInfo.bind(this,ProfileComponent.property(component))}/>
                                </SelectorRow>
                            );
                        }) 
                    }
                </div>
                <div style={{ display: hint ? 'block' : 'none' }}>enter a valid address</div>
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
