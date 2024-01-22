// https://github.com/EnCiv/civil-pursuit/issues/53

'use strict'
import React, { useEffect, useState } from 'react';
import Point from './point.jsx';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';

function PairCompare(props) {
    const { pointList = [], onDone = () => { }, mainPoint = { subject: "", description: "" }, ...otherProps } = props
    const [idxLeft, setIdxLeft] = useState(0);
    const [idxRight, setIdxRight] = useState(1);
    const [pointsIdxCounter, setPointsIdxCounter] = useState(1);
    let selectedPoint = null;
    const classes = useStyles();

    useEffect(() => {
        if (pointsIdxCounter >= pointList.length) {
            selectedPoint = pointList[idxLeft] ? pointList[idxLeft] : pointList[idxRight];
        }
    }, [pointsIdxCounter])

    const handleLeftPointClick = () => {
        if (selectedPoint) return

        if (idxLeft >= idxRight) {
            setIdxRight(idxLeft+1)
        } else {
            setIdxRight(idxRight+1)
        }

        setPointsIdxCounter(pointsIdxCounter+1)
    }

    const handleRightPointClick = () => {
        if (selectedPoint) return

        if (idxLeft >= idxRight) {
            setIdxLeft(idxLeft+1)
        } else {
            setIdxLeft(idxRight+1)
        }

        setPointsIdxCounter(pointsIdxCounter+1)
    }

    return (
        <div className={classes.container} {...otherProps}>

            <div className={classes.mainPointContainer}>
                <div className={classes.mainPointSubject}>{mainPoint.subject}</div>
                <div className={classes.mainPointDescription}>{mainPoint.description}</div>
            </div>

            <span className={classes.statusBadge}>{`${pointsIdxCounter} out of ${pointList.length}`}</span>

            <div className={classes.lowerContainer}>

                <div className={classes.hiddenPointContainer}>
                    {pointsIdxCounter < pointList.length &&
                        <div className={classes.hiddenPoint}><Point className={classes.emptyPoint} /></div>}
                    {pointsIdxCounter < pointList.length &&
                        <div className={classes.hiddenPoint}><Point className={classes.emptyPoint} /></div>}
                </div>

                <div className={classes.visiblePointsContainer}>
                    {idxLeft < pointList.length &&
                        <div className={classes.visiblePoint} onClick={handleLeftPointClick}>{pointList[idxLeft]}</div>}
                    {idxRight < pointList.length &&
                        <div className={classes.visiblePoint} onClick={handleRightPointClick}>{pointList[idxRight]}</div>}
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
    hiddenPointContainer: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-evenly',
        overflow: 'hidden',
        paddingTop: '5rem',
    },
    hiddenPoint: {
        width: '30vw',
    },
    emptyPoint: {
        border: '1px solid red',
        position: 'absolute',
        width: '30vw',
        top: '-2rem',
    },
    visiblePointsContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        marginTop: '1rem',
    },
    visiblePoint: {
        width: '30vw',
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
