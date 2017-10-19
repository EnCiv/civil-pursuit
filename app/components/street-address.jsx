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
    profiles=['Line1', 'Zip', 'City','DynamicSelector.State.state'];
    apiKey='';
    info={};
    possible={};

    addressString(){
        const {line1, city, state, zip}=this.info;
        return (
            line1 + ', ' + city + ' ' + (DynamicSelector.value('state',state) || '', ()=>this.forceUpdate()) + zip // DynamicSelector might return null the first time, but the civic api will probably figure out the state from the zip
        )
    }

    constructor(props) {
        super(props);
        Object.assign(this.info, this.props.info[this.name] || {});
        this.state = { hint: false, working: false, info: {}};
        this.profiles.forEach(profile=>this.state.info[profile]=null);
        Object.assign(this.state.info, this.props.info[this.name])
        this.apiKey="AIzaSyDoVHuAQTcGwAGQxqWdyKEg29N5BzThqC8";
        if ( ! this.apiKey ) {
            throw new Error('Missing API KEY');
        }
    }

    isAddressComplete(){
        // if the there is enough information for civic info to complete the address
        return (this.info.line1 && (this.info.zip || this.info.city && this.info.state))
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    validateTimeout;

    componentWillMount(){
        if(this.info.validatedAt && this.props.onChange) this.props.onChange({[this.name]: this.info })
        else if(this.isAddressComplete()) this.validate(this.addressString());
    }

    saveInfo(property,value) {
        let d=new Date();
        console.info("StreetAddress.saveInfo", value, this.validateTimeout, d.getSeconds()+':'+d.getMilliseconds())
        Object.assign(this.info,value);
        Object.assign(this.state.info,value); // DANGER!! we are not calling setState here because we don't want to cause a rerender. The Input element sent this data up, the data is already displayed.
        if(!this.isAddressComplete()) return(this.setState({hint: false, working: false}));
        if(this.validateTimeout) clearTimeout(this.validateTimeout); // stop the old validate, here is new data
        this.validateTimeout=setTimeout(()=>this.validate(this.addressString()),2000);
        if(!this.state.working) this.setState({working: true});
    }

    validate(streetAddress) {
        this.validateTimeout=undefined;
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
                        if(typeof res.body !== 'object') return;
                        if(!(res.body.kind && res.body.kind === 'civicinfo#representativeInfoResponse')) return;
                        Object.assign(this.possible,this.info);
                        ['line1','city','zip'].forEach(prop=>{
                            if(this.possible[prop]!==res.body.normalizedInput[prop]){
                                this.possible[prop]=res.body.normalizedInput[prop];
                                updated=true;
                            }
                        })
                        DynamicSelector.id('state',shortToLongState(res.body.normalizedInput.state),(state)=>{ //state meaning geography
                            if(state && this.possible.state!==state) {
                                this.possible.state=state;
                                updated=true;
                            }
                            if(!updated) {
                                Object.assign(this.info,this.possible);
                                this.info.validatedAt=new Date();
                                this.props.onChange({[this.name]: this.info })
                                this.setState({hint: false, working: false}); // no need to update info, it hasn't been updated
                            } else {
                                this.setState({hint: true, working: false, info: this.possible}) // update info displayed with 'possible' turn on hint to see if the user agrees
                            }
                        });  // CA - California -> $oid
                        break;
                    default:
                        this.info.validatedAt=null;
                        console.info('error', res.status, res.body);
                        this.setState({hint: false, working: false})
                        break;
                }
            });
          }
          catch ( error ) {
            this.info.validatedAt=null;
            console.info("StreetAddress.validate error=",error);
            this.setState({hint: false, working: false})
          }
      }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        let { hint, working, info } = this.state;
        let {validatedAt}=this.info;

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
                <div style={{fontSize: validatedAt ? "0.5em" : "1em"}}>{validatedAt ? 'validated at: '+validatedAt : "Please enter a valid Street Address"}</div>
                <div style={{ display: working ? 'block' : 'none' }}>
                    <span>checking</span>
                </div>
                <div style={{ display: hint ? 'block' : 'none' }}>
                    <span>Is this address correct?</span>
                    <ButtonGroup>
                        <Button small shy onClick={()=>{this.info.validatedAt=new Date();Object.assign(this.info, this.possible); this.setState({hint: false, working: false}); this.props.onChange({[this.name]: this.info })}}>
                            <span className="civil-button-text">Yes</span>
                        </Button>
                        <Button small shy onClick={()=>this.setState({hint: false, info: this.info})}>
                            <span className="civil-button-text">Undo</span>
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
