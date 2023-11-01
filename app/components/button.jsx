import React, {useState, useRef} from 'react';
import { createUseStyles }  from 'react-jss';

function Button(props) {

    const {
        className = "",
        style = {},
        onDone = () => {},
        title = "",
        disabled = false,
        disableOnClick = false,
        children
    } = props;

    const [isDisabled, setIsDisabled] = useState(disabled);
    const [parentIsHovered, setParentIsHovered] = useState(false);
    const [longPress, setLongPress] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const longPressTimer = useRef(null);

    const classes = buttonStyles();
    const combinedClassName = `${classes[className]} ${className}`;

    const startLongPress = () => {
        const x = event.clientX || (event.touches && event.touches[0].clientX);
        const y = event.clientY || (event.touches && event.touches[0].clientY);
        
        setPosition({ x, y });
        longPressTimer.current = setTimeout(() => {
            setLongPress(true);
        }, 1000);
    }

    const stopLongPress = (event) => {
        clearTimeout(longPressTimer.current);
        if (longPress) {
            setLongPress(false);
        }
    }

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

                onMouseDown={startLongPress}
                onMouseUp={stopLongPress}
                onMouseLeave={stopLongPress}
                onTouchStart={startLongPress}
                onTouchEnd={stopLongPress}
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
    transition: 'all 100ms ease-out',

    '&:hover, &.hover': {
        textDecoration: 'underline',
    }
}

const buttonStyles = createUseStyles(theme => ({
    secondaryButton: {
        ...commonButtonStyles,
        backgroundColor: '#FFFFFF',
        color: '#06335C', 
        border: '0.125rem solid #06335C',

        '&:active': {
            backgroundColor: '#06335C',
            color: '#FFFFFF', 
            border: '0.125rem solid #06335C',
            textDecoration: 'none',
        },

        '&:focus': {
        },

        '&:disabled': {
            backgroundColor: '#FFFFFF',
            color: '#5D5D5C', 
            border: '0.125rem solid #5D5D5C',
            textDecoration: 'none',
            transition: 'none',
        }
    },

    modifierButton: {
        ...commonButtonStyles,
        backgroundColor: '#FFFFFF',
        color: '#403105',
        border: '0.125rem solid #FFC315',

        '&:active': {
            backgroundColor: '#FFC315',
            color: '#403105',
            border: '0.125rem solid #FFC315',
            textDecoration: 'none',
        },

        '&:focus': {
        },
    },

    primaryButton: {
        ...commonButtonStyles,
        backgroundColor: '#06335C',
        color: '#FFFFFF',
        border: '0.125rem solid #06335C',

        '&:active': {
            backgroundColor: '#01172C',
            border: '0.125rem solid #06335C',
            textDecoration: 'none',
        },

        '&:focus': {
        },

        '&:disabled': {
            backgroundColor: '#EBEBEB', 
            color: '#343433',
            border: '0.0625rem solid #EBEBEB',
            textDecoration: 'none',
            transition: 'none',
        }
    },

    textButton: {
        ...commonButtonStyles,
        backgroundColor: 'transparent',
        color: '#1A1A1A',
        border: 'none',
        textAlign: 'left', 
        textDecoration: 'underline',

        '&:active': {
            color: '#1A1A1A', 
            textDecoration: 'none',
        }
    }
}))



export { Button, ModifierButton, SecondaryButton, PrimaryButton, TextButton };