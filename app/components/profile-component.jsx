
'use strict';

import React from 'react';
import Gender from './gender';
import Birthdate from './birthdate';
import MemberType from './member-type';
import Neighborhood from './neighborhood';
import DynamicSelector from './dynamic-selector';

class ProfileComponent extends React.Component{

    static components={
        'Gender': Gender,
        'Birthdate': Birthdate,
        'MemberType': MemberType,
        'Neighborhood': Neighborhood,
        'DynamicSelector': DynamicSelector
   }

    render(){
        var Component;
        var profile=[];
        profile = this.props.component.split["."];
        console.info("profileComponent", this.props.component, profile);
        if(profile[0]){
            Component=ProfileComponent.components[profile[0]];
        } else { console.error("ProfileComponent unknown component", this.props.component); return null};
        return(<Component property={profile[1]} {...this.props} /> );
    }
}

export default ProfileComponent;
