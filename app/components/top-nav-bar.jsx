// https://github.com/EnCiv/civil-pursuit/issues/52

'use strict'

import React, { useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import SvgEncivBlack from '../svgr/enciv-black'

// Placeholder for the user-or-signup component
const UserOrSignupPlaceholder = () => {
    return <div>Hello, Andrew! Logout</div>;
};


const TopNavBar = (props) => {
    const { className, menu, style } = props;
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(menu[0].name);
    const classes = useStylesFromThemeFunction();

    const toggleMenu = () => {
        setIsExpanded(!isExpanded);
    };

    const handleMenuItemClick = (itemName) => {
        setSelectedItem(itemName);
        // add the function that should be executed when a menu item is clicked
    };

    return (
        <div className={`${classes.navBarContainer} ${className}`} style={style}>
            <SvgEncivBlack className={classes.logo} />

            <div className={classes.menuContainer}>
                {menu.map((item, index) => Array.isArray(item) ? (
                    <div key={index} className={classes.menuGroup}>
                        {item.map(subItem => (
                            <button
                                key={subItem.name}
                                className={`${classes.menuItem} ${selectedItem === subItem.name ? classes.selectedItem : ''}`}
                                onClick={() => handleMenuItemClick(subItem.name)}
                            >
                                {subItem.name}
                            </button>
                        ))}
                    </div>
                ) : (
                    <button
                        key={item.name}
                        className={`${classes.menuItem} ${selectedItem === item.name ? classes.selectedItem : ''}`}
                        onClick={() => handleMenuItemClick(item.name)}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            <div className={classes.userOrSignupContainer}>
                <UserOrSignupPlaceholder />
            </div>

            <button className={classes.menuToggle} onClick={toggleMenu}>
                Menu
            </button>
        </div>
    );
};

// Define the styles using the theme object
const useStylesFromThemeFunction = createUseStyles(theme => ({
    navBarContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5em',
        position: 'relative',
        background: theme.colors.primary,
        color: theme.colors.textPrimary,
    },
    logo: {
        width: '15%',
        height: 'auto',
    },
    menuContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItem: {
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '0.5em 1em',
        margin: '0 0.25em',
        color: theme.colors.textPrimary,
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    selectedItem: {
        textDecoration: 'underline',
    },
    userOrSignupContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '0.5em',
    },
    menuToggle: {
        display: 'none',
    },
    // Add responsive styles if needed
}));

export default TopNavBar