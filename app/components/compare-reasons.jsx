// https://github.com/EnCiv/civil-pursuit/issues/77

'use strict'
import React from 'react';
import { createUseStyles } from 'react-jss';
import PairCompare from './pair-compare';


function CompareReasons(props) {
    const { pointList = [], side = '', onDone = () => { }, className, ...otherProps } = props;
    const classes = useStyles();

    console.log(pointList[0])

    return (
        <div className={classes.container} {...otherProps}>
            {
                pointList.map((headlinePoint, idx) => (
                    <div key={idx} className={classes.headlinePoint}>
                        <div>{headlinePoint.subject}</div>
                        <PairCompare pointList={side === "most" ? headlinePoint.reasonPoints?.most : headlinePoint["least"]} />
                    </div>
                ))
            }
        </div>
    )
}


const useStyles = createUseStyles(theme => ({

    container: {
        fontFamily: theme.font.fontFamily
    }
}))


export default CompareReasons;
