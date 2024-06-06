'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import TopBar from './top-bar'
import Footer from './footer'
import Panel from './panel'
import ReactScrollBar from './util/react-scrollbar'
import LogupBar from './logup-bar'
import PanelHeading from './panel-heading'
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path'
import SiteFeedback from './site-feedback'
import { ThemeProvider } from 'react-jss'
import theme from '../components/theme'

class SmallLayout extends React.Component {
  render() {
    const { children, ...lessProps } = this.props
    return (
      <ReactActionStatePath {...lessProps}>
        <RASPSmallLayout children={children} />
      </ReactActionStatePath>
    )
  }
}

class RASPSmallLayout extends ReactActionStatePathClient {
  constructor(props) {
    super(props, 'key') // itemId is the key for indexing to child RASP functions
    this.createDefaults()
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const myScrollbar = {}
    const { children, ...lessProps } = this.props

    return (
      <div className="syn-small-layout">
        <div id="fb-root"></div>
        <ThemeProvider theme={theme}>
          <SiteFeedback />
          <LogupBar
            {...lessProps}
            ref={e => {
              this.topBar = e && e.getBannerNode()
            }}
          />
          <ReactScrollBar style={myScrollbar} topBar={this.topBar} extent={0}>
            <div className="should-have-a-chidren scroll-me">
              <section role="main">
                {React.Children.map(React.Children.only(children), child => {
                  var newProps = Object.assign({}, lessProps, { rasp: this.childRASP('truncated', 'default') })
                  Object.keys(child.props).forEach(prop => delete newProps[prop])
                  return React.cloneElement(child, newProps, child.props.children)
                })}
                <Footer user={this.props.user} />
              </section>
            </div>
          </ReactScrollBar>
        </ThemeProvider>
      </div>
    )
  }
}

export default SmallLayout
