'use strict'

import React from 'react'
import Panel from '../panel'
import config from '../../../public.json'
import TypeComponent from '../type-component'
import Instruction from '../instruction'
import ProfileComponent from '../prof-components/component'
import Row from '../util/row'
import Column from '../util/column'
import DoneItem from '../done-item'
import LoginSpan from '../login-span'
import setUserInfo from '../../api-wrapper/set-user-info'
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path'
import PanelHeading from '../panel-heading'

class ProfilePanel extends React.Component {
  render() {
    return (
      <ReactActionStatePath {...this.props}>
        <PanelHeading
          items={[]}
          type={(this.props.panel && this.props.panel.type) || this.props.type}
          cssName={'syn-panel-profile'}
          panelButtons={['Instruction']}
        >
          <RASPProfilePanel />
        </PanelHeading>
      </ReactActionStatePath>
    )
  }
}

class RASPProfilePanel extends ReactActionStatePathClient {
  state = {
    typeList: [],
    userInfoReady: false,
    userInfo: {},
    userId: '',
  }

  constructor(props) {
    super(props, 'redirect')

    if (typeof window !== 'undefined' && this.props.user) {
      window.socket.emit('get user info', this.okGetUserInfo.bind(this))
    }
    if (typeof window !== 'undefined' && this.props.panel.type.harmony)
      window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this))

    this.state.userId = this.props.user ? this.props.user._id || this.props.user : ''
    this.processProps(props)
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.user) return this.processProps(newProps)
    var userId
    if (newProps.user._id) userId = newProps.user._id
    else userId = newProps.user
    if (this.state.userId != userId) this.setState({ userId: userId })
    this.processProps(newProps)
  }

  componentDidUpdate() {
    this.processProps(this.props) // check again after state updates
  }

  setUserInfo(info) {
    this.setState({ userInfo: Object.assign({}, this.state.userInfo, info) })
    setUserInfo.call(this, info)
  }

  okGetUserInfo(userInfo) {
    this.setState({ userInfoReady: true, userInfo: Object.assign({}, userInfo, this.state.userInfo) })
  }

  okGetListoType(typeList) {
    this.setState({ typeList: typeList })
  }

  neededInputAtStart = false

  processProps(props) {
    const { newLocation, rasp, panel, user } = props
    const { userId, userInfoReady, userInfo, typeList } = this.state
    this.profiles = ['Gender', 'Birthdate.Birthdate..dob', 'Neighborhood', 'MemberType']
    if (panel.parent && panel.parent.profiles && panel.parent.profiles.length) this.profiles = panel.parent.profiles
    this.properties = ProfileComponent.properties(this.profiles)

    if ((user && userInfoReady) || this.neededInputAtStart) {
      // if there is a users and the user info in ready or if input was needed
      if (this.properties.every(prop => userInfo[prop])) {
        // have all the property values been filled out??
        if (!this.neededInputAtStart || rasp.done) {
          // if the required data is initally there, then move forward, otherwise move forward when the user to hits done
          if (userId && newLocation) {
            window.onbeforeunload = null // don't warn on redirect
            location.href = newLocation
          }
          if (userId && panel.parent && panel.parent.new_location) {
            window.onbeforeunload = null // don't warn on redirect
            location.href = panel.parent.new_location
          }
          if (!typeList.length)
            return // if we haven't received typeList yet, come back later - there will be another event when it comes in
          else return rasp.toParent({ type: 'REDIRECT' })
        }
      } else this.neededInputAtStart = true
    } else {
      if (!user) this.neededInputAtStart = true
    }
  }

  /*isReady(){
        const {rasp, user}=this.props;
        const {typeList, userInfoReady, userInfo, userId}=this.state;
        if ((user && userInfoReady) || this.neededInputAtStart) // if there is a users and the user info in ready or if input is going to be needed
        {
            if (this.properties.every(prop => userInfo[prop])) { // have all the property values been filled out?? 
                if (!this.neededInputAtStart || rasp.done) { // if the required data is initally there, then move forward, otherwise move forward when the user to hits done
                    if (!typeList.length) return false;  // if we haven't received typeList yet, come back later - there will be another event when it comes in
                    return true;
                } else { // if all the data is there
                    return true;
                }
            }
        } else if (user) // there is user data to wait for
            return false; // wait for it
        if(userInfoReady || !userId)
            return true;
        return false;
    }*/

  actionFilters = {
    DONE: (action, delta) => {
      delta.done = true
      return true //  to propagate
    },
    REDIRECT: (action, delta) => {
      delta.redirect = 'redirect'
      action.distance -= 1 // make this invisible
      return true // to propagate
    },
  }

  segmentToState(action, initialRASP) {
    var nextRASP = {}
    var parts = action.segment.split(',')
    parts.forEach(part => {
      if (part === 'r') nextRASP.redirect = 'redirect'
      else console.error('PanelItems.segmentToState unexpected part:', part)
    })
    this.deriveRASP(nextRASP, initialRASP)
    if (nextRASP.pathSegment !== action.segment)
      console.error(
        'profile-panel.segmentToAction calculated path did not match',
        action.pathSegment,
        nextRASP.pathSegment
      )
    return { nextRASP, setBeforeWait: true } // set nextRASP as state before waiting for child
  }

  deriveRASP(nextRASP, initialRASP) {
    if (nextRASP.redirect) nextRASP.shape = 'redirect'
    if (nextRASP.redirect) nextRASP.pathSegment = 'r'
  }

  render() {
    const { panel, rasp } = this.props
    const { userId, userInfo, userInfoReady } = this.state

    if (rasp.redirect) {
      if (!Object.keys(userInfo).length || !this.state.typeList.length) {
        // if coming here from a direct path and redirect is already set, we will have to wait for this stuff
        return null // don't render anything
      } else {
        const index = userId ? 1 : 0 // if user defined skip the first entry which is usually LoginPanel
        const newPanel = {
          parent: panel.parent,
          type: this.state.typeList[index],
          skip: panel.skip || 0,
          limit: panel.limit || config['navigator batch size'],
        }
        return (
          <TypeComponent
            {...this.props}
            rasp={this.childRASP('open', 'redirect')}
            userInfo={userInfo}
            component={this.state.typeList[index].component}
            panel={newPanel}
            {...newPanel}
          />
        )
      }
    }

    if (!this.neededInputAtStart) return null

    var incomplete = 0
    this.properties.forEach(prop => !userInfo[prop] && incomplete++)
    const constraints = incomplete
      ? incomplete > 1
        ? [`there are ${incomplete} items remaining`]
        : [`there is one item remaining`]
      : []

    return (
      <div>
        <div
          className="item-profile-panel"
          style={{ maxWidth: '30em', margin: 'auto', padding: '1em 0' }}
          key="content"
        >
          <LoginSpan />
          {this.profiles.map(component => {
            var title = ProfileComponent.title(component)
            return (
              <SelectorRow name={title} key={title}>
                <ProfileComponent
                  block
                  medium
                  component={component}
                  info={userInfo}
                  onChange={this.setUserInfo.bind(this)}
                />
              </SelectorRow>
            )
          })}
        </div>
        <DoneItem
          message="Complete!"
          active={!constraints.length}
          constraints={constraints}
          onClick={() => this.props.rasp.toParent({ type: 'DONE' })}
          key="done"
        />
      </div>
    )
  }
}

class SelectorRow extends React.Component {
  render() {
    return (
      <div className="item-profile-panel" style={{ maxWidth: '30em', margin: 'auto', padding: '1em 0' }}>
        <Row baseline style={{ padding: '1em 0' }}>
          <Column span="25">{this.props.name}</Column>
          <Column span="75">{this.props.children}</Column>
        </Row>
      </div>
    )
  }
}

export default ProfilePanel
