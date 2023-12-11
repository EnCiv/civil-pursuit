// https://github.com/EnCiv/civil-pursuit/issues/50
import React from 'react';
import { createUseStyles }  from 'react-jss';
import cx from 'classnames';


const StepIntro = (props) => {

    const {
        className = "",
        subject = "",
        description = "",
        ...otherProps
    } = props;

    const classes = strpIntroStyles();
    const combinedClassName = cx(classes.stepIntro, className);

    const paragraphs = description.split('\\n').map((paragraph, index) => (
      <p key={index} className={classes.paragraph}>{paragraph}</p>
    ));
  
    return (
      <div className={combinedClassName}>
        <h1 className={classes.title}>{subject}</h1>
        {paragraphs}
      </div>
    );
  };
  
  // Styles for the StepIntro component using react-jss
  const strpIntroStyles = createUseStyles(theme => ({
    stepIntro: {
      // Add your common styles here
      fontFamily: 'Inter',
      fontStyle: 'normal',
      paddingBottom: '4.375rem',
      borderBottom: '1px solid #D9D9D9', 
    },

    title: {
        color: theme.colors.primaryButtonBlue,
        fontSize: '2.25rem', 
        fontWeight: 300,
        lineHeight: '2.9375rem',
        fontFamily: 'Inter',
    },

    paragraph: {
        color: theme.colors.title,
        fontSize: '1.25rem',
        fontWeight: 400,
        lineHeight: '1.875rem',
        fontFamily: 'Inter',
    },
  }));
  
  export default StepIntro;