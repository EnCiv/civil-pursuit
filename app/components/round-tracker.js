// https://github.com/EnCiv/civil-pursuit/issues/101
'use strict';
import React from 'react';
import { createUseStyles } from 'react-jss';
import StatusBadge from './status-badge';

const RoundTracker = ({ roundsStatus = [] }) => {
  const classes = useStyles();

  const renderRounds = () => {
    const visibleRounds = roundsStatus.slice(-3); // Only show the last 3 rounds

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
    flexWrap: 'wrap',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  roundContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  roundNumber: {
    marginBottom: '0.25rem',
    fontWeight: 'bold',
    '@media (max-width: 600px)': {
      marginBottom: '0',
      marginRight: '0.5rem',
    },
  },
  badge: {
    margin: '0 0.5rem',
    '@media (max-width: 600px)': {
      margin: '0 0.25rem',
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
