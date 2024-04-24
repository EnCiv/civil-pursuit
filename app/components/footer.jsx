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
      <div className={classes.footerGrid}>
        <div className={classes.row}>
          <div className={`${classes.column} ${classes.emailRow}`}>
            <div className={classes.mainText}>Questions, Comments, Suggestions, Want to Help?</div>
            <div className={classes.spacedDiv}>
              <a href="mailto:contact@enciv.org" className={`${classes.secondaryText} ${classes.links}`}>
                contact@enciv.org
              </a>
            </div>
          </div>
          <div className={classes.column}>
            {mode === 'dark' ? <SvgEncivWhite className={classes.logo} /> : <SvgEncivBlack className={classes.logo} />}
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.column}>
            <div className={classes.secondaryText}>
              Copyright © {new Date().getFullYear()}{' '}
              <a href="http://www.enciv.org" target="_blank" style={{ color: 'white' }}>
                EnCiv
              </a>
            </div>
          </div>
          <div className={classes.column}>
            <a href="https://enciv.org/terms/" className={`${classes.secondaryText} ${classes.links}`}>
              Terms and Conditions
            </a>{' '}
            |{' '}
            <a href="https://enciv.org/privacy" className={`${classes.secondaryText} ${classes.links}`}>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  footerWrapper: props => ({
    width: '100%',
    backgroundColor: props.mode === 'dark' ? theme.colors.darkModeGray : 'white',
    color: props.mode === 'dark' ? 'white' : 'defaultColor',
    textAlign: 'left',
  }),
  footerGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  column: {
    flex: 1,
    padding: '10px',
    maxWidth: '100%',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      textAlign: 'center',
      flex: 'none',
      maxWidth: 'calc(100% - 20px)',
    },
  },
  mainText: {
    fontWeight: 'bold',
    marginTop: '20px',
    marginBottom: '10px',
  },
  emailRow: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  secondaryText: props => ({
    fontSize: '0.7em',
    color: props.mode === 'dark' ? 'white' : 'black',
  }),
  links: { textDecoration: 'underline' },
  spacedDiv: {
    margin: '10px 0 30px 0',
  },
  logo: {
    width: '10rem',
    height: 'auto',
  },
}))

export default Footer
