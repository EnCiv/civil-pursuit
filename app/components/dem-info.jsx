'use strict'
import React from 'react';
import cx from 'classnames';
import insertSheet from 'react-jss';


function DemInfo(props) {
    const { user, classes, className, ...otherProps } = props;

    const userState = user?.state || '';
    const userAge = user?.dob ? calculateAge(user.dob) : '';
    const userPoliticalParty = user?.party || '';


    let contentText = '';
    if (userPoliticalParty && (userAge || userState)) {
        contentText += `${userPoliticalParty} | `;
    } else if (userPoliticalParty) {
        contentText += `${userPoliticalParty}`;
    }

    if (userAge && userState) {
        contentText += `${userAge}, ${userState}`;
    } else if (userAge || userState) {
        contentText += userAge || userState;
    }


    return (
        <span className={cx(classes.infoText, className)} {...otherProps}>
            {contentText}
        </span>
    )
}

/**
 * Calculate user age based on birthdate from User Schema
 * @param {String} birthdayStr
 * @return {Number} age (in years)
 */
function calculateAge(birthdayStr) {
    const birthday = new Date(birthdayStr)
    const today = new Date()
    const age = today.getFullYear() - birthday.getFullYear();
    const month = today.getMonth() - birthday.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    return age

}

const demInfoStyles = {
    infoText: {
        fontFamily: 'Inter',
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5rem',
        letterSpacing: '0rem',
        textAlign: 'left',
        color: '#5D5D5C'
    }
}


export default insertSheet(demInfoStyles)(DemInfo)
