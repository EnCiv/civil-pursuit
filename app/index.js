import * as button from './components/button'
import { default as TopNavBar } from './components/top-nav-bar'
import { default as theme } from './components/theme'
import { default as Footer } from './components/footer'
import { default as DiscussionTab } from './components/discussion-tab'

export const Components = {
  TopNavBar,
  Footer,
  DiscussionTab,
  ...button,
}
export { theme }
