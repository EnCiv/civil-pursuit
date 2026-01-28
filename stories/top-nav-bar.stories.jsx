import React from 'react'
import TopNavBar from '../app/components/top-nav-bar'
import Donate from '../app/components/donate'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import Common from './common'
import { userEvent, within, expect } from '@storybook/test'

// Placeholder for the user-or-signup component
const UserOrSignInUp = () => {
  return <div>Hello, Andrew! Logout</div>
}

const menuFunc = name => {
  console.log(`Menu item ${name} clicked`)
}

const createMenuItem = name => {
  return {
    name: name,
    func: () => {
      menuFunc(name)
    },
  }
}

const menuArray = [
  createMenuItem('Home'),
  createMenuItem('Discussion Portal'),
  createMenuItem('Blog'),
  [createMenuItem('About'), createMenuItem('Contact'), createMenuItem('FAQ')],
  [createMenuItem('Our Work'), createMenuItem('Work 1'), createMenuItem('Work 2')],
]

export default {
  component: TopNavBar,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#808080' }],
    },
  },
}

export const Empty = () => {
  return <TopNavBar />
}

export const StandardMenu = { args: { menu: menuArray } }

export const MobileMode = {
  args: {
    menu: menuArray,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const SmallParentDiv = () => {
  return (
    <div style={{ width: '700px' }}>
      <TopNavBar menu={menuArray} />
    </div>
  )
}

export const LargeParentDiv = () => {
  return (
    <div style={{ width: '1200px' }}>
      <TopNavBar menu={menuArray} />
    </div>
  )
}

export const XLargeParentDiv = () => {
  return (
    <div style={{ width: '2000px' }}>
      <TopNavBar menu={menuArray} />
    </div>
  )
}

export const DefaultSelectedHome = {
  args: {
    menu: menuArray,
    defaultSelectedItem: 'Home',
  },
}

export const DefaultSelectedHomeWithSignUp = {
  args: {
    menu: menuArray,
    defaultSelectedItem: 'Home',
    UserOrSignInUp,
  },
}

export const MakeSureDropDownsAppear = {
  args: {
    menu: menuArray,
    defaultSelectedItem: 'Home',
    UserOrSignInUp,
  },
  decorators: [
    Story => {
      return (
        <>
          <Story />
          <div style={{ position: 'relative', backgroundColor: 'blue', width: '100%', height: '30rem' }}></div>
        </>
      )
    },
  ],
}

export const VerifyDropDownFAQVisible = {
  args: {
    menu: menuArray,
    defaultSelectedItem: 'Home',
    UserOrSignInUp,
  },
  decorators: [
    Story => {
      return (
        <>
          <Story />
          <div style={{ position: 'relative', backgroundColor: 'blue', width: '100%', height: '30rem' }}></div>
        </>
      )
    },
  ],
  play: async ({ canvasElement }) => {
    await Common.asyncSleep(1000)
    const canvas = within(canvasElement)
    const aboutButton = canvas.getByText('About \u25BE')

    // Initially, FAQ should not be in the document or should be hidden
    expect(canvas.queryByText('FAQ')).toBeNull()

    // Hover over the About button
    userEvent.hover(aboutButton)
    await Common.asyncSleep(600)

    // Now verify that the FAQ item is visible in the dropdown
    const faqButton = canvas.getByText('FAQ')
    expect(faqButton).toBeVisible()
    expect(faqButton).toBeInTheDocument()

    // Verify that Contact is also visible
    const contactButton = canvas.getByText('Contact')
    expect(contactButton).toBeVisible()
    expect(contactButton).toBeInTheDocument()

    // Verify the dropdown menu itself is visible (find parent div containing the dropdown items)
    const dropdownMenu = faqButton.parentElement
    expect(dropdownMenu).toBeVisible()
    expect(dropdownMenu).toBeInTheDocument()

    // Check that FAQ is actually visually accessible by checking what element is at its center point
    const faqRect = faqButton.getBoundingClientRect()
    const centerX = faqRect.left + faqRect.width / 2
    const centerY = faqRect.top + faqRect.height / 2

    // Get the topmost element at the FAQ button's center position
    const elementAtPoint = document.elementFromPoint(centerX, centerY)

    // The element at this point should be either the FAQ button itself or one of its descendants
    // If it's the blue div or something else, the FAQ is covered
    expect(elementAtPoint === faqButton || faqButton.contains(elementAtPoint)).toBeTruthy()
  },
}

export const ClickMenuItem = {
  args: {
    menu: menuArray,
  },
  play: async ({ canvasElement }) => {
    await Common.asyncSleep(1000)
    const canvas = within(canvasElement)
    const homeButton = canvas.getByText('Home')
    userEvent.click(homeButton)
    await Common.asyncSleep(600)

    // expect the home button to be selected
    expect(homeButton.className).toContain('selectedItem')
    // expect the other buttons to not have bottom border
    const discussionPortalButton = canvas.getByText('Discussion Portal')
    expect(discussionPortalButton.className).not.toContain('selectedItem')
    const blogButton = canvas.getByText('Blog')
    expect(blogButton.className).not.toContain('selectedItem')

    // click the discussion portal button
    userEvent.click(discussionPortalButton)
    await Common.asyncSleep(600)
    expect(discussionPortalButton.className).toContain('selectedItem')
  },
}

export const HoverMenuGroup = {
  args: {
    menu: menuArray,
  },
  play: async ({ canvasElement }) => {
    await Common.asyncSleep(1000)
    const canvas = within(canvasElement)
    const aboutButton = canvas.getByText('About \u25BE')
    userEvent.hover(aboutButton)
    await Common.asyncSleep(600)
  },
}

export const DarkMode = {
  args: {
    menu: menuArray,
    mode: 'dark',
  },
}

export const DarkModeMobile = {
  args: {
    menu: menuArray,
    mode: 'dark',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const TransparentMode = {
  args: {
    menu: menuArray,
    mode: 'transparent',
  },
}

export const TransparentMobileMode = {
  args: {
    menu: menuArray,
    mode: 'transparent',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const DarkTransparentMode = {
  args: {
    menu: menuArray,
    mode: 'dark-transparent',
  },
}

export const DarkTransparentMobileMode = {
  args: {
    menu: menuArray,
    mode: 'dark-transparent',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const LightTransparentMode = {
  args: {
    menu: menuArray,
    mode: 'light-transparent',
  },
}

export const LightTransparentMobileMode = {
  args: {
    menu: menuArray,
    mode: 'light-transparent',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const VariableParentDiv = () => {
  document.getElementsByTagName('body')[0].style.width = '100%' // this is a hack to force full with even through index.css has a media query keeping it at 982
  return (
    <div style={{ backgroundColor: 'gray' }}>
      <TopNavBar menu={menuArray} />
    </div>
  )
}

export const VerticalModeEmpty = {
  args: {
    menu: [],
    mode: 'vertical',
  },
}

export const VerticalModeThreeItems = {
  args: {
    menu: [createMenuItem('Profile'), createMenuItem('Discussions'), createMenuItem('Settings')],
    mode: 'vertical',
  },
}

export const VerticalModeFiveItems = {
  args: {
    menu: [createMenuItem('Profile'), createMenuItem('Discussions'), createMenuItem('Settings'), createMenuItem('Help'), createMenuItem('Logout')],
    mode: 'vertical',
  },
}

export const VerticalModeDefaultTabSelect = {
  args: {
    menu: [createMenuItem('Profile'), createMenuItem('Discussions'), createMenuItem('Settings'), createMenuItem('Help'), createMenuItem('Logout')],
    defaultSelectedItem: 'Discussions',
    mode: 'vertical',
  },
}

export const VerticalMode20RemWidth = {
  args: {
    menu: [createMenuItem('Profile'), createMenuItem('Discussions'), createMenuItem('Settings'), createMenuItem('Help'), createMenuItem('Logout')],
    defaultSelectedItem: 'Discussions',
    mode: 'vertical',
    style: { width: '20rem' },
  },
}
