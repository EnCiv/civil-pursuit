import { createUseStyles } from 'react-jss'
import theme from './theme'

const useStyles = createUseStyles({
  '@global': {
    'html, body': {
      fontFamily: theme.font.fontFamily,
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
    'h1, h2, h3, h4, h5': {
      color: '#333',
      fontWeight: 100,
      lineHeight: '1.3em',
    },
    h1: {
      fontSize: '2.5rem',
      // fontWeight: 'bold',
    },
    h2: {
      fontSize: '2.1rem',
      // fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.8rem',
      // fontWeight: 'bold',
    },
    h4: {
      fontSize: '1.4rem',
      // fontWeight: 'bold',
    },
    h5: {
      fontSize: '0.9rem',
      // fontWeight: 'bold',
    },
  },
})

const GlobalStyles = () => {
  useStyles()
  return null
}

export default GlobalStyles
