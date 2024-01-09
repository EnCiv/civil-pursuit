// https://github.com/EnCiv/civil-pursuit/issues/53

'use strict'
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import { relative } from 'path-browserify';

function PairCompare(props) {
    const { pointList=[], onDone=()=>{}, mainPoint={subject: "", description: ""}, ...otherProps} = props
    const [currIdx, setCurrIdx] = useState(0);
    const classes = useStyles();

    return (
        <div className={classes.container} {...otherProps}>
            <div className={classes.mainPointContainer}>
                <div className={classes.mainPointSubject}>{mainPoint.subject}</div>
                <div className={classes.mainPointDescription}>{mainPoint.description}</div>
            </div>
            <span className={classes.statusBadge}>{`${currIdx} out of ${pointList.length}`}</span>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({

    container: {
        fontFamily: theme.font.fontFamily,
        position: 'relative',
    },
    statusBadge: {

    },
    mainPointContainer: {
        textAlign: 'center',
        
    },
    mainPointSubject: {
        fontWeight: '600',
        fontSize: '1.5rem',
        lineHeight: '2rem',
    },
    mainPointDescription: {
        fontWeight: '400',
    }

}))

export default PairCompare;
