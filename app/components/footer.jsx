'use strict'

import React from 'react'
import { createUseStyles } from 'react-jss'
import SvgEncivBlack from '../svgr/enciv-black'
import SvgEncivWhite from '../svgr/enciv-white'

const Footer = props => {
  const { className, menu, mode, defaultSelectedItem, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  return (
    <footer className={classes.footerWrapper}>
      <div className={classes.footerColumns}>
        <div className={classes.footerColumn}>
          <div>Questions, Comments,</div>
          <div>Suggestions, Want to Help?</div>
          <div className={classes.spacedDiv}>Contact Us</div>
          <div>
            <a href="mailto:info@enciv.org">info@enciv.org</a>
          </div>
        </div>
        <div className={classes.footerColumn}>
          {mode === 'dark' ? <SvgEncivWhite className={classes.logo} /> : <SvgEncivBlack className={classes.logo} />}
        </div>
      </div>
      <div>
        Copyright © 2014 - {new Date().getFullYear()} by{' '}
        <a href="http://www.enciv.org" target="_blank">
          EnCiv, Inc a 501(c)(3) nonprofit.
        </a>
      </div>
    </footer>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  footerWrapper: props => ({
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: props.mode === 'dark' ? theme.colors.darkModeGray : 'white',
    color: props.mode === 'dark' ? 'white' : 'defaultColor',
  }),
  footerColumns: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      textAlign: 'center',
    },
  },
  footerColumn: {
    flex: 1,
    maxWidth: '50%',
  },
  spacedDiv: {
    margin: '20px 0',
  },
  logo: {
    width: '10rem',
    height: 'auto',
  },
}))

export default Footer
