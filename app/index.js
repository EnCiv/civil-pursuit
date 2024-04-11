import * as button from './components/button'
import { default as TopNavBar } from './components/top-nav-bar'
import { default as theme } from './theme'

export const components = {
  TopNavBar,
  ...button,
}
export { theme }
