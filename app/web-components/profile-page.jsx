// https://github.com/EnCiv/civil-pursuit/issues/385

'use strict'

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import TopNavBar from '../components/top-nav-bar'
import DiscussionTab from './discussion-tab'
import { H } from 'react-accessible-headings'

function ProfilePage(props) {
  const { className, discussions = [], initialTab = 'Profile', ...otherProps } = props
  const [activeTab, setActiveTab] = useState(initialTab)
  const classes = useStylesFromThemeFunction()

  const createMenuItem = name => {
    return {
      name: name,
      func: () => {
        setActiveTab(name)
      },
    }
  }

  const menuArray = [createMenuItem('Profile'), createMenuItem('Discussions'), createMenuItem('Settings')]

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
        <TopNavBar mode="vertical" menu={menuArray} defaultSelectedItem={activeTab} className={classes.navigation} />
      </div>
      <div className={classes.content}>{renderContent()}</div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    display: 'flex',
    padding: '2rem',
  },
  sidebar: {
    width: '17rem',
  },
  navigation: {},
  content: {
    flex: 1,
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
  },
}))

export default ProfilePage
