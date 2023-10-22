'use strict'
import React from 'react';
import insertSheet from 'react-jss';

function DemInfo(props) {
    const { user, className, styles, ...otherProps } = props;

    const userState = user.state || 'N/A';
    const userAge = user.dob ? calculateAge(user.dob) : 'N/A';
    const userPoliticalParty = user.party || 'N/A';


    return (
        <span>
            {`${userPoliticalParty} | ${userAge}, ${userState}`}
        </span>
    )
}

/**
 * Calculate user age based on birthdate from User Schema
 * @param {Date} birthday
 * @return {Number} age (in years)
 */
function calculateAge(birthday) {
    const today = new Date()
    const age = today.getFullYear() - birthday.getFullYear();
    const month = today.getMonth() - birthday.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    return age

}

const demInfoStyles = {
}


export default insertSheet(demInfoStyles)(DemInfo)
