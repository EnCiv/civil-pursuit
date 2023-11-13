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
    const [selectedItem, setSelectedItem] = useState(null);
    const classes = useStylesFromThemeFunction();
    const [openDropdown, setOpenDropdown] = useState(null);
    const handleMouseEnter = (index) => { setOpenDropdown(index) };
    const handleMouseLeave = () => { setOpenDropdown(null) };

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

                {menu && menu.map((item, index) => Array.isArray(item) ? (

                    <div className={`${classes.menuGroup} ${selectedItem === item[0].name ? classes.selectedItem : ''}`}
                        key={index}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={() => handleMouseLeave()}>
                        {item[0].name} {'\u25BE'}
                        {openDropdown === index && (
                            <div className={classes.dropdownMenu}>
                                {item.slice(1).map((subItem, subIndex) => (
                                    <div key={subIndex} className={classes.menuItem}
                                        onClick={() => handleMenuItemClick(item[0].name)}>
                                        {subItem.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        key={item.name}
                        className={`${classes.menuItem} ${selectedItem === item.name ? classes.selectedItem : ''}`}
                        onClick={() => handleMenuItemClick(item.name)}>
                        {item.name}
                    </div>
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
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    menuGroup: {
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '0.5em 1em',
        margin: '0 0.25em',
        color: theme.colors.textPrimary,
    },
    dropdownMenu: {
        position: 'absolute',
        background: theme.colors.encivYellow,
    },
    menuItem: {
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '0.5em 1em',
        margin: '0 0.25em',
        color: theme.colors.textPrimary,
        '&:hover': {
            background: theme.colors.hoverGray,
        },
    },
    selectedItem: {
        borderBottom: '2px solid'
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
}));

export default TopNavBar