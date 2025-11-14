// https://github.com/EnCiv/civil-pursuit/issues/52
// https://github.com/EnCiv/civil-pursuit/issues/144
// https://github.com/EnCiv/civil-pursuit/issues/182
// https://github.com/EnCiv/civil-pursuit/issues/222

'use strict'

import React, { useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import SvgEncivBlack from '../svgr/enciv-black'
import SvgEncivWhite from '../svgr/enciv-white'
import Donate from './donate'

/*
 * # TopNavBar
 *
 * A responsive navigation bar component for the EnCiv application that adapts to different viewport sizes
 * and display modes. Features a logo, menu items with dropdown support, optional user/sign-up section,
 * and donation button.
 *
 * ## Props
 *
 * - `className` (string, optional) - Additional CSS classes to apply to the root element
 * - `menu` (Array, optional) - Array of menu items. Each item can be:
 *   - An object with `{ name: string, func: function }` for simple menu items
 *   - An array where first item is the parent (with dropdown arrow) and remaining items are dropdown children
 * - `mode` (string, optional) - Display mode controlling colors and positioning:
 *   - `'light'` - Light background with dark text
 *   - `'dark'` - Dark background with white text and white logo
 *   - `'transparent'` - Transparent background with white text and white logo (absolute positioning)
 *   - `'dark-transparent'` - Transparent background with white text and white logo (absolute positioning)
 *   - `'light-transparent'` - Transparent background with dark text and dark logo (absolute positioning)
 *   - `'vertical'` - Vertical menu layout (side navigation)
 * - `defaultSelectedItem` (string, optional) - Name of the menu item that should be selected by default
 * - `UserOrSignInUp` (React.Component, optional) - Component to render for user authentication/signup (appears top-right)
 * - `tabIndex` (number, optional, default: 0) - Tab index for keyboard navigation
 * - `...otherProps` - Additional props spread to the root element
 *
 * ## Responsive Behavior
 *
 * - **Desktop** (> condensedWidthBreakPoint): Shows horizontal menu with logo on left, menu centered
 * - **Mobile** (< condensedWidthBreakPoint): Shows mobile menu toggle, hides desktop menu
 * - **Menu wrapping**: Desktop menu can wrap to multiple lines if needed
 *
 * ## Features
 *
 * - Dropdown menus on hover (desktop) or click (mobile)
 * - Keyboard navigation support (Space key to open dropdowns)
 * - Integrated Donate button in menu
 * - Optional user authentication section
 * - Responsive logo sizing
 * - Theme-aware styling with color modes
 */
const TopNavBar = props => {
  const { className, menu, mode, defaultSelectedItem, UserOrSignInUp, tabIndex = 0, ...otherProps } = props
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem)
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleMouseEnter = index => {
    setOpenDropdown(index)
  }
  const handleMouseLeave = () => {
    setOpenDropdown(null)
  }

  const classes = useStylesFromThemeFunction(props)

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
  }

  const handleMenuItemClick = item => {
    item.func()
    setSelectedItem(item.name)
  }

  const handleMobileMenuGroupClick = (item, index) => {
    item[0].func()

    if (openDropdown === index) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(index)
    }
  }

  // taken from button.jsx
  const handleKeyDown = (e, type, index) => {
    e.stopPropagation()

    // if space key is pressed
    if (e.keyCode === 32) {
      if (type === 'menu') {
        if (mode === 'vertical') {
          handleMenuItemClick(menu[index])
        } else {
          handleMouseLeave() // closes any dropdowns still open
        }
      } else if (type === 'menuGroup') {
        handleMouseEnter(index)
      }
    }
  }

  if (mode === 'vertical') {
    return (
      <menu className={cx(classes.verticalMenuContainer, className)} {...otherProps}>
        {menu &&
          menu.map((item, index) => (
            <li className={classes.menuList}>
              <div
                key={item.name}
                tabIndex={tabIndex}
                onKeyDown={e => handleKeyDown(e, 'menu', index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave()}
                className={cx(classes.verticalMenuItem, {
                  [classes.selectedItem]: selectedItem === item.name,
                })}
                onClick={() => handleMenuItemClick(item)}
              >
                {item.name}
              </div>
            </li>
          ))}
      </menu>
    )
  }

  return (
    <div className={cx(classes.topNavBar, classes.colors, className)} {...otherProps}>
      <div className={classes.columnAligner}>
        <div className={`${classes.navBarContainer}`}>
          {/* Logo column */}
          <div className={classes.logoContainer}>
            {mode === 'dark' || mode === 'transparent' || mode === 'dark-transparent' ? <SvgEncivWhite className={classes.logo} height="auto" /> : <SvgEncivBlack className={classes.logo} height="auto" />}
          </div>

          {/* User or sign up - top right corner */}
          {UserOrSignInUp && (
            <div className={classes.userOrSignupContainer}>
              <UserOrSignInUp />
            </div>
          )}

          {/* Menu and actions column */}
          <div className={classes.menuAndActionsContainer}>
            {/* This is the computer menu */}
            <menu className={classes.menuContainer}>
              {menu &&
                menu.map((item, index) =>
                  Array.isArray(item) ? (
                    <li className={classes.menuList} key={index}>
                      <div
                        className={cx(classes.menuGroup, { [classes.selectedItem]: selectedItem === item[0].name })}
                        tabIndex={tabIndex}
                        onKeyDown={e => handleKeyDown(e, 'menuGroup', index)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={() => handleMouseLeave()}
                      >
                        {item[0].name} {'\u25BE'}
                        {openDropdown === index && (
                          <div className={classes.dropdownMenu}>
                            {item.slice(1).map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                tabIndex={tabIndex}
                                className={cx(classes.menuItem, classes.colors, {
                                  [classes.selectedItem]: selectedItem === subItem.name,
                                })}
                                onClick={() => handleMenuItemClick(subItem)}
                              >
                                {subItem.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ) : (
                    <li className={classes.menuList} key={item.name}>
                      <button
                        tabIndex={tabIndex}
                        onKeyDown={e => handleKeyDown(e, 'menu', index)}
                        className={cx(classes.menuItem, classes.colors, {
                          [classes.selectedItem]: selectedItem === item.name,
                        })}
                        onClick={() => handleMenuItemClick(item)}
                      >
                        {item.name}
                      </button>
                    </li>
                  )
                )}
              <div className={classes.donate}>
                <Donate />
              </div>
            </menu>
          </div>

          {/* Mobile menu toggle */}
          <button className={cx(classes.menuToggle, classes.colors)} onClick={toggleMenu}>
            &#8801;
          </button>
        </div>

        {/* This is the mobile menu */}
        {isExpanded ? (
          <menu className={cx(classes.mobileMenuContainer)}>
            {UserOrSignInUp && (
              <div className={classes.mobileUserOrSignupContainer}>
                <UserOrSignInUp />
              </div>
            )}
            {menu &&
              menu.map((item, index) =>
                Array.isArray(item) ? (
                  <li className={classes.menuList}>
                    <div
                      className={cx(classes.mobileMenuGroup, classes.colors, {
                        [classes.selectedItem]: selectedItem === item[0].name,
                      })}
                      key={index}
                      onClick={() => handleMobileMenuGroupClick(item, index)}
                    >
                      {item[0].name} {'\u25BE'}
                      {openDropdown === index && (
                        <div className={classes.mobileDropdownMenu}>
                          {item.slice(1).map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              className={cx(classes.mobileMenuItem, classes.colors, {
                                [classes.selectedItem]: selectedItem === subItem.name,
                              })}
                              onClick={event => {
                                event.stopPropagation()
                                handleMenuItemClick(subItem)
                              }}
                            >
                              {subItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ) : (
                  <li className={classes.menuList}>
                    <div
                      key={item.name}
                      className={cx(classes.mobileMenuItem, classes.colors, {
                        [classes.selectedItem]: selectedItem === item.name,
                      })}
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {item.name}
                    </div>
                  </li>
                )
              )}
            <div className={classes.mobileDonate}>
              <Donate />
            </div>
          </menu>
        ) : null}
      </div>
    </div>
  )
}

// Define the styles using the theme object
const useStylesFromThemeFunction = createUseStyles(theme => ({
  colors: props => ({
    color: (() => {
      if (props.mode === 'dark' || props.mode === 'transparent' || props.mode === 'dark-transparent') {
        return 'white'
      } else if (props.mode === 'light' || props.mode === 'light-transparent') {
        return theme.colors.lightModeColor
      } else {
        return theme.colors.darkModeGray
      }
    })(),
  }),
  topNavBar: props => ({
    width: '100%',
    zIndex: theme.zIndexes.menu, // High z-index to ensure navbar and dropdowns appear above other content
    position: (() => {
      if (props.mode === 'transparent' || props.mode === 'dark-transparent' || props.mode === 'light-transparent') {
        return 'absolute'
      } else {
        return 'relative'
      }
    })(),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
    backgroundColor: (() => {
      if (props.mode === 'dark') {
        return theme.colors.darkModeGray
      } else if (props.mode === 'light') {
        return theme.colors.lightModeColor
      } else if (props.mode === 'transparent' || props.mode === 'dark-transparent' || props.mode === 'light-transparent') {
        return 'transparent'
      } else {
        return 'white'
      }
    })(),
  }),

  columnAligner: props => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //maxWidth: theme.maxPanelWidth,
  }),
  donate: {
    padding: '0 0 0 1rem',
  },
  mobileDonate: {
    padding: '0 0 0.5rem 0',
  },
  navBarContainer: {
    width: '80%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    position: 'relative',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexWrap: 'nowrap',
    },
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    // On desktop, logo is in left column
    [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
      alignSelf: 'flex-start',
    },
  },
  logo: {
    width: '8.5rem',
    height: 'auto',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '4rem',
    },
  },
  menuAndActionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1 1 auto',
    minWidth: 0,
    position: 'relative',
    alignSelf: 'flex-end',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },
  menuContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: '0.4rem',
    margin: 0,
    padding: 0,
    alignItems: 'baseline',
    width: '100%',
  },
  mobileMenuContainer: props => ({
    padding: '1.25rem 1.25rem',
    display: 'flex',
    width: '80%',
    background: props.mode === 'dark' || props.mode === 'transparent' || props.mode === 'dark-transparent' ? theme.colors.darkModeGray : theme.colors.encivYellow,
    flexDirection: 'column',
    justifyContent: 'left',
    position: 'relative',
    [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  }),
  menuGroup: props => ({
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1rem', // forcing because unknown things are overriding it
    cursor: 'default',
    background: 'none',
    border: 'none',
    padding: '0.5rem 1rem',
    margin: '0 0.25rem',
    whiteSpace: 'nowrap',
    position: 'relative',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      cursor: 'pointer',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: props.mode === 'dark' || props.mode === 'transparent' || props.mode === 'dark-transparent' ? 'black' : 'white',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  mobileMenuGroup: props => ({
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1rem', // forcing because unknown things are overriding it
    cursor: 'default',
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    margin: '0',
    whiteSpace: 'nowrap',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      cursor: 'pointer',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: props.mode === 'dark' ? 'black' : 'white',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  dropdownMenu: props => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    background: theme.colors.encivYellow,
    display: 'flex',
    flexDirection: 'column',
  }),
  mobileDropdownMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.25rem 0.25rem',
  },
  menuItem: props => ({
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1rem', // forcing because unknown things are overriding it
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0.5rem 1rem',
    margin: '0 0.25rem',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    '&:hover': {
      background: theme.colors.encivYellow,
      color: props.mode === 'dark' || props.mode === 'transparent' || props.mode === 'dark-transparent' ? 'black' : 'white',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  mobileMenuItem: props => ({
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1rem', // forcing because unknown things are overriding it
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    margin: '0',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    '&:hover': {
      background: theme.colors.encivYellow,
      color: props.mode === 'dark' || props.mode === 'transparent' || props.mode === 'dark-transparent' ? 'black' : 'white',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  selectedItem: props => {
    if (props.mode === 'vertical') {
      return { background: theme.colors.focusRing }
    } else {
      return {
        borderBottom: '0.125rem solid' + (props.mode === 'dark' ? theme.colors.white : theme.colors.black),
      }
    }
  },
  userOrSignupContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '0.25rem 0',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },
  mobileUserOrSignupContainer: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
  },
  menuToggle: props => ({
    width: '15%',
    height: 'auto',
    fontSize: '1.5rem',
    background: (() => {
      if (props.mode === 'dark') {
        return theme.colors.darkModeGray
      } else if (props.mode === 'light') {
        return theme.colors.lightModeColor
      } else if (props.mode === 'transparent' || props.mode === 'dark-transparent' || props.mode === 'light-transparent') {
        return 'transparent'
      } else {
        return 'white'
      }
    })(),
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: props.mode === 'dark' || props.mode === 'transparent' || props.mode === 'dark-transparent' ? 'black' : 'white',
    },
  }),
  menuList: {
    listStyle: 'none',
  },
  verticalMenuContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.inputBorder,
    padding: '0.5rem 0.5rem',
    color: '#06335C',
    fontWeight: 600,
    borderRadius: '0.5rem',
  },
  verticalMenuItem: {
    padding: '1.0rem 1.0rem',
    borderRadius: '0.5rem',
    '&:hover': {
      background: theme.colors.focusRing,
    },
  },
  logoContainer: {
    display: 'inline-block',
  },
}))

export default TopNavBar
