'use strict'
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

function PointInput(props) {
    const classes = useStyles()
    const [subject, setSubject] = useState('')
    const [description, setDescription] = useState('')

    const handleSubjectChange = (value) => {
        setSubject(value)
    }

    const handleDescriptionChange = (value) => {
        setDescription(value)
    }

    return (
        <>
            <div className={classes.container}>
                <input type="text" placeholder='Type some thing here' value={subject} onChange={(e) => handleSubjectChange(e.target.value)}>

                </input>
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className={classes.description}>

                </textarea>
            </div>
        </>
    )
};


const useStyles = createUseStyles(theme => ({

    container: {
        display: 'flex',
        flexDirection: 'column',
        top: '4.0625rem',
        left: '2.75rem',
        gap: '0.625rem'
    },
    subject: {

    },
    description: {
        resize: "none"
    }
}))

export default PointInput
