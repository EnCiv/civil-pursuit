//https://github.com/EnCiv/civil-pursuit/issues/103

import React from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import Point from './point.jsx';

export default function WhyStep(props) {
    const {
        className = '',
        type = '', // "most" or "least"
        intro = '',
        shared = {}, // contains point obj arrays for mosts, leasts, whyMosts, whyLeasts
        onDone = () => { },
        ...otherProps
    } = props;
    const classes = useStylesFromThemeFunction();

    const CreatePoint = (pointObj, vState = 'default', children, className) => {
        const { subject, description } = pointObj;
        return (
            <Point
                subject={subject}
                description={description}
                vState={vState}
                children={children}
                className={className}
            />
        );
    };

    return (
        <div className={cx(classes.wrapper, className)} {...otherProps}>
            <div className={classes.introContainer}>
                <div className={classes.introTitle}>
                    {`Why it's ${type[0].toUpperCase() + type.slice(1)} Important`}
                </div>
                <div className={classes.introText}>{intro}</div>
            </div>
        </div>
    );
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
    wrapper: {
        background: theme.colorPrimary,
        padding: '1rem',
    },
    introContainer: {
        textAlign: "left",
    },
    introTitle: {
        fontSize: "2.25rem",
    },
    introText: {
        fontSize: "1.25rem",
    }
}));