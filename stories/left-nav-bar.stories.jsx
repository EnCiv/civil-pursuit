import React from 'react'
import LeftNavBar from '../app/components/left-nav-bar'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { userEvent, within, expect } from '@storybook/test'

// Utility function to create menu items
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

// Create sample menu arrays
const menuArray = [
  createMenuItem('Home'),
  createMenuItem('Services'),
  createMenuItem('Portfolio'),
  [createMenuItem('About'), createMenuItem('Contact'), createMenuItem('FAQ')],
  createMenuItem('Blog'),
]

export default {
  component: LeftNavBar,
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

/**
 * Story for an empty menu (no items).
 */
export const EmptyMenu = {
  args: {
    menu: [], // No items
  },
}

/**
 * Story for a menu with 3 items.
 */
export const ThreeMenuItems = {
  args: {
    menu: [
      createMenuItem('Menu 1'),
      createMenuItem('Menu 2'),
      createMenuItem('Menu 3'),
    ],
  },
}

/**
 * Story for a menu with 5 items.
 */
export const FiveMenuItems = {
  args: {
    menu: [
      createMenuItem('Menu 1'),
      createMenuItem('Menu 2'),
      createMenuItem('Menu 3'),
      createMenuItem('Menu 4'),
      createMenuItem('Menu 5'),
    ],
  },
}

/**
 * Story for the full standard menu with sub-items.
 */
export const StandardMenu = {
  args: {
    menu: menuArray,
  },
}

/**
 * Story for the menu in a mobile viewport.
 */
export const MobileMenu = {
  args: {
    menu: menuArray,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

/**
 * Interactive test story for clicking a menu item.
 */
export const ClickMenuItem = {
  args: {
    menu: menuArray,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const homeButton = canvas.getByText('Home')
    userEvent.click(homeButton)

    // Assert that the Home button was clicked and is selected
    expect(homeButton.className).toContain('selectedItem')
  },
}
