//https://github.com/EnCiv/civil-pursuit/issues/103

'use strict';

import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import WhyInput from './why-input.jsx';
import { Z_FULL_FLUSH } from 'zlib';

export default function WhyStep(props) {
    const {
        className = '',
        type = '', // "most" or "least"
        intro = '',
        shared = { mosts: [], leasts: [], whyMosts: [], whyLeasts: [] },
        onDone = () => { },
        ...otherProps
    } = props;
    const classes = useStylesFromThemeFunction({ valid: true, value: [] });

    const [points, setPoints] = useState(type === "most" ? shared.mosts : shared.leasts);
    const [answeredPoints, setAnsweredPoints] = useState(type === "most" ? shared.whyMosts : shared.whyLeasts);

    useEffect(() => {
        if (!points.length || areAnswersComplete(answeredPoints)) {
            onDone({ valid: true, value: answeredPoints });
        };
    }, [answeredPoints]);

    const updateWhyResponse = ({ valid, value }) => {
        if (!valid) return;
        const updatedAnswers = answeredPoints.map(answer => {
            if (answer._id === value.parentId) {
                answer.answerSubject = value.subject;
                answer.answerDescription = value.description;
            }
            return answer;
        });
        setAnsweredPoints(updatedAnswers);
    };

    const areAnswersComplete = (answeredPoints) => {
        return (answeredPoints.every(answer => {
            if ("answerSubject" in answer && "answerDescription" in answer) {
                return true;
            }
        }));
    };

    return (
        <div className={cx(classes.wrapper, className)} {...otherProps}>
            <div className={classes.introContainer}>
                <div className={classes.introTitle}>
                    {type &&
                        `Why it's ${type[0].toUpperCase() + type.slice(1)} Important`
                    }
                </div>
            </div>
            <div className={classes.introText}>{intro}</div>
            <div className={classes.pointsContainer}>
                {points.length ? (
                    points.map((point) => (
                        <div key={point._id} className={classes.pointContainer}>
                            <hr></hr>
                            <WhyInput
                                point={point}
                                defaultValue={{ subject: answeredPoints.subject, description: answeredPoints.description }}
                                onDone={updateWhyResponse}
                            />
                        </div>
                    ))
                ) : ""}
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
        display: "flex",
        textAlign: "left",
        // margin: "0 0 4rem 0",
    },
    introTitle: {
        fontSize: "2.25rem",
        paddingBottom: "2rem",
    },
    introText: {
        width: "33rem",
        fontSize: "1.25rem",
    },
    pointsContainer: {
        fontSize: "1.25rem",
    },
    // pointHr: {
    //     borderTop: "1px solid #D9D9D9",
    // },
}));

