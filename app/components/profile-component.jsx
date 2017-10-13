
'use strict';

import React from 'react';
import Gender from './gender';
import Birthdate from './birthdate';
import MemberType from './member-type';
import Neighborhood from './neighborhood';
import DynamicSelector from './dynamic-selector';
import YearOfBirth from './year-of-birth';
import S from 'string';

/**
 * ComponentName.collectionName.infoPropertyName.Title
 * 
 *  ComponentName = ComponentName
 *    title = humanize and titleCase of ComponentName= Component Name
 *    collection= underscore of ComponentName
 *    infoPropertyName = collection
 */

class ProfileComponent extends React.Component {

    static components = {
        'Gender': Gender,
        'Birthdate': Birthdate,
        'MemberType': MemberType,
        'Neighborhood': Neighborhood,
        'DynamicSelector': DynamicSelector,
        'YearOfBirth': YearOfBirth
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
        var Component;
        var profile = [];
        profile = this.props.component.split(".");
        if (profile[0]) {
            Component = ProfileComponent.components[profile[0]];
        } else { return (null); };
        return (<Component {...this.props} property={ProfileComponent.property(this.props.component)} collection={ProfileComponent.collection(this.props.component)}/>);
    }
}

export default ProfileComponent;
