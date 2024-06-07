'use strict'
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import StatusBadge from './status-badge';

const RoundTracker = ({ totalRounds = 12 }) => {
    const [currentRound, setCurrentRound] = useState(1);
    const classes = useStyles();

    const progressRound = () => {
        if (currentRound < totalRounds) {
            setCurrentRound(prevRound => prevRound + 1);
        }
    };

    const renderRounds = () => {
        let startRound, endRound;

        if (currentRound >= 3) {
            startRound = currentRound - 2;
            endRound = currentRound;
        } else {
            startRound = 1;
            endRound = Math.min(3, totalRounds);
        }

        const visibleRounds = [];
        for (let i = startRound; i <= endRound; i++) {
            let status;
            if (i < currentRound) {
                status = 'Complete';
            } else if (i === currentRound) {
                status = 'In Progress';
            } else {
                status = 'Pending';
            }
            visibleRounds.push({ round: i, status });
        }

        return visibleRounds.map((round, index) => (
            <React.Fragment key={index}>
                <div className={classes.roundContainer}>
                    <div className={classes.roundNumber}>Round {round.round}</div>
                    <StatusBadge name={round.status} status={round.status.toLowerCase().replace(/\s/g, '')} className={classes.badge} />
                </div>
                {index < visibleRounds.length - 1 && <div className={classes.dash} />}
            </React.Fragment>
        ));
    };

    return (
        <div className={classes.roundTracker}>
            {renderRounds()}
            <button className={classes.button} onClick={progressRound}>Next</button>
        </div>
    );
}

const useStyles = createUseStyles({
    roundTracker: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    roundContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    roundNumber: {
        marginBottom: '0.25rem',
        fontWeight: 'bold',
    },
    badge: {
        margin: '0 0.5rem',
    },
    dash: {
        width: '1.5rem',
        height: '0.125rem',
        backgroundColor: '#ccc',
    },
    button: {
        marginLeft: '1rem',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        cursor: 'pointer',
    },
});

export default RoundTracker;
