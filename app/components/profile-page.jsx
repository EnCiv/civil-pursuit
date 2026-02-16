// https://github.com/EnCiv/civil-pursuit/issues/XXX

'use strict'

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import TopNavBar from './top-nav-bar'
import DiscussionTab from './discussion-tab'

function ProfilePage(props) {
  const { className, discussions = [], ...otherProps } = props
  const [activeTab, setActiveTab] = useState('Profile')
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
    <div>
      <h1>Profile</h1>
      <p>Profile content coming soon...</p>
    </div>
  )

  const SettingsPlaceholder = () => (
    <div>
      <h1>Settings</h1>
      <p>Settings content coming soon...</p>
    </div>
  )

  const renderContent = () => {
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
  },
  sidebar: {
    width: '17rem',
  },
  navigation: {},
  content: {
    flex: 1,
    padding: '0rem 2rem',
  },
}))

export default ProfilePage
