//https://github.com/EnCiv/civil-pursuit/issues/103

import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import WhyInput from './why-input.jsx';

export default function WhyStep(props) {
    const {
        className = '',
        type = '', // "most" or "least"
        intro = '',
        shared = { mosts: [], leasts: [], whyMosts: [], whyLeasts: [] },
        onDone = () => { },
        ...otherProps
    } = props;
    const classes = useStylesFromThemeFunction();

    const [points, setPoints] = useState(type === "most" ? shared.mosts : shared.leasts);
    const [answeredPoints, setAnsweredPoints] = useState(type === "most" ? shared.whyMosts : shared.whyLeasts);

    console.log("points", points, "answeredPoints", answeredPoints);
    const updateWhyResponse = () => {

    };

    return (
        <div className={cx(classes.wrapper, className)} {...otherProps}>
            <div className={classes.introContainer}>
                <div className={classes.introTitle}>
                    {`Why it's ${type[0].toUpperCase() + type.slice(1)} Important`}
                </div>
            </div>
            <div className={classes.introText}>{intro}</div>
            <div className={classes.points}>
                {points.length && (
                    points.map((point, idx) => (
                        <div className={classes.pointContainer}>
                            <hr></hr>
                            <WhyInput
                                point={point}
                                defaultValue={{ subject: answeredPoints.subject, description: answeredPoints.description }}
                                onDone={updateWhyResponse}
                            />
                        </div>
                    ))
                )}
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
        width: "33rem",
        textAlign: "left",
    },
    introTitle: {
        fontSize: "2.25rem",
        paddingBottom: "2rem",
    },
    introText: {
        fontSize: "1.25rem",
    }
}));