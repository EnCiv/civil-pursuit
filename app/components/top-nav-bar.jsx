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

const condensedWidthBreakPoint = '92rem'

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
            </menu>
            <div className={classes.donate}>
              <Donate />
            </div>
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
                  <li className={classes.menuList} key={index}>
                    <div className={cx(classes.mobileMenuGroup, { [classes.mobileMenuGroupOpen]: openDropdown === index })}>
                      <button
                        type="button"
                        className={cx(classes.mobileMenuGroupHeader, classes.colors, {
                          [classes.selectedItem]: selectedItem === item[0].name,
                        })}
                        aria-expanded={openDropdown === index}
                        onClick={() => handleMobileMenuGroupClick(item, index)}
                      >
                        {item[0].name} {'\u25BE'}
                      </button>
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
    containerType: 'inline-size',
    containerName: 'topNavBar',
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
    boxShadow: props.mode === 'dark' || props.mode === 'light' ? '0 0.375rem 1rem rgba(0, 0, 0, 0.16)' : 'none',
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
    boxSizing: 'border-box',
    flex: '0 0 auto',
    '& > a': {
      display: 'flex',
      width: '100%',
      maxWidth: '12rem',
      height: '3rem',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  mobileDonate: {
    boxSizing: 'border-box',
    width: '100%',
    marginTop: '0.75rem',
    padding: '0.75rem 0 0',
    '& > a': {
      display: 'flex',
      width: '100%',
      height: '3rem',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  navBarContainer: {
    width: 'min(90%, 90rem)',
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0.5rem',
    position: 'relative',
    [`@container topNavBar (max-width: ${condensedWidthBreakPoint})`]: {
      flexWrap: 'nowrap',
      width: '100%',
      padding: '1rem 1.5rem',
    },
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    // On desktop, logo is in left column
    [`@container topNavBar (min-width: ${condensedWidthBreakPoint})`]: {
      alignSelf: 'flex-start',
    },
  },
  logo: {
    width: '8.5rem',
    height: 'auto',
    [`@container topNavBar (max-width: ${condensedWidthBreakPoint})`]: {
      width: 'clamp(4.5rem, 7cqi, 7rem)',
    },
  },
  menuAndActionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: '1 1 auto',
    gap: '0.5rem',
    minWidth: 0,
    position: 'relative',
    alignSelf: 'flex-end',
    [`@container topNavBar (max-width: ${condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },
  menuContainer: {
    boxSizing: 'border-box',
    display: 'grid',
    flex: '1 1 auto',
    minWidth: 0,
    gridTemplateColumns: 'repeat(auto-fit, minmax(7rem, 1fr))',
    gap: '0.5rem',
    margin: 0,
    padding: '0 3rem',
    alignItems: 'center',
    width: 'auto',
  },
  mobileMenuContainer: props => ({
    boxSizing: 'border-box',
    padding: '1rem',
    display: 'flex',
    width: 'min(90%, 34rem)',
    gap: '0.375rem',
    background: '#ffda66',
    color: '#1a1a1a',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    borderRadius: '0.5rem',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.2)',
    animation: '$mobileMenuOpen 280ms ease-out',
    '& $mobileMenuGroupHeader, & $mobileMenuItem': {
      color: '#1a1a1a',
    },
    '& $selectedItem': {
      borderBottom: '0.125rem solid #1a1a1a',
    },
    [`@container topNavBar (min-width: ${condensedWidthBreakPoint})`]: {
      display: 'none',
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  }),
  menuGroup: props => ({
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '3rem',
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1.125rem',
    cursor: 'default',
    background: 'none',
    border: 'none',
    padding: '0.75rem 0.5rem',
    margin: 0,
    whiteSpace: 'nowrap',
    position: 'relative',
    borderRadius: '0.375rem',
    transition: 'background-color 400ms ease, color 400ms ease',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    [`@container topNavBar (max-width: ${condensedWidthBreakPoint})`]: {
      cursor: 'pointer',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: '#1a1a1a',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  mobileMenuGroupHeader: props => ({
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '3rem',
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1.125rem',
    cursor: 'pointer',
    color: '#1a1a1a',
    background: 'rgba(255, 255, 255, 0.42)',
    border: 'none',
    padding: '0.75rem 0.5rem',
    margin: 0,
    whiteSpace: 'nowrap',
    borderRadius: '0.375rem',
    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.12)',
    transition: 'background-color 400ms ease, color 400ms ease',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: '#1a1a1a',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  mobileMenuGroup: props => ({
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '0.25rem',
  }),
  mobileMenuGroupOpen: {
    gap: 0,
    background: '#ffe8a6',
    borderRadius: '0.375rem',
    boxShadow: '0 0.25rem 0 rgba(26, 26, 26, 0.24), 0 0.75rem 1.25rem rgba(0, 0, 0, 0.28)',
    overflow: 'hidden',
    '& $mobileMenuGroupHeader': {
      background: '#ffda66',
      borderRadius: '0.375rem 0.375rem 0 0',
      boxShadow: 'none',
    },
    '& $mobileDropdownMenu': {
      borderRadius: '0 0 0.375rem 0.375rem',
      boxShadow: 'none',
    },
  },
  dropdownMenu: props => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    background: '#ffda66',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    minWidth: '100%',
    padding: '0.375rem',
    boxSizing: 'border-box',
    borderRadius: '0 0 0.375rem 0.375rem',
    boxShadow: '0 0.25rem 0 rgba(26, 26, 26, 0.28), 0 0.75rem 1.25rem rgba(0, 0, 0, 0.3), inset 0 0.0625rem 0 rgba(255, 255, 255, 0.35)',
    animation: '$dropdownOpen 280ms ease-out',
    '& $menuItem': {
      boxSizing: 'border-box',
      width: '100%',
      margin: 0,
      color: '#1a1a1a',
      background: 'transparent',
      boxShadow: 'none',
      whiteSpace: 'normal',
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.1)',
        color: '#1a1a1a',
      },
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  }),
  mobileDropdownMenu: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 0,
    padding: '0 0 0.25rem',
    background: '#ffe8a6',
    borderRadius: 0,
    boxShadow: 'none',
    overflow: 'hidden',
    animation: '$dropdownOpen 280ms ease-out',
    '& $mobileMenuItem': {
      boxSizing: 'border-box',
      width: '100%',
      margin: 0,
      padding: '0.75rem 0',
      color: '#1a1a1a',
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 0,
      boxShadow: 'none',
      borderBottom: '1px solid rgba(26, 26, 26, 0.16)',
      '&:last-child': {
        borderBottom: 'none',
      },
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.1)',
        color: '#1a1a1a',
      },
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
  '@keyframes dropdownOpen': {
    from: { opacity: 0, transform: 'translateY(-0.5rem)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes mobileMenuOpen': {
    from: { opacity: 0, transform: 'translateY(-0.5rem)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  menuItem: props => ({
    boxSizing: 'border-box',
    width: '100%',
    height: '3rem',
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1.125rem', // forcing because unknown things are overriding it
    cursor: 'pointer',
    appearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0.75rem 0.5rem',
    margin: 0,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    borderRadius: '0.375rem',
    boxShadow: 'none',
    transition: 'background-color 400ms ease, color 400ms ease',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: '#1a1a1a',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  mobileMenuItem: props => ({
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '3rem',
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1.125rem', // forcing because unknown things are overriding it
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0.75rem 1rem',
    margin: 0,
    whiteSpace: 'normal',
    textAlign: 'center',
    color: '#1a1a1a',
    background: 'rgba(255, 255, 255, 0.42)',
    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.12)',
    borderRadius: '0.375rem',
    transition: 'background-color 400ms ease, color 400ms ease',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: '#1a1a1a',
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
    [`@container topNavBar (max-width: ${condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },
  mobileUserOrSignupContainer: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
  },
  menuToggle: props => ({
    boxSizing: 'border-box',
    flexShrink: 0,
    width: 'clamp(4rem, 6cqi, 6rem)',
    height: 'clamp(3.5rem, 6cqi, 5rem)',
    padding: '0.25rem',
    fontSize: 'clamp(2rem, 3.5cqi, 3rem)',
    background: (() => {
      if (props.mode === 'dark') {
        return 'rgba(255, 255, 255, 0.12)'
      } else if (props.mode === 'light') {
        return 'rgba(0, 0, 0, 0.06)'
      } else if (props.mode === 'transparent' || props.mode === 'dark-transparent' || props.mode === 'light-transparent') {
        return props.mode === 'light-transparent' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.12)'
      } else {
        return 'rgba(0, 0, 0, 0.06)'
      }
    })(),
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [`@container topNavBar (min-width: ${condensedWidthBreakPoint})`]: {
      display: 'none',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: '#1a1a1a',
    },
    borderRadius: '0.375rem',
    boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)',
    transition: 'background-color 400ms ease, color 400ms ease, box-shadow 400ms ease',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  menuList: {
    listStyle: 'none',
    width: '100%',
  },
  verticalMenuContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f4f48d',
    padding: '0.5rem 1.0rem',
    color: '#06335C',
    fontWeight: 600,
    borderRadius: '0.5rem',
    gap: '0.4rem',
  },
  verticalMenuItem: {
    padding: '0.8rem 1.0rem',
    borderRadius: '0.5rem',
    '&:hover': {
      background: 'rgba(235, 234, 234, 0.61)',
    },
  },
  logoContainer: {
    display: 'inline-block',
  },
}))

export default TopNavBar
