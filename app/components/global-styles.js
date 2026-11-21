import { createUseStyles } from 'react-jss'
import theme from './theme'

const useStyles = createUseStyles({
  '@global': {
    html: {
      scrollBehavior: 'smooth',
    },
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    'html, body': {
      fontFamily: `${theme.font.fontFamily}, sans-serif`,
      margin: 0,
      padding: 0,
    },
    body: {
      color: theme.colors.title,
      lineHeight: 1.5,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: `${theme.font.headingFontFamily}, Georgia, serif`,
      color: theme.colors.primaryButtonBlue,
      fontWeight: 600,
      lineHeight: 1.12,
      textWrap: 'balance',
    },
    h1: {
      fontSize: '3.5rem',
    },
    h2: {
      fontSize: '2.75rem',
    },
    h3: {
      fontSize: '2.125rem',
    },
    h4: {
      fontSize: '1.4rem',
    },
    h5: {
      fontSize: '0.9rem',
    },
    'a, button, input, textarea, select': {
      WebkitTapHighlightColor: 'transparent',
    },
    'input:not([type="checkbox"]):not([type="radio"]), textarea, select': {
      transition: `border-color ${theme.motion.form} ${theme.motion.standardEase}, box-shadow ${theme.motion.form} ${theme.motion.standardEase}, background-color ${theme.motion.form} ${theme.motion.standardEase}`,
    },
    'input:not([type="checkbox"]):not([type="radio"]):focus-visible, textarea:focus-visible, select:focus-visible': {
      outline: 'none',
      borderColor: theme.colors.primaryButtonBlue,
      boxShadow: '0 0 0 0.2rem rgba(6, 51, 92, 0.14)',
    },
    '::selection': {
      color: theme.colors.title,
      background: 'rgba(255, 195, 21, 0.4)',
    },
    '@media (prefers-reduced-motion: reduce)': {
      html: {
        scrollBehavior: 'auto',
      },
      'input:not([type="checkbox"]):not([type="radio"]), textarea, select': {
        transition: 'none',
      },
    },
    '@media (max-width: 40rem)': {
      h1: {
        fontSize: '2.5rem',
      },
      h2: {
        fontSize: '2.125rem',
      },
      h3: {
        fontSize: '1.75rem',
      },
    },
  },
})

const GlobalStyles = () => {
  useStyles()
  return null
}

export default GlobalStyles
