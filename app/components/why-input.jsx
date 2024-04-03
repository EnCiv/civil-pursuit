// https://github.com/EnCiv/civil-pursuit/issues/68

'use strict'
import React from 'react';
import Point from './point';
import PointInput from './point-input';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';


function WhyInput(props) {
    const { point = { subject: "", description: "", _id: "" }, defaultValue = { subject: "", description: "" }, onDone = () => { }, className, ...otherProps } = props;
    const classes = useStyles();

    const handleOnDone = ({ valid, value }) => {
        value.parentId = `${point._id}`;
        onDone({ valid, value})
    }

    return (
        <div className={cx(classes.container, className)} {...otherProps}>
            <Point {...point} vState="secondary" />
            <PointInput onDone={handleOnDone} defaultValue={defaultValue} />
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
