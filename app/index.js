import * as button from './components/button'
import { default as TopNavBar } from './components/top-nav-bar'
import { default as theme } from './components/theme'
import { default as Footer } from './components/footer'
import { default as DiscussionTab } from './web-components/discussion-tab'
import { default as ProfilePage } from './web-components/profile-page'

export const Components = {
  TopNavBar,
  Footer,
  DiscussionTab,
  ProfilePage,
  ...button,
}
export { theme }
