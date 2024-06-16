// https://github.com/EnCiv/civil-pursuit/issues/101
'use strict';
import React from 'react';
import { createUseStyles } from 'react-jss';
import StatusBadge from './status-badge';

const RoundTracker = ({ roundsStatus = [], isMobile = false }) => {
  const classes = useStyles({ isMobile });

  const renderRounds = () => {
    let visibleRounds;

    if (isMobile) {
      const currentRoundIndex = roundsStatus.indexOf('inProgress');
      if (currentRoundIndex === 0) {
        visibleRounds = roundsStatus.slice(0, 2); // Show the first two rounds
      } else if (currentRoundIndex === roundsStatus.length - 1) {
        visibleRounds = roundsStatus.slice(currentRoundIndex); // Show only the last round
      } else {
        visibleRounds = roundsStatus.slice(currentRoundIndex, currentRoundIndex + 2); // Show the current and next rounds
      }
    } else {
        const currentRoundIndex = roundsStatus.indexOf('inProgress');
      if (currentRoundIndex === 0) {
        visibleRounds = ['inProgress', 'pending', 'pending'];
      } else if (currentRoundIndex < 11) {
        visibleRounds = roundsStatus.slice(currentRoundIndex - 1, currentRoundIndex + 2); // Ensure only showing the last 3 rounds
      } else {
        visibleRounds = roundsStatus.slice(-2); // Only show the last 3 rounds for round 12
      }
    }

    return visibleRounds.map((status, index) => (
      <React.Fragment key={index}>
        <div className={classes.roundContainer}>
          <div className={classes.roundNumber}>Round {roundsStatus.length - visibleRounds.length + index + 1}</div>
          <StatusBadge name={status.charAt(0).toUpperCase() + status.slice(1)} status={status.toLowerCase()} className={classes.badge} />
        </div>
        {index < visibleRounds.length - 1 && <div className={classes.dash} />}
      </React.Fragment>
    ));
  };

  return (
    <div className={classes.roundTracker}>
      {renderRounds()}
    </div>
  );
};

const useStyles = createUseStyles({
  roundTracker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: ({ isMobile }) => (isMobile ? 'row' : 'row'),
  },
  roundContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 0.5rem',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  roundNumber: {
    marginBottom: '0.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    '@media (max-width: 600px)': {
      marginBottom: '0.5rem',
    },
  },
  badge: {
    margin: '0 0.5rem',
    '@media (max-width: 600px)': {
      margin: '0 0.5rem 0.5rem 0.5rem',
    },
  },
  dash: {
    width: '1.5rem',
    height: '0.125rem',
    backgroundColor: '#ccc',
    '@media (max-width: 600px)': {
      width: '0.75rem',
      height: '0.0625rem',
    },
  },
});

export default RoundTracker;
