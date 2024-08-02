'use strict'

import React from 'react'
import { createUseStyles } from 'react-jss'
import SvgEncivBlack from '../svgr/enciv-black'
import SvgEncivWhite from '../svgr/enciv-white'

const Footer = props => {
  const { mode } = props
  const classes = useStylesFromThemeFunction(props)

  return (
    <footer className={classes.footerWrapper}>
      <div className={classes.footerGrid}>
        <div className={classes.row}>
          <div className={`${classes.column} ${classes.item2}`}>
            <div className={classes.mainText}>Questions, Comments, Suggestions, Want to Help?</div>
            <div className={classes.spacedDiv}>
              <a href="mailto:contact@enciv.org" className={`${classes.secondaryText} ${classes.links}`}>
                contact@enciv.org
              </a>
            </div>
          </div>
          <div className={`${classes.column} ${classes.item1}`}>
            {mode === 'dark' ? <SvgEncivWhite className={classes.logo} /> : <SvgEncivBlack className={classes.logo} />}
          </div>
        </div>
        <div className={classes.row}>
          <div className={`${classes.column} ${classes.item3}`}>
            <div className={classes.secondaryText}>
              Copyright © {new Date().getFullYear()}{' '}
              <a href="http://www.enciv.org" className={`${classes.copyright} ${classes.links}`}>
                EnCiv
              </a>
            </div>
          </div>
          <div className={`${classes.column} ${classes.item4}`}>
            <a href="/terms" className={`${classes.secondaryText} ${classes.links}`}>
              Terms and Conditions
            </a>{' '}
            |{' '}
            <a href="/privacy" className={`${classes.secondaryText} ${classes.links}`}>
              Privacy Policy
            </a>{' '}
            |{' '}
            <a href="/nondiscrimination" className={`${classes.secondaryText} ${classes.links}`}>
              Nondiscrimination Policy
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
    backgroundColor: props.mode === 'dark' ? theme.colors.darkModeGray : theme.colors.white,
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.black,
    textAlign: 'left',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '0 0 1.5rem 0',
    },
  }),
  footerGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: theme.maxPanelWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
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
    padding: '1rem 3rem',
    maxWidth: '100%',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      textAlign: 'center',
      flex: 'none',
      width: '100%',
      padding: 0,
    },
  },
  mainText: {
    fontWeight: 'bold',
    margin: '3rem 0 1rem 0',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      margin: 0,
    },
  },
  secondaryText: props => ({
    fontSize: '0.8rem',
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.black,
  }),
  spacedDiv: {
    margin: '1rem 0 1rem 0',
  },
  item1: {
    textAlign: 'right',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      textAlign: 'center',
      order: 1,
    },
  },
  item2: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      order: 2,
    },
  },
  item3: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      order: 3,
    },
  },
  item4: {
    textAlign: 'right',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      textAlign: 'center',
      order: 4,
    },
  },
  links: { rel: 'noopener noreferrer', target: '_blank', textDecoration: 'underline' },
  copyright: props => ({
    textDecoration: 'none',
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.black,
  }),
  logo: {
    width: '10rem',
    height: 'auto',
  },
}))

export default Footer
