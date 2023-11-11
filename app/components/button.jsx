import React, {useState, useRef} from 'react';
import { createUseStyles }  from 'react-jss';

/**
 * Button component that is styled using react-jss.
 * It supports various states like hover, active, and disabled, 
 * and can be configured with custom styles, titles, and callbacks.
 *
 * @param {Object} props - The props for the Button component.
 */

function Button(props) {

    const {
        className = "", // may or may not be passed. Should be applied to the outer most tag, after local classNames
        style = {}, // may or may not be passed, Should be applied to the outer most tag
        onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
        title = "", // text to display on hover
        disabled = false, 
        disableOnClick = false, // if true, the button gets disabled after click and stays disabled - prevents resubmission
        children
    } = props;

    const [isDisabled, setIsDisabled] = useState(disabled);
    const [parentIsHovered, setParentIsHovered] = useState(false);
    // Stretch Goal 
    // const [longPress, setLongPress] = useState(false);
    // const [position, setPosition] = useState({ x: 0, y: 0 });
    // const longPressTimer = useRef(null);

    const classes = buttonStyles();
    const combinedClassName = `${classes[className]} ${className}`;

    // Stretch Goal 
    // const startLongPress = () => {
    //     const x = event.clientX || (event.touches && event.touches[0].clientX);
    //     const y = event.clientY || (event.touches && event.touches[0].clientY);
        
    //     setPosition({ x, y });
    //     longPressTimer.current = setTimeout(() => {
    //         setLongPress(true);
    //     }, 1000);
    // }

    // const stopLongPress = (event) => {
    //     clearTimeout(longPressTimer.current);
    //     if (longPress) {
    //         setLongPress(false);
    //     }
    // }

    return (
        <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setParentIsHovered(true)}
            onMouseLeave={() => setParentIsHovered(false)}
        >
            <button
                className={`${combinedClassName} ${parentIsHovered ? 'hover' : ''}`}
                style={style}
                title={title}
                disabled={isDisabled}
                onClick={() => {
                    if (onDone) onDone();
                    if (disableOnClick) setIsDisabled(true);
                }}

                // onMouseDown={startLongPress}
                // onMouseUp={stopLongPress}
                // onMouseLeave={stopLongPress}
                // onTouchStart={startLongPress}
                // onTouchEnd={stopLongPress}
            >
                {children}
            </button>
            {/* Stretch Goal 
            {longPress && 
                <div style={{
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    transform: 'translateX(-50%, -100%)',
                    backgroundColor: 'white',
                    border: '1px solid black',
                    padding: '5px',
                    borderRadius: '5px',
                }}>
                    {title}
                </div>
            } */}
        </div>
    )
}

function ModifierButton(props) {
    return <Button {...props} className="modifierButton" />;
}

function SecondaryButton(props) {
    return <Button {...props} className="secondaryButton" />;
}

function PrimaryButton(props) {
    return <Button {...props} className="primaryButton" />;
}

function TextButton(props) {
    return <Button {...props} className="textButton" />;
}


const commonButtonStyles = {
    width: 'auto',
    height: 'auto',
    borderRadius: '0.5rem',
    padding: '0.5rem 1.25rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    textAlign: 'center',
}

const buttonStyles = createUseStyles(theme => ({
    secondaryButton: {
        ...commonButtonStyles,
        backgroundColor: theme.colors.white,
        color: theme.colors.primaryButtonBlue, 
        border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,

        '&:active': {
            backgroundColor: theme.colors.primaryButtonBlue,
            color: theme.colors.white, 
            border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,
            textDecoration: 'none',
        },

        '&:focus': {
        },

        '&:disabled': {
            backgroundColor: theme.colors.white,
            color: theme.colors.disableGray, 
            border: `0.125rem solid ${theme.colors.disableSecBorderGray}`,
            textDecoration: 'none',
            transition: 'none',
        },

        '&:hover, &.hover': {
            textDecoration: 'underline',
            backgroundColor: theme.colors.white,
            borderColor: theme.colors.primaryButtonBlue
        }
    },

    modifierButton: {
        ...commonButtonStyles,
        backgroundColor: theme.colors.white,
        color: theme.colors.textBrown,
        border: `0.125rem solid ${theme.colors.encivYellow}`,

        '&:active': {
            backgroundColor: theme.colors.encivYellow,
            color: theme.colors.textBrown,
            border: `0.125rem solid ${theme.colors.encivYellow}`,
            textDecoration: 'none',
        },

        '&:focus': {
        },

        '&:hover, &.hover': {
            textDecoration: 'underline',
            backgroundColor: theme.colors.white,
            borderColor: theme.colors.encivYellow
        }
    },

    primaryButton: {
        ...commonButtonStyles,
        backgroundColor: theme.colors.primaryButtonBlue,
        color: theme.colors.white,
        border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,

        '&:active': {
            backgroundColor: theme.colors.mouseDownPrimeBlue,
            border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,
            textDecoration: 'none',
        },

        '&:focus': {
        },

        '&:disabled': {
            backgroundColor: theme.colors.borderGray, 
            color: theme.colors.disableTextBlack,
            border: `0.0625rem solid ${theme.colors.borderGray}`,
            textDecoration: 'none',
            transition: 'none',
        },

        '&:hover, &.hover': {
            textDecoration: 'underline',
            backgroundColor: theme.colors.primaryButtonBlue,
            borderColor: theme.colors.primaryButtonBlue
        }
    },

    textButton: {
        ...commonButtonStyles,
        backgroundColor: 'transparent',
        color: theme.colors.title,
        border: 'none',
        textAlign: 'left', 
        textDecoration: 'underline',

        '&:active': {
            color: theme.colors.title, 
            textDecoration: 'none',
        },

        '&:hover, &.hover': {
            textDecoration: 'underline',
            backgroundColor: 'transparent',
            borderColor: 'none'
        }
    }
}))



export { Button, ModifierButton, SecondaryButton, PrimaryButton, TextButton };