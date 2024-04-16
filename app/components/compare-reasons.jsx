// https://github.com/EnCiv/civil-pursuit/issues/77

'use strict'
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import PairCompare from './pair-compare';


function CompareReasons(props) {
    const { pointList = [], side = '', onDone = () => { }, className, ...otherProps } = props;
    const classes = useStyles();
    const [completedPoints, setCompletedPoints] = useState(new Set());
    const [percentDone, setPercentDone] = useState(0);

    useEffect(() => {
        if (completedPoints.size === pointList.length) {
            onDone({valid: true, value: percentDone})
        } else {
            onDone({valid: false, value: percentDone})
        }
    }, [completedPoints, percentDone])

    useEffect(() => {
        if (pointList.length === 0) setPercentDone(100);
        else {
            setPercentDone(Number(((completedPoints.size / pointList.length) * 100).toFixed(2)))
        }
    }, [completedPoints, pointList])


    const handlePairCompare = ({ valid, value }, idx) => {

        setCompletedPoints(prevPoints => {
            const updatedPoints = new Set(prevPoints);
            if (valid) {
                updatedPoints.add(idx)
            } else {
                updatedPoints.delete(idx)
            }
            return updatedPoints;
        })

    }

    return (
        <div className={classes.container} {...otherProps}>
            {
                pointList.map((headlinePoint, idx) => (
                    <div key={idx} className={classes.headlinePoint}>
                        <div className={classes.headlineTitle}>Please choose the most convincing explanation for...</div>
                        <div className={classes.headlineSubject}>{headlinePoint.subject}</div>
                        <PairCompare
                            className={classes.pairCompare}
                            pointList={side === "most" ? headlinePoint.reasonPoints?.most : headlinePoint.reasonPoints?.least}
                            onDone={(value) => handlePairCompare(value, idx)} />
                    </div>
                ))
            }
        </div>
    )
}


const useStyles = createUseStyles(theme => ({

    container: {
        fontFamily: theme.font.fontFamily,
    },
    headlinePoint: {
        borderTop: '0.0625rem solid #000000',
        marginBottom: '4rem',
        paddingTop: '2rem',
        '&:first-child': {
            borderTop: 'none',
        },
    },
    headlineTitle: {
        fontWeight: '600',
        fontSize: '1.5rem',
        lineHeight: '2rem',
    },
    headlineSubject: {
        fontWeight: '300',
        fontSize: '2.25rem',
        lineHeight: '2.9375rem',

    },
    pairCompare: {
        marginTop: '1rem',
    }
}))


export default CompareReasons;
