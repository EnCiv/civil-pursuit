// https://github.com/EnCiv/civil-pursuit/issues/52

// https://github.com/EnCiv/civil-pursuit/issues/144

'use strict'

import React, { useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import SvgEncivBlack from '../svgr/enciv-black'
import SvgEncivWhite from '../svgr/enciv-white'

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
  return (
    <div className={cx(classes.topNavBar, classes.colors, className)} {...otherProps}>
      <div className={classes.columnAligner}>
        <div className={`${classes.navBarContainer}`}>
          {mode === 'dark' ? <SvgEncivWhite className={classes.logo} /> : <SvgEncivBlack className={classes.logo} />}

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
                      className={cx(classes.menuGroup, classes.colors, {
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
                              className={cx(classes.menuItem, classes.colors, {
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
                      className={cx(classes.menuItem, classes.colors, {
                        [classes.selectedItem]: selectedItem === item.name,
                      })}
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {item.name}
                    </div>
                  </li>
                )
              )}
          </menu>
        ) : null}
      </div>
    </div>
  )
}

// Define the styles using the theme object
const useStylesFromThemeFunction = createUseStyles(theme => ({
  colors: props => ({
    color: props.mode === 'dark' ? 'white' : theme.colors.darkModeGray,
  }),
  topNavBar: props => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
    backgroundColor: props.mode === 'dark' ? theme.colors.darkModeGray : 'white',
  }),

  columnAligner: props => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: theme.maxPanelWidth,
  }),
  navBarContainer: {
    width: '80%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    position: 'relative',
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
    transform: 'translateX(-50%)',
    zIndex: theme.zIndexes.menu,
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },
  mobileMenuContainer: props => ({
    display: 'flex',
    width: '80%',
    background: props.mode === 'dark' ? theme.colors.darkModeGray : theme.colors.encivYellow,
    flexDirection: 'column',
    justifyContent: 'center',
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
      color: props.mode === 'dark' ? 'black' : 'white',
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
    background: props.mode === 'dark' ? theme.colors.darkModeGray : 'white',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
    '&:hover': {
      background: theme.colors.encivYellow,
      color: props.mode === 'dark' ? 'black' : 'white',
    },
  }),
  menuList: {
    listStyle: 'none',
  },
}))

export default TopNavBar
