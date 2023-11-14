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

    const handleMenuItemClick = (item) => {
        item.func();
        setSelectedItem(item.name);
    };

    const handleMenuDropdownClick = (item, index) => {
        setSelectedItem(item[0].name);
        item[index].func();
    };


    return (
        <div className={`${classes.navBarContainer} ${className}`} style={style}>
            <SvgEncivBlack className={classes.logo} />

            {/* This is the computer menu */}
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
                                        onClick={() => handleMenuDropdownClick(item, subIndex + 1)}>
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
                        onClick={() => handleMenuItemClick(item)}>
                        {item.name}
                    </div>
                ))}
            </div>

            <div className={classes.userOrSignupContainer}>
                <UserOrSignupPlaceholder />
            </div>

            <button className={classes.menuToggle} onClick={toggleMenu}>
                &#8801;
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
        padding: '0.5rem',
        position: 'relative',
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
        [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
            display: 'none',
        },
    },
    menuGroup: {
        cursor: 'default',
        background: 'none',
        border: 'none',
        padding: '0.5rem 1rem',
        margin: '0 0.25rem',
        borderBottom: '2px solid ${theme.colors.white}',
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
        padding: '0.5rem 1rem',
        margin: '0 0.25rem',
        color: theme.colors.textPrimary,
        '&:hover': {
            background: theme.colors.hoverGray,
        },
    },
    selectedItem: {
        borderBottom: '2px solid',
    },
    userOrSignupContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '0.5rem',
        [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
            display: 'none',
        },
    },
    menuToggle: {
        width: '15%',
        height: 'auto',
        fontSize: '2rem',
        background: theme.colors.white,
        border: 'none',
        color: theme.colors.textPrimary,
        [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
            display: 'none'
        },
        '&:hover': {
            background: theme.colors.hoverGray,
        },
    },
}));

export default TopNavBar