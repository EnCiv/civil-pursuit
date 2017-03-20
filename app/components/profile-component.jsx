
'use strict';

import React from 'react';
import Gender from './gender';
import Birthdate from './birthdate';
import MemberType from './member-type';
import Neighborhood from './neighborhood';
import DynamicSelector from './dynamic-selector';
import S from 'string';

class ProfileComponent extends React.Component{

    static components={
        'Gender': Gender,
        'Birthdate': Birthdate,
        'MemberType': MemberType,
        'Neighborhood': Neighborhood,
        'DynamicSelector': DynamicSelector
   }

   static name(component){
        var profile = component.split(".");
        var name;
        if(profile.length==1) name=profile[0];
        else name=profile[1];
        return (S(name).humanize().titleCase().s) ;
   }

    static properties(components){
        return(components.map(component=>{
            var profile = component.split(".");
            var name;
            if(profile.length==1) name=profile[0];
            else name=profile[1];
            return(S(name).underscore().s)
        }));
   }

    render(){
        var Component;
        var profile=[];
        profile = this.props.component.split(".");
        if(profile[0]){
            Component=ProfileComponent.components[profile[0]];
        } else { return(null);};
        return(<Component property={profile[1]} {...this.props} /> );
    }
}

export default ProfileComponent;
