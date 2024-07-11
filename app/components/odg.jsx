'use strict'

import React from 'react'
import Icon from './util/icon'
import smoothScroll from '../lib/app/smooth-scroll'
import CloudinaryImage from './util/cloudinary-image'
import ClassNames from 'classnames'
import Footer from './footer'
import TypeComponent from './type-component'
import Accordion from 'react-proactive-accordion'
import { ThemeProvider } from 'react-jss'
import theme from '../components/theme'

class CivilPursuitLogo extends React.Component {
  render() {
    return (
      <section className={'civil-pursuit-logo-image'}>
        <CloudinaryImage id="Synaccord_logo_64x61_znpxlc.png" transparent />
        <p>
          Civil Pursuit<sub>TM</sub>
        </p>
      </section>
    )
  }
}

class Boxes extends React.Component {
  // if viewport is wider than tall (desktop), lay children out horizontally
  // otherwise lay them out vertically (smartphone)
  renderChildren(width, horizontal) {
    return React.Children.map(this.props.children, child => {
      return (
        <div
          style={{ width: width + '%', display: horizontal ? 'inline-block' : 'block' }}
          className={ClassNames(this.props.className, { childhorizontal: horizontal }, { childvertical: !horizontal })}
        >
          {child}
        </div>
      )
    })
  }
  render() {
    const { className } = this.props
    let count = this.props.children.length
    let w = 1920 // if this is running on the server, pick something
    let h = 1080
    if (typeof document !== 'undefined') {
      w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    }
    var horizontal = w > h
    var widePercent = horizontal ? 100 / count : 100
    return (
      <section className={ClassNames(className, { horizontal: horizontal }, { vertical: !horizontal })}>
        {this.renderChildren(widePercent, horizontal)}
      </section>
    )
  }
}

class Stack extends React.Component {
  // if viewport is wider than tall (desktop), lay children out vertically
  // otherwise lay them out horizontally (smartphone)
  renderChildren(horizontal) {
    return React.Children.map(this.props.children, child => {
      return (
        <div
          style={{ display: horizontal ? 'table-cell' : 'inline-block' }}
          className={ClassNames(this.props.className, { childhorizontal: horizontal }, { childvertical: !horizontal })}
        >
          {child}
        </div>
      )
    })
  }
  render() {
    let w = 1920 // if this is running on the server, pick something
    let h = 1080
    if (typeof document !== 'undefined') {
      w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    }
    var horizontal = !(w > h)
    const { className } = this.props
    return (
      <section
        style={{ display: horizontal ? 'table' : 'block' }}
        className={ClassNames(className, { horizontal: horizontal }, { vertical: !horizontal })}
      >
        {this.renderChildren(horizontal)}
      </section>
    )
  }
}

class CDNImg extends React.Component {
  state = { width: 0 }

  componentDidMount() {
    let width = this.refs.image.clientWidth
    if (width > 0) this.setState({ width: width })
  }

  static getURLbyWidthHeight(src, widthf, heightf) {
    //src url, height with fraction
    var height = Math.ceil(heightf)
    var width = Math.ceil(widthf)
    var parts = src.split('/')
    switch (parts.length) {
      case 8: // transforms not encoded eg http://res.cloudinary.com/hrltiizbo/image/upload/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png
        parts.splice(6, 0, 'c_thumb,h_' + height + ',w_' + width) // width is same as hight
        if (parts[0] === 'http:') parts[0] = 'https:'
        break
      case 9: // transfroms present eg http://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_1600/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png
        parts[6] = parts[6] + 'c_thumb,h_' + height + ',w_' + width // just paste it on the end of whats there - it will override anything previous
        if (parts[0] === 'http:') parts[0] = 'https:'
        break
      default:
        console.error('CloudinaryImage', src, 'expected 8 or 9 parts got:', parts.length)
        return src
    }
    return parts.join('/')
  }

  render() {
    let parts = this.props.src.split('/')
    let src = null
    let width = this.state.width
    if (this.refs.image && this.refs.image.clientWidth && this.refs.image.clientWidth > width)
      width = this.refs.image.clientWidth
    if (width) {
      switch (parts.length) {
        case 8: // transforms not encoded eg http://res.cloudinary.com/hrltiizbo/image/upload/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png
          parts.splice(6, 0, 'c_scale,w_' + width)
          if (parts[0] === 'http:') parts[0] = 'https:'
          src = parts.join('/')
          break
        case 9: // transfroms present eg http://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_1600/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png
          parts[6] = parts[6] + ',c_scale,w_' + width // just paste it on the end of whats there - it will override anything previous
          if (parts[0] === 'http:') parts[0] = 'https:'
          src = parts.join('/')
          break
        default:
          console.error('CloudinaryImage', this.props.src, 'expected 8 or 9 parts got:', parts.length)
          src = this.props.src
          break
      }
    }
    return (
      <div ref="image">
        <img className={this.props.className} style={this.props.style} src={src} />
      </div>
    )
  }
}

class CircleImg extends React.Component {
  state = { width: 0, height: 0 }

  constructor(props) {
    super(props)
    if (typeof CircleImg.id === 'undefined') CircleImg.id = 0
    this.imageId = 'CircleImg-' + CircleImg.id++
  }

  componentDidMount() {
    if (!this.props.parent) return
    let rect = this.props.parent.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) this.setState({ width: rect.width, height: rect.height })
  }

  componentDidUpdate() {
    if (!this.props.parent) return
    let rect = this.props.parent.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0 && rect.width != this.state.width && rect.height != this.state.height)
      this.setState({ width: rect.width, height: rect.height }) // prevent loop on state change
  }

  render() {
    var content = []
    var { width, height } = this.state
    var imageHeight = (height * this.props.r * 2) / 100
    var imageWidth = (height * this.props.r * 2) / 100
    var centerX = (this.props.cx * width) / 100
    var centerY = (this.props.cy * width) / 100
    var radius = (height * this.props.r) / 100
    var imageX = centerX - radius
    var imageY = centerY - radius

    if (width && height) {
      var src = CDNImg.getURLbyWidthHeight(this.props.src, imageWidth, imageHeight)
      content = [
        <svg
          width={width}
          height={height}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <pattern
              id={this.imageId}
              x={imageX}
              y={imageY}
              patternUnits="userSpaceOnUse"
              height={imageHeight}
              width={imageWidth}
            >
              <image x={0} y={0} height={imageHeight} width={imageWidth} xlinkHref={src} href={src}></image>
            </pattern>
          </defs>
          <circle cx={centerX} cy={centerY} r={radius} fill={'url(#' + this.imageId + ')'} />
        </svg>,
      ]
    }
    return (
      <div ref="image" style={{ position: 'absolute' }}>
        {content}
      </div>
    )
  }
}

class OnlineDeliberationGame extends React.Component {
  state = { vs: { state: 'truncated', depth: 0 } }

  constructor(props) {
    super(props)
    this.state.vs.toParent = this.toMeFromChild.bind(this)
  }

  resize = null

  componentDidMount() {
    this.resize = this.resizeListener.bind(this)
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  resizeListener() {
    //onsole.info("OnlineDeliberationGame.resizeListener");
    this.forceUpdate()
  }

  smooth(tag, e) {
    e.preventDefault()
    let link = document.getElementsByName(tag)
    smoothScroll(link[0].offsetTop, 500)
    //document.body.animate({scrollTop: link[0].offsetTop}, 500);
  }

  toChild = null

  toMeFromChild(vs) {
    //onsole.info("ODG.toMeFromChild", vs);
    if (vs.state) this.setState({ vs: Object.assign({}, this.state.vs, { state: vs.state }) })
    if (vs.toChild) this.toChild = vs.toChild
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    var page

    page = (
      <section>
        <ThemeProvider theme={theme}>
          <section className="odg-intro">
            <Accordion active={this.state.vs.state == 'truncated'}>
              <Boxes className="odg-main-box">
                <div className="odg-main-box-text">
                  <CivilPursuitLogo />
                  <div className="odg-main-box-tag-line">Bridge the Political Divide</div>
                  <div className="odg-main-box-description">
                    A muiliplayer deliberation game where diverse teams of conservatives and liberals from across the
                    country take on polarized issues to find solutions to what divides us.
                  </div>
                </div>
                <div className="odg-main-box-image" ref="main">
                  <CircleImg
                    cx={49}
                    cy={47}
                    r={22}
                    src="https://res.cloudinary.com/hrltiizbo/image/upload/v1456513725/capitol_crowd_wrong_way_andwo1.jpg"
                    parent={this.refs.main}
                  />
                  <CDNImg src="https://res.cloudinary.com/hrltiizbo/image/upload/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png" />
                </div>
              </Boxes>
              <div className="odg-intro-tag-line">Find the Solutions to What Divides Us</div>
              <Boxes className="odg-icon-box">
                <Stack className="odg-icon-stack">
                  <Icon icon="arrows-alt" />
                  <p>Take on a polarized challenge</p>
                </Stack>
                <Stack className="odg-icon-stack">
                  <Icon icon="group" />
                  <p>Join a team of diverse Americans</p>
                </Stack>
                <Stack className="odg-icon-stack">
                  <Icon icon="search" />
                  <p>Find the solution that unites your team</p>
                </Stack>
                <Stack className="odg-icon-stack">
                  <Icon icon="unlock-alt" />
                  <p>Unlock the next level</p>
                </Stack>
              </Boxes>
              <div className="odg-nothing">The more you play the more real it gets</div>
            </Accordion>
            <div className={ClassNames(this.props.className, 'odg-child')}>
              <TypeComponent {...this.props} vs={this.state.vs} newLocation="/odg" />
            </div>
          </section>
          <Footer user={this.props.user} />
        </ThemeProvider>
      </section>
    )
    return page
  }
}

export default OnlineDeliberationGame
