// https://github.com/EnCiv/civil-pursuit/issues/385
// https://github.com/EnCiv/civil-pursuit/issues/388

'use strict'

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import TopNavBar from '../components/top-nav-bar'
import theme from '../components/theme'
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
        <TopNavBar
          mode="vertical"
          menu={menuArray}
          defaultSelectedItem={activeTab}
          mobileHorizontal
          mobileBreakpoint={theme.profileMobileBreakPoint}
          aria-label="Profile sections"
        />
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
