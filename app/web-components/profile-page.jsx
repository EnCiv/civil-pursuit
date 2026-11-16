// https://github.com/EnCiv/civil-pursuit/issues/385
// https://github.com/EnCiv/civil-pursuit/issues/388

'use strict'

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import DiscussionTab from './discussion-tab'
import { H } from 'react-accessible-headings'

function ProfilePage(props) {
  const { className, discussions = [], initialTab = 'Discussions', ...otherProps } = props
  const [activeTab, setActiveTab] = useState(initialTab)
  const classes = useStylesFromThemeFunction()

  const createMenuItem = (name, disabled = false) => {
    return {
      name: name,
      disabled,
      func: disabled ? undefined : () => setActiveTab(name),
    }
  }

  const menuArray = [createMenuItem('Profile', true), createMenuItem('Discussions'), createMenuItem('Settings', true)]

  const ProfilePlaceholder = () => (
    <>
      <H>Profile</H>
      <p>Profile content coming soon...</p>
    </>
  )

  const SettingsPlaceholder = () => (
    <>
      <H>Settings</H>
      <p>Settings content coming soon...</p>
    </>
  )

  const renderContent = () => {
    return (
      <div className={classes.tabContent}>
        {(() => {
          switch (activeTab) {
            case 'Profile':
              return <ProfilePlaceholder />
            case 'Discussions':
              return <DiscussionTab discussions={discussions} />
            case 'Settings':
              return <SettingsPlaceholder />
            default:
              return <ProfilePlaceholder />
          }
        })()}
      </div>
    )
  }

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <div className={classes.sidebar}>
        <nav className={classes.navigation} aria-label="Profile sections">
          {menuArray.filter(Boolean).map(item => (
            <button
              key={item.name}
              type="button"
              disabled={item.disabled}
              className={cx(classes.navigationItem, {
                [classes.navigationItemSelected]: activeTab === item.name,
                [classes.navigationItemDisabled]: item.disabled,
              })}
              aria-current={activeTab === item.name ? 'page' : undefined}
              onClick={item.func}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
      <div className={classes.content}>{renderContent()}</div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    display: 'flex',
    padding: '2rem',
    [`@media (max-width: ${theme.profileMobileBreakPoint})`]: {
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
    },
  },
  sidebar: {
    flex: '0 0 17rem',
    position: 'sticky',
    top: 0,
    alignSelf: 'flex-start',
    zIndex: theme.zIndexes.menu,
    height: 'fit-content',
    backgroundColor: theme.colors.white,
    [`@media (max-width: ${theme.profileMobileBreakPoint})`]: {
      flex: '0 0 auto',
      width: '100%',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    [`@media (max-width: ${theme.profileMobileBreakPoint})`]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '0.5rem',
      borderBottom: `0.0625rem solid ${theme.colors.borderGray}`,
    },
  },
  navigationItem: {
    padding: '0.75rem 1rem',
    border: 0,
    borderLeft: '0.2rem solid transparent',
    background: 'transparent',
    color: theme.colors.textPrimary,
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.lightGray,
    },
    '&:focus-visible': {
      outline: theme.focusOutline,
    },
  },
  navigationItemSelected: {
    backgroundColor: theme.colors.tabSelected,
    fontWeight: 600,
    [`@media (max-width: ${theme.profileMobileBreakPoint})`]: {
      borderLeft: 0,
      borderBottom: `0.2rem solid ${theme.colors.primaryButtonBlue}`,
    },
  },
  navigationItemDisabled: {
    color: theme.colors.inactiveGray,
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  tabContent: {
    padding: '2rem 4rem',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',

    '& h1, & .react-accessible-headings__heading': {
      fontSize: '2.5rem',
      fontWeight: 300,
      margin: 0,
      marginBottom: '2rem',
    },
    [`@media (max-width: ${theme.profileMobileBreakPoint})`]: {
      padding: '1.5rem 1rem',
    },
  },
}))

export default ProfilePage
