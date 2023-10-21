'use strict'
import React from 'react';
import insertSheet from 'react-jss';

function DemInfo(props) {
    const { user, className, styles, ...otherProps } = props;

    const userState = user.state || 'N/A';
    const userAge = user.dob ? calculateAge() : 'N/A';
    const userPoliticalParty = user.party || 'N/A';


    return (
        <span>
            {`${userPoliticalParty} | ${userAge}, ${userState}`}
        </span>
    )
}

function calculateAge() {

}

const demInfoStyles = {
    
}


export default insertSheet(demInfoStyles)(DemInfo)
