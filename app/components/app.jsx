'use strict'

import React from 'react'
import Layout from './layout'
import Profile from './prof'
import Home from './home'
import ResetPassword from './reset-password'
import Panel from './panel'
import Icon from './util/icon'
import About from './about'
import TypeComponent from './type-component'
import OnlineDeliberationGame from './odg'
import ODGCongrat from './odg-congrat'
import RenderMarkDown from './render-mark-down'
import SmallLayout from './small-layout'
import StaticLayout from './static-layout'
import MechanicalTurkTask from '../lib/mechanical-turk-task'
import apiWrapper from '../lib/util/api-wrapper'
import { hot } from 'react-hot-loader'

class App extends React.Component {
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      this.htmlE = document.getElementsByTagName('html')[0]
      this.htmlE.style.width = window.innerWidth + 'px' // auto margin wont work on html unless width is set
      this.htmlE.style.margin = 'auto' // auto center the window with html.  Doing this in html so the react-scroll can scroll the html top - so that elements that move and scroll of the bottom wont change the scroll position - which is what chrome does
      if (navigator.userAgent.match(/SM-N950U/)) {
        // to account for the wrapped sides of the display
        let b = document.getElementsByTagName('body')[0]
        if (b) {
          b.style.paddingRight = '9px'
          b.style.paddingLeft = '9px'
        } else {
          logger.error("App: couldn't get body on N950U")
        }
      }
    }
    MechanicalTurkTask.setFromProps(props)
    this.flushed = false
    apiWrapper.Flush(this.props.user, this.updateAfterFlush.bind(this)) // if any api data was saved previously, flush it to the server
  }

  componentWillReceiveProps(newProps) {
    apiWrapper.Flush(newProps.user, this.updateAfterFlush.bind(this)) // if any api data was saved previously, flush it to the server
  }

  componentDidMount() {
    // Attach The Event for Responsive View~
    window.addEventListener('resize', () => (this.htmlE.style.width = window.innerWidth + 'px'), { passive: false })
  }

  componentDidCatch(error, info) {
    logger.error('App.componentDidCatch:', error, info)
  }

  updateAfterFlush() {
    this.flushed = true
    if (this.rendered) this.forceUpdate()
  }

  setPath(p) {
    if (typeof window !== 'undefined') reactSetPath(p)
  }

  render() {
    const { panels, user, path } = this.props

    const { notFound, error, browserConfig, MechanicalTurkTask, ...lessProps } = this.props
    this.rendered = true // if we've rendered at least once, then apiWrapper.flush will have to force an update when it completes

    let page = (
      <Panel heading={<h4>Not found</h4>} id="not-found">
        <section style={{ padding: 10 }}>
          <h4>Page not found</h4>
          <p>Sorry, this page was not found.</p>
        </section>
      </Panel>
    )

    if (notFound || error) {
      // just render page at the end
    } else if (error && Object.keys(error).length) {
      // falsy an empty obect is not an error
      page = (
        <Panel
          heading={
            <h4>
              <Icon icon="bug" /> Error
            </h4>
          }
        >
          <section style={{ padding: 10 }}>
            <h4 style={{ color: 'red', textAlign: 'center' }}>The system glitched :(</h4>
            <p style={{ textAlign: 'center' }}>We have encountered an error. We apologize for any inconvenience.</p>
          </section>
        </Panel>
      )
      //} else if (!this.flushed) {
      //page = (<div style={{ textAlign: "center" }}>Updating...</div>);
    } else {
      if (path === '/') {
        page = <Home user={user} />
      }

      const paths = path.split(/\//)

      paths.shift()

      switch (paths[0]) {
        case 'page':
          switch (paths[1]) {
            case 'profile':
              page = <Profile />
              break

            case 'terms-of-service':
            case 'privacy-policy':
              page = <RenderMarkDown name={paths[1]} />
              break

            case 'about':
              page = <About />
              break

            case 'reset-password':
              let return_to = ''
              for (let i = 3; i < paths.length; i++) return_to += '/' + paths[i]
              return (
                <StaticLayout {...lessProps}>
                  <ResetPassword activation_token={paths[2]} return_to={return_to} />
                </StaticLayout>
              )
              break
          }
          break

        case 'h':
          page = <Home user={user} RASPRoot={'/h/'} />
          break

        case 'about':
          page = <About />
          break

        case 'odg':
          if (user) {
            page = <ODGCongrat {...lessProps} />
            break
          }

          if (!panels) return <OnlineDeliberationGame />
          const keylist3 = Object.keys(panels)

          const panelId3 = keylist3[keylist3.length - 1]

          const panel3 = Object.assign({}, panels[panelId3].panel)

          const component3 = panel3.type.component || 'Subtype'

          return <OnlineDeliberationGame component={component3} {...lessProps} count={1} panel={panel3} />

        case 'item':
          if (!panels) {
            break
          }

          const keylist = Object.keys(panels)

          const panelId1 = keylist[keylist.length - 1]

          const panel = Object.assign({}, panels[panelId1].panel)

          //panel.items = panel.items.filter(item => item.id === paths[1]);

          //console.info("app item panel filtered", panel );

          const component = panel.type.component || 'Subtype'

          return (
            <Layout {...lessProps} RASPRoot={'/item/'} setPath={this.setPath.bind(this)}>
              <TypeComponent component={component} count={1} panel={panel} />
            </Layout>
          )

        case 'i':
          if (!panels) break
          else {
            function getLastPanel(panels) {
              let keylist = Object.keys(panels)
              let lastPanelId = keylist[keylist.length - 1]
              const panel = Object.assign({}, panels[lastPanelId].panel)
              return panel
            }

            let last = getLastPanel(panels)
            let component = last.type.component || 'Subtype'
            if (typeof document !== 'undefined' && last.items && last.items[0] && last.items[0].subject)
              document.title = last.items[0].subject
            return (
              <SmallLayout {...lessProps} RASPRoot={'/i/'} setPath={this.setPath.bind(this)}>
                <TypeComponent component={component} count={1} panel={last} />
              </SmallLayout>
            )
          }

        case 'items':
          if (!panels) {
            break
          }

          const panelId2 = Object.keys(panels)[0]

          //onsole.info("App.render items", { panelId2 });

          const panel2 = Object.assign({}, panels[panelId2].panel)

          //panel.items = panel.items.filter(item => item.id === paths[1]);

          //console.info("app item panel filtered", panel );

          const component2 = panel2.type.component || 'Subtype'
          //onsole.info("App.render panel2", { panel2 });

          return (
            <Layout {...lessProps} setPath={this.setPath.bind(this)}>
              <TypeComponent component={component2} count={1} panel={panel2} />
            </Layout>
          )
      }
    }

    return (
      <Layout {...lessProps} setPath={this.setPath.bind(this)}>
        {page}
      </Layout>
    )
  }
}

export default hot(module)(App)
