// https://github.com/EnCiv/civil-pursuit/issues/53

'use strict'
import React, { useEffect, useRef, useState } from 'react';
import Point from './point.jsx';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';

function PairCompare(props) {
    const { pointList = [], onDone = () => { }, mainPoint = { subject: "", description: "" }, ...otherProps } = props

    // idxLeft and idxRight can swap places at any point
    const [idxLeft, setIdxLeft] = useState(0);
    const [idxRight, setIdxRight] = useState(1);

    const visibleRightPointRef = useRef(null)

    const [pointsIdxCounter, setPointsIdxCounter] = useState(1);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        if (isSelectionComplete()) {
            setSelectedPoint(pointList[idxLeft] ? pointList[idxLeft] : pointList[idxRight]);
        }
    }, [pointsIdxCounter])

    useEffect(() => {
        onDone({valid: true, value: selectedPoint})
    }, [selectedPoint])

    const handleLeftPointClick = () => {
        if (selectedPoint) return

        // const visiblePointRight = document.querySelector("[class^='visiblePointRight-']");
        const visiblePointRight = visibleRightPointRef.current
        // console.log(visiblePointRight)

        visiblePointRight.style.position = 'relative';
        visiblePointRight.style.left = '50rem';

        setTimeout(() => {
            if (idxLeft >= idxRight) {
              setIdxRight(idxLeft + 1);
            } else {
              setIdxRight(idxRight + 1);
            }

            setPointsIdxCounter(pointsIdxCounter + 1);

            visiblePointRight.style.position = '';
            visiblePointRight.style.left = '';
          }, 500);

    }

    const handleRightPointClick = () => {
        if (selectedPoint) return

        if (idxLeft >= idxRight) {
            setIdxLeft(idxLeft + 1)
        } else {
            setIdxLeft(idxRight + 1)
        }

        setPointsIdxCounter(pointsIdxCounter + 1)
    }

    const handleNeitherButton = () => {
        if (selectedPoint) return

        if (idxLeft >= idxRight) {
            setIdxRight(idxLeft + 1)
            setIdxLeft(idxLeft + 2)
        } else {
            setIdxLeft(idxRight + 1)
            setIdxRight(idxRight + 2)
        }

        setPointsIdxCounter(pointsIdxCounter + 2)

    }

    const handleStartOverButton = () => {
        onDone({valid: false, value: null})
        setIdxRight(1)
        setIdxLeft(0)
        setPointsIdxCounter(1)
        setSelectedPoint(null)
    }

    const isSelectionComplete = () => {
        return pointsIdxCounter >= pointList.length
    }

    return (
        <div className={classes.container} {...otherProps}>

            <div className={classes.mainPointContainer}>
                <div className={classes.mainPointSubject}>{mainPoint.subject}</div>
                <div className={classes.mainPointDescription}>{mainPoint.description}</div>
            </div>

            <span className={isSelectionComplete() ? classes.statusBadgeComplete : classes.statusBadge}>{`${pointsIdxCounter <= pointList.length ? pointsIdxCounter : pointList.length} out of ${pointList.length}`}</span>

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
                        <div className={classes.visiblePoint} ref={visibleRightPointRef} onClick={handleRightPointClick}>{pointList[idxRight]}</div>}
                </div>
                {!isSelectionComplete() &&
                    <div className={classes.neitherButton} onClick={handleNeitherButton}>Neither</div>}
                {isSelectionComplete() &&
                    <div className={classes.startOverButton} onClick={handleStartOverButton}>Start Over</div>
                }
            </div>

        </div>
    )
}

const useStyles = createUseStyles(theme => ({

    container: {
        fontFamily: theme.font.fontFamily,
    },
    statusBadge: {
        backgroundColor: theme.colors.statusBadgeProgressBackground,
        border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeProgressBorder}`,
        ...sharedStatusBadgeStyle()
    },
    statusBadgeComplete: {
        backgroundColor: theme.colors.statusBadgeCompletedBackground,
        border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeCompletedBorder}`,
        ...sharedStatusBadgeStyle()
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
        width: '30%',
    },
    emptyPoint: {
        position: 'absolute',
        width: '30%',
        top: '-2rem',
    },
    visiblePointsContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        marginTop: '1rem',
        gap: '1rem',
    },
    visiblePoint: {
        width: '30%',
        cursor: 'pointer',
        left: '0',
        right: '0',
        transition: `all 0.5s linear`,
    },
    lowerContainer: {
        marginTop: '1rem',
        backgroundColor: theme.colors.cardOutline,
        borderRadius: '1rem',
        border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
    },
    neitherButton: {
        border: `${theme.border.width.thick} solid ${theme.colors.primaryButtonBlue}`,
        ...sharedButtonStyle(),
    },
    startOverButton: {
        border: `${theme.border.width.thick} solid ${theme.colors.primaryButtonBlue}`,
        ...sharedButtonStyle(),
    },
}))

const sharedStatusBadgeStyle = () => ({
    borderRadius: '1rem',
    padding: '0.375rem 0.625rem',

})

const sharedButtonStyle = () => ({
    width: 'fit-content',
    borderRadius: '0.5rem',
    padding: '0.5rem 2.5rem',
    margin: '2rem auto',
    cursor: 'pointer',
})

export default PairCompare;
