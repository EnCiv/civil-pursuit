// https://github.com/EnCiv/civil-pursuit/issues/100

import React from 'react';
import StatusBadge from './status-badge';

const QuestionBox = ({ subject, description, participants }) => {
  const styles = {
    container: {
        width: '1129px',
        height: '610px',
        borderRadius: '30px',
        border: '1px solid #D9D9D9',
        backgroundColor: 'rgba(235, 235, 235, 0.4)',
        margin: 'auto',
        position: 'relative',
        boxSizing: 'border-box',
    },
    topic: {
        width: '812px',
        height: '396px',
        textAlign: 'center',
        position: 'absolute',
        top: '58px',
        left: '158px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',

    },

    fixedText: {
        width: '101px',
        height: '25px',
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: '17px',
        lineHeight: '25px',
        letterSpacing: '0.01em',
        color: '#06335C',
        textAlign: 'center',
        whiteSpace: 'nowrap',
    },
    subject: {
        width: '812px',
        height: '264px',
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: '60px',
        lineHeight: '66px',
        letterSpacing: '-0.03em',
        color: '#06335C',
        margin: '0 auto',
        textAlign: 'center'
      },
    description: {
        width: '605px',
        height: '59px',
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '24px',
        color: '#06335C',
        margin: '0 auto',
        textAlign: 'center',
    },
    underlinedText: {
        textDecoration: 'underline'
    },
    participantsContainer: {
      position: 'absolute',
      top: '487px',
      left: '498px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }
  };
  const badgeName = `${participants} participants`;
  return (
    <div style={styles.container}>
      <div style={styles.topic}>
        <div style={styles.fixedText}>Civil Pursuit</div>
        <div style={styles.subject}>{subject}</div>
        <div style={styles.description}>
          {description?.text}
          <span style={styles.underlinedText}>{description?.underlinedText}</span>
        </div>
      </div>
        <div style={styles.participantsContainer}>
        <StatusBadge name={badgeName} status="" />
        </div>
        
    </div>
  ); 
};

export default QuestionBox;
