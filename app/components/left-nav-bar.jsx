'use strict'

import React, { useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

const LeftNavBar = ({ menu }) => {
  const classes = useStyles()
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleMenuItemClick = item => {
    item.func && item.func()
  }

  const handleDropdownToggle = index => {
    setOpenDropdown(openDropdown === index ? null : index)
  }

  return (
    <div className={classes.leftNavBar}>
      <ul className={classes.menuContainer}>
        {menu &&
          menu.map((item, index) => (
            Array.isArray(item) ? (
              <li
                key={index}
                className={cx(classes.menuItem, {
                  [classes.selectedItem]: openDropdown === index,
                })}
              >
                <div
                  className={classes.dropdownToggle}
                  onClick={() => handleDropdownToggle(index)}
                >
                  {item[0].name} {'\u25BE'}
                </div>
                {openDropdown === index && (
                  <ul className={classes.dropdownMenu}>
                    {item.slice(1).map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className={classes.dropdownMenuItem}
                        onClick={() => handleMenuItemClick(subItem)}
                      >
                        {subItem.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li
                key={index}
                className={cx(classes.menuItem, {
                  [classes.selectedItem]: item.selected,
                })}
                onClick={() => handleMenuItemClick(item)}
              >
                {item.name}
              </li>
            )
          ))}
      </ul>
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  leftNavBar: {
    width: '15%',
    background: '#f9f9f9', // Slightly grey background
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px', // Rounded edges for the component
  },
  menuContainer: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  menuItem: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    color: '#1a237e', // Dark blue text
    transition: 'background 0.3s, color 0.3s, border-radius 0.3s',
    borderRadius: '5px', // Rounded edges for each menu item
    '&:hover': {
      background: '#e3f2fd', // Light faded blue hover background
      color: '#1a237e', // Keep text dark blue
      borderRadius: '10px', // More rounded edges on hover
    },
    '&:focus': {
      outline: `2px solid #90caf9`,
    },
  },
  selectedItem: {
    background: '#e3f2fd', // Light faded blue
    color: '#1a237e', // Dark blue text
    borderRadius: '10px', // Rounded edges for selected items
  },
  dropdownToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  dropdownMenu: {
    listStyle: 'none',
    padding: '0.5rem',
    margin: 0,
    background: '#f9f9f9',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  dropdownMenuItem: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    color: '#1a237e',
    transition: 'background 0.3s, color 0.3s',
    '&:hover': {
      background: '#e3f2fd',
      color: '#1a237e',
    },
  },
}))

export default LeftNavBar
