import React from 'react'
import { hot } from 'react-hot-loader'
import WebComponents from '../web-components'
import Footer from './footer'
import { ErrorBoundary } from 'civil-client'
import { ThemeProvider, createUseStyles } from 'react-jss'
import { Helmet } from 'react-helmet'
import theme from './theme'
import TopNavBar from './top-nav-bar'
import GlobalStyles from './global-styles'

class App extends React.Component {
  render() {
    if (this.props.iota) {
      var { iota, ...newProps } = this.props
      Object.assign(newProps, this.props.iota)
      return (
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <div style={{ position: 'relative' }}>
              <Helmet>
                <title>{iota?.subject || 'EnCiv'}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />
                {/* Adding this script, though not using it, as experiment to convince google ads that the tag is here */}
                <script>
                  {`
                  if(window.gtag && ${!!process.env.GOOGLE_ADS}) gtag('config', "${process.env.GOOGLE_ADS}")
                  // Helper function to delay opening a URL until a gtag event is sent.
                  // Call it in response to an action that should navigate to a URL.
                  function gtagSendEvent(url) {
                    var callback = function () {
                      if (typeof url === 'string') {
                        window.location = url;
                      }
                    };
                    gtag('event', 'conversion_event_submit_lead_form', {
                      'event_callback': callback,
                      'event_timeout': 2000,
                      // <event_parameters>
                    });
                    return false;
                  }`}
                </script>
              </Helmet>
              <GlobalStyles />
              <TopNavWrap {...this.props} />
              <WebComponents key="web-component" webComponent={this.props.iota.webComponent} {...newProps} />
              <Footer mode="dark" key="footer" />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      )
    } else
      return (
        <ErrorBoundary>
          <div style={{ position: 'relative' }}>
            <div>Nothing Here</div>
            <Footer />
          </div>
        </ErrorBoundary>
      )
  }
}

function TopNavWrap(props) {
  const menu = [
    {
      name: 'Home',
      func: () => {
        window.location.href = '/'
      },
    },
    [
      {
        name: 'About',
        func: () => {}, // this will get called in mobile mode when user clicks to expand the about selection - don't do anything
      },
      {
        name: 'Our Mission',
        func: () => {
          window.location.href = '/about'
        },
      },
      {
        name: 'IRS Forms',
        func: () => {
          window.location.href = '/irs-forms'
        },
      },
    ],
    {
      name: 'Our Tools',
      func: () => (window.location.href = '/our-tools'),
    },
    {
      name: 'Articles',
      func: () => {
        window.location.href = '/articles'
      },
    },
  ]
  if (props?.user?.id) menu.push({ name: 'Logout', func: () => (window.location.href = '/sign/out') })
  return <TopNavBar mode={'dark'} menu={menu} />
}

export default hot(module)(App)
