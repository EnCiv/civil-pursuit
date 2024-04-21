'use strict'

import React from 'react'
import { createUseStyles } from 'react-jss'
import SvgEncivBlack from '../svgr/enciv-black'
import SvgEncivWhite from '../svgr/enciv-white'

const Footer = props => {
  const { className, menu, mode, defaultSelectedItem, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  return (
    <footer className={classes.componentWrapper}>
      <div className={classes.footerRow}>
        <div className={classes.footerColumn} style={{ flexGrow: 1 }}>
          <div>Questions, Comments,</div>
          <div>Suggestions, Want to Help?</div>
          <div>Contact Us</div>
          <div>
            <a href="mailto:email@email.com">email@email.com</a>
          </div>
        </div>
        <div className={classes.footerColumn}>
          <div className={classes.logoContainer}>
            {mode === 'dark' ? <SvgEncivWhite className={classes.logo} /> : <SvgEncivBlack className={classes.logo} />}
          </div>
        </div>
      </div>
      <div className={classes.footerRow}>
        <div className={classes.copyright}>
          Copyright © 2014 - {new Date().getFullYear()} by{' '}
          <a href="http://www.enciv.org" target="_blank">
            EnCiv, Inc a 501(c)(3) nonprofit.
          </a>
        </div>
      </div>
    </footer>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  componentWrapper: props => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.mode === 'dark' ? theme.colors.darkModeGray : 'white',
    color: props.mode === 'dark' ? 'white' : 'defaultColor',
  }),
  footerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0.5rem',
  },
  footerColumn: () => ({
    display: 'flex',
    flexDirection: 'column',
  }),
  logoContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logo: {
    width: '8.5rem',
    height: 'auto',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '4rem',
    },
  },
  copyright: {
    textAlign: 'center',
  },
}))

export default Footer
