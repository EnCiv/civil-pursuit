// https://github.com/EnCiv/civil-pursuit/issues/53

'use strict'
import React, { useEffect, useRef, useState } from 'react';
import Point from './point.jsx';
import { createUseStyles } from 'react-jss';

function PairCompare(props) {
    const { pointList = [], onDone = () => { }, mainPoint = { subject: "", description: "" }, ...otherProps } = props

    // idxLeft and idxRight can swap places at any point - they are simply pointers to the current two <Point/> elements
    const [idxLeft, setIdxLeft] = useState(0);
    const [idxRight, setIdxRight] = useState(1);

    const visibleRightPointRef = useRef(null);
    const visibleLeftPointRef = useRef(null);
    const hiddenLeftPointRef = useRef(null);
    const hiddenRightPointRef = useRef(null);

    const [pointsIdxCounter, setPointsIdxCounter] = useState(1);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isRightTransitioning, setIsRightTransitioning] = useState(false);
    const [isLeftTransitioning, setIsLeftTransitioning] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        if (isSelectionComplete()) {
            setSelectedPoint(pointList[idxLeft] ? pointList[idxLeft] : pointList[idxRight]);
        }
    }, [pointsIdxCounter])

    useEffect(() => {
        onDone({ valid: true, value: selectedPoint })
    }, [selectedPoint])

    const handleLeftPointClick = () => {

        // prevent transitions from firing on last comparison
        if (idxRight >= pointList.length - 1 || idxLeft >= pointList.length - 1) {
            if (idxLeft >= idxRight) {
                setIdxRight(idxLeft + 1)
            } else {
                setIdxRight(idxRight + 1)
            }
            setPointsIdxCounter(pointsIdxCounter + 1)
            return
        }

        setIsLeftTransitioning(true)
        const visiblePointRight = visibleRightPointRef.current
        const hiddenPointRight = hiddenRightPointRef.current

        Object.assign(visiblePointRight.style, { position: 'relative', transform: 'translateX(200%)', transition: 'transform 0.5s linear' });
        Object.assign(hiddenPointRight.style, { position: 'absolute', transform: 'translateY(100%)', transition: 'transform 0.5s linear' });


        setTimeout(() => {
            setIsLeftTransitioning(false);
            if (idxLeft >= idxRight) {
                setIdxRight(idxLeft + 1);
            } else {
                setIdxRight(idxRight + 1);
            }

            setPointsIdxCounter(pointsIdxCounter + 1);

            Object.assign(visiblePointRight.style, { position: '', transition: 'none', transform: '' });
            Object.assign(hiddenPointRight.style, { position: '', transition: 'none', transform: '' });

        }, 500);

    }

    const handleRightPointClick = () => {

        // prevent transitions from firing on last comparison
        if (idxRight >= pointList.length - 1 || idxLeft >= pointList.length - 1) {
            if (idxLeft >= idxRight) {
                setIdxLeft(idxLeft + 1)
            } else {
                setIdxLeft(idxRight + 1)
            }
            setPointsIdxCounter(pointsIdxCounter + 1)
            return
        }

        setIsRightTransitioning(true)
        const visiblePointLeft = visibleLeftPointRef.current;
        const hiddenPointLeft = hiddenLeftPointRef.current;

        Object.assign(visiblePointLeft.style, { position: 'relative', transform: 'translateX(-200%)', transition: 'transform 0.5s linear' });
        Object.assign(hiddenPointLeft.style, { position: 'absolute', transform: 'translateY(100%)', transition: 'transform 0.5s linear' });


        setTimeout(() => {
            setIsRightTransitioning(false)
            if (idxLeft >= idxRight) {
                setIdxLeft(idxLeft + 1)
            } else {
                setIdxLeft(idxRight + 1)
            }

            setPointsIdxCounter(pointsIdxCounter + 1)

            Object.assign(visiblePointLeft.style, { position: '', transition: 'none', transform: '' });
            Object.assign(hiddenPointLeft.style, { position: '', transition: 'none', transform: '' });

        }, 500);

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
        onDone({ valid: false, value: null })
        setIdxRight(1)
        setIdxLeft(0)
        setPointsIdxCounter(1)
        setSelectedPoint(null)
    }

    const isSelectionComplete = () => {
        return pointsIdxCounter >= pointList.length
    }

    const nextIndex = idxLeft > idxRight ? idxLeft + 1 : idxRight + 1
    const hiddenEmptyLeftPoint = <Point ref={hiddenLeftPointRef} className={classes.emptyPoint} />
    const hiddenTransitioningLeftPoint = <Point ref={hiddenLeftPointRef} className={classes.emptyPoint} subject={pointList[nextIndex]?.props?.subject} description={pointList[nextIndex]?.props?.description} />
    const hiddenEmptyRightPoint = <Point ref={hiddenRightPointRef} className={classes.emptyPoint} />
    const hiddenTransitioningRightPoint = <Point ref={hiddenRightPointRef} className={classes.emptyPoint} subject={pointList[nextIndex]?.props?.subject} description={pointList[nextIndex]?.props?.description} />

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
                        <div className={classes.hiddenPoint}>{isRightTransitioning ? hiddenTransitioningLeftPoint : hiddenEmptyLeftPoint}</div>}
                    {pointsIdxCounter < pointList.length &&
                        <div className={classes.hiddenPoint}>{isLeftTransitioning ? hiddenTransitioningRightPoint : hiddenEmptyRightPoint}</div>}
                </div>

                <div className={classes.visiblePointsContainer}>
                    {idxLeft < pointList.length &&
                        <div className={classes.visiblePoint} ref={visibleLeftPointRef} onClick={handleLeftPointClick}>{pointList[idxLeft]}</div>}
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
        overflowX: 'hidden',
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
        overflow: 'visible',
        paddingTop: '5rem',
        marginBottom: '1rem',
        clipPath: 'xywh(0 0 100% 500%)'
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
        gap: '1rem',
    },
    visiblePoint: {
        width: '30%',
        cursor: 'pointer',
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
