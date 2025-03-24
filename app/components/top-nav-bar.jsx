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
        handleMouseLeave() // closes any dropdowns still open
      } else if (type === 'menuGroup') {
        handleMouseEnter(index)
      }
    }
  }

  const isVerticalMode = mode === 'vertical'

  return (
    <div className={cx(classes.topNavBar, classes.colors, className, { [classes.verticalNavBar]: isVerticalMode })} {...otherProps}>
      <div className={cx(classes.columnAligner, { [classes.verticalColumnAligner]: isVerticalMode })}>
        <div className={`${classes.navBarContainer} ${isVerticalMode ? classes.verticalNavBarContainer : ''}`}>
          {mode === 'dark' ? <SvgEncivWhite className={classes.logo} /> : <SvgEncivBlack className={classes.logo} />}

          {/* This is the computer menu */}
          <menu className={cx(classes.menuContainer, { [classes.verticalMenuContainer]: isVerticalMode })}>
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
                        <div className={cx(classes.dropdownMenu, { [classes.verticalDropdownMenu]: isVerticalMode })}>
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

          {UserOrSignInUp && (
            <div className={classes.userOrSignupContainer}>
              <UserOrSignInUp />
            </div>
          )}

          <button className={cx(classes.menuToggle, classes.colors)} onClick={toggleMenu}>
            &#8801;
          </button>
        </div>

        {/* This is the mobile menu */}
        {isExpanded ? (
          <menu className={cx(classes.mobileMenuContainer)}>
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
      if (props.mode === 'dark' || props.mode === 'transparent') {
        return 'white'
      } else if (props.mode === 'light') {
        return theme.colors.lightModeColor
      } else {
        return theme.colors.darkModeGray
      }
    })(),
  }),
  topNavBar: props => ({
    width: '100%',
    zIndex: theme.zIndexes.menu, // The navbar appears below other blocks without zIndex
    position: (() => {
      if (props.mode === 'transparent') {
        return 'absolute'
      } else {
        return ''
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
      } else if (props.mode === 'transparent') {
        return 'transparent'
      } else {
        return 'white'
      }
    })(),
  }),
  verticalNavBar: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  columnAligner: props => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: theme.maxPanelWidth,
  }),
  verticalColumnAligner: {
    alignItems: 'flex-start',
  },
  donate: {
    padding: '0 0 0 1rem',
  },
  mobileDonate: {
    padding: '0 0 0.5rem 0',
  },
  navBarContainer: {
    width: '80%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    position: 'relative',
  },
  verticalNavBarContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logo: {
    width: '8.5rem',
    height: 'auto',
    paddingBottom: '1.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '4rem',
    },
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    gap: '0.4rem',
    transform: 'translateX(-50%)',
    alignItems: 'baseline',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },
  verticalMenuContainer: {
    position: 'static',
    transform: 'none',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  mobileMenuContainer: props => ({
    padding: '1.25rem 1.25rem',
    display: 'flex',
    width: '80%',
    background: props.mode === 'dark' || props.mode === 'transparent' ? theme.colors.darkModeGray : theme.colors.encivYellow,
    flexDirection: 'column',
    justifyContent: 'left',
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
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      cursor: 'pointer',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: props.mode === 'dark' || props.mode === 'transparent' ? 'black' : 'white',
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
    background: theme.colors.encivYellow,
    display: 'flex',
    flexDirection: 'column',
  }),
  verticalDropdownMenu: {
    position: 'static',
    marginTop: '0.5rem',
  },
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
      color: props.mode === 'dark' || props.mode === 'transparent' ? 'black' : 'white',
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
      color: props.mode === 'dark' || props.mode === 'transparent' ? 'black' : 'white',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  }),
  selectedItem: props => ({
    borderBottom: '0.125rem solid' + (props.mode === 'dark' ? theme.colors.white : theme.colors.black),
  }),
  userOrSignupContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '0.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
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
      } else if (props.mode === 'transparent') {
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
      color: props.mode === 'dark' || props.mode === 'transparent' ? 'black' : 'white',
    },
  }),
  menuList: {
    listStyle: 'none',
  },
}))

export default TopNavBar
