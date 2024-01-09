// https://github.com/EnCiv/civil-pursuit/issues/53

'use strict'
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';

function PairCompare(props) {
    const { pointList = [], onDone = () => { }, mainPoint = { subject: "", description: "" }, ...otherProps } = props
    const [idxLeft, setIdxLeft] = useState(0);
    const [idxRight, setIdxRight] = useState(1);
    const [pointsIdxCounter, setPointsIdxCounter] = useState(1)
    const classes = useStyles();

    return (
        <div className={classes.container} {...otherProps}>

            <div className={classes.mainPointContainer}>
                <div className={classes.mainPointSubject}>{mainPoint.subject}</div>
                <div className={classes.mainPointDescription}>{mainPoint.description}</div>
            </div>

            <span className={classes.statusBadge}>{`${pointsIdxCounter} out of ${pointList.length}`}</span>

            <div className={classes.lowerContainer}>
                <div className={classes.pointsContainer}>
                    {idxLeft < pointList.length &&
                        <div>{pointList[idxLeft]}</div>}
                    {idxRight < pointList.length &&
                        <div>{pointList[idxRight]}</div>}
                </div>
                <div className={classes.neitherButton}>Neither</div>
            </div>


        </div>
    )
}

const useStyles = createUseStyles(theme => ({

    container: {
        fontFamily: theme.font.fontFamily,
    },
    statusBadge: {
        borderRadius: '1rem',
        padding: '0.375rem 0.625rem',
        backgroundColor: theme.colors.statusBadgeProgressBackground,
        border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeProgressBorder}`
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
    },
    pointsContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        marginTop: '1rem',
    },
    lowerContainer: {
        marginTop: '1rem',
        backgroundColor: theme.colors.cardOutline,
        borderRadius: '1rem',
        border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
    },
    neitherButton: {
        width: 'fit-content',
        borderRadius: '0.5rem',
        padding: '0.5rem 2.5rem',
        border: `${theme.border.width.thick} solid ${theme.colors.primaryButtonBlue}`,
        margin: '2rem auto',
    }
}))

export default PairCompare;
