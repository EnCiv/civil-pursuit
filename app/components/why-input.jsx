// https://github.com/EnCiv/civil-pursuit/issues/68

'use strict'
import React, { useEffect } from 'react';
import Point from './point';
import PointInput from './point-input';
import { createUseStyles } from 'react-jss';


function WhyInput(props) {
    const { point = { subject: "", description: "" }, defaultValue = { subject: "", description: "" }, onDone = () => { } } = props;
    const classes = useStyles();

    const handleOnDone = ({ valid, value }) => {
        onDone({ valid, value })
    }

    return (
        <div className={classes.container}>
            <Point {...point} />
            <PointInput onDone={handleOnDone} />
        </div>
    )


}

const useStyles = createUseStyles(theme => ({

    container: {
        display: 'flex',
        justifyContent: 'space-evenly',
        gap: '1rem',
        alignItems: 'center',
    }


}))

export default WhyInput;
