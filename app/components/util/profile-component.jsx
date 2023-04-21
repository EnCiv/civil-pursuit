
'use strict';

import React from 'react';
import Gender from './gender';
import Birthdate from './birthdate';
import MemberType from './member-type';
import Neighborhood from './neighborhood';
import DynamicSelector from './dynamic-selector';
import YearOfBirth from './year-of-birth';
import S from 'string';
import Zip from './zip';
import City from './city';
import Line1 from './line1';
import StreetAddress from './street-address';
import Race from './race';
import GunType from './gun-type';
import StartingBlocType from './starting-bloc-type';
import GenderIdentity from './gender-identity';
import StartingBlocRace from './starting-bloc-race';

/**
 * ComponentName.collectionName.infoPropertyName.Title
 * 
 *  ComponentName = ComponentName
 *    title = humanize and titleCase of ComponentName= Component Name
 *    collection= underscore of ComponentName
 *    infoPropertyName = collection
 */

 /**
  * Profile Component Props:
  * 
  * onChange is an option function to call when the value of a property changed, as in:
  *     onChange({property: value});
  * 
  *         value should be a validated as much as possible by the component. If the value changes, and it is not valid, then a falsy value should be return - as in null or ""
  * 
  * info is an object holding the defaultValue for the property.  As in
  *     info[property]
  * 
  * property is the name that should be used for the property
  * 
  * collection is the name of the database collection to be used for obtaining choices - if used but the component
  * 
  */

class ProfileComponent extends React.Component {

    static components = {
        'Gender': Gender,
        'Birthdate': Birthdate,
        'MemberType': MemberType,
        'Neighborhood': Neighborhood,
        'DynamicSelector': DynamicSelector,
        'YearOfBirth': YearOfBirth,
        'Zip': Zip,
        'City': City,
        'Line1': Line1,
        'StreetAddress': StreetAddress,
        'Race': Race,
        'GunType': GunType,
        'StartingBlocType': StartingBlocType,
        'GenderIdentity': GenderIdentity,
        'StartingBlocRace': StartingBlocRace
    }

    static title(component) {
        var profile = component.split(".");
        switch (profile.length) {
            case 0:
                return (null);
            case 1:
                return (S(profile[0]).humanize().titleCase().s);
            case 2:
                return profile[1];
            default:
                return (profile[1]);

        }
    }

    static collection(component) {
        var profile = component.split(".");
        switch (profile.length) {
            case 0:
                return (null);
            case 1:
                return (S(profile[0]).underscore().s);
            case 2:
                return (S(profile[1]).underscore().s);
            case 3:
                return (profile[2]);
            default:
                return (profile[2]);
        }
    }

    static property(component) {
        var profile = component.split(".");
        switch (profile.length) {
            case 0:
                return (null);
            case 1:
                return (S(profile[0]).underscore().s);
            case 2:
                return (S(profile[1]).underscore().s);
            case 3:
                return (profile[2]);
            case 4:
                return (profile[3]);
            default:
                return (profile[3]);
        }
    }

    static properties(components) {
        return (components.map(component => ProfileComponent.property(component)))
    }

    render() {
        const {component, ...newProps}=this.props;
        var Component;
        var profile = [];
        profile = component.split(".");
        if (profile[0]) {
            Component = ProfileComponent.components[profile[0]];
        } else { return (null); };
        if(typeof Component === 'function') return (<Component {...newProps} property={ProfileComponent.property(component)} collection={ProfileComponent.collection(component)}/>);
        else throw new Error('profile does not exist in ProfileComponents', profile);
    }
}

export default ProfileComponent;
