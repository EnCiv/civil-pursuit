// https://github.com/EnCiv/civil-pursuit/issues/77

'use strict'
import React from 'react';
import { createUseStyles } from 'react-jss';
import PairCompare from './pair-compare';


function CompareReasons(props) {
    const { pointList = [], side = '', onDone = () => { }, className, ...otherProps } = props;
    const classes = useStyles();

    const handleOnDone = ({ valid, value }) => {
        onDone({ valid, value })
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
                            onDone={handleOnDone} />
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
