import React from 'react'
import TopNavBar from '../app/components/top-nav-bar'
import { userEvent, within, expect, waitFor } from 'storybook/test'

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

const getVisibleText = (canvas, text) => {
  const element = canvas.getAllByText(text).find(candidate => candidate.getClientRects().length > 0)
  if (!element) throw new Error(`No visible element found with text: ${text}`)
  return element
}

const openMobileMenu = async canvas => {
  const menuToggle = canvas.queryByRole('button', { name: 'Open navigation menu' })
  if (!menuToggle) return
  await userEvent.click(menuToggle)
  await waitFor(() => expect(menuToggle).toHaveAttribute('aria-expanded', 'true'))
}

const openAboutMenu = async canvas => {
  const mobileMenuToggle = canvas.queryByRole('button', { name: /navigation menu/ })
  if (mobileMenuToggle) {
    await openMobileMenu(canvas)
    await userEvent.click(canvas.getByRole('button', { name: /About/ }))
  } else {
    await userEvent.hover(canvas.getByText('About \u25BE'))
  }
  await waitFor(() => expect(getVisibleText(canvas, 'FAQ')).toBeVisible())
}

const TransparentPage = props => {
  const isLight = props.mode === 'light-transparent'
  const color = isLight ? '#202020' : '#f7f5ef'

  return (
    <div style={{ position: 'relative', minHeight: '48rem', backgroundColor: isLight ? '#f4f2ec' : '#202020', color }}>
      <TopNavBar {...props} />
      <main style={{ boxSizing: 'border-box', maxWidth: '75rem', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>CIVIC PARTICIPATION</p>
        <h1 style={{ maxWidth: '48rem', fontSize: '3rem', lineHeight: 1.05 }}>A better future starts with listening.</h1>
        <p style={{ maxWidth: '40rem', fontSize: '1.25rem', lineHeight: 1.6 }}>
          Bring your perspective to the conversations shaping our communities. Explore ideas, hear from neighbors, and help move good work forward.
        </p>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '2rem', marginTop: '6rem', paddingTop: '2rem', borderTop: `1px solid ${color}66` }}>
          <div>
            <h2>Listen</h2>
            <p>Understand the experiences and priorities people bring to the table.</p>
          </div>
          <div>
            <h2>Connect</h2>
            <p>Find common ground through thoughtful, respectf  ul discussion.</p>
          </div>
          <div>
            <h2>Make progress</h2>
            <p>Turn shared understanding into practical next steps.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default {
  component: TopNavBar,
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#808080' }],
    },
};


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
    const canvas = within(canvasElement)
    await openMobileMenu(canvas)

    // Initially, FAQ should not be in the document or should be hidden
    expect(canvas.queryByText('FAQ')).toBeNull()

    await openAboutMenu(canvas)

    // Now verify that the FAQ item is visible in the dropdown
    const faqButton = await waitFor(() => getVisibleText(canvas, 'FAQ'))
    expect(faqButton).toBeVisible()
    expect(faqButton).toBeInTheDocument()

    // Verify that Contact is also visible
    const contactButton = getVisibleText(canvas, 'Contact')
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
    const canvas = within(canvasElement)
    await openMobileMenu(canvas)
    const homeButton = canvas.getByText('Home')
    await userEvent.click(homeButton)

    // expect the home button to be selected
    await waitFor(() => expect(homeButton.className).toContain('selectedItem'))
    // expect the other buttons to not have bottom border
    const discussionPortalButton = canvas.getByText('Discussion Portal')
    expect(discussionPortalButton.className).not.toContain('selectedItem')
    const blogButton = canvas.getByText('Blog')
    expect(blogButton.className).not.toContain('selectedItem')

    // click the discussion portal button
    await userEvent.click(discussionPortalButton)
    await waitFor(() => expect(discussionPortalButton.className).toContain('selectedItem'))
  },
}

export const HoverMenuGroup = {
  args: {
    menu: menuArray,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await openAboutMenu(canvas)
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
  render: args => <TransparentPage {...args} />,
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
  render: args => <TransparentPage {...args} />,
}

export const DarkTransparentMode = {
  args: {
    menu: menuArray,
    mode: 'dark-transparent',
  },
  render: args => <TransparentPage {...args} />,
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
  render: args => <TransparentPage {...args} />,
}

export const LightTransparentMode = {
  args: {
    menu: menuArray,
    mode: 'light-transparent',
  },
  render: args => <TransparentPage {...args} />,
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
  render: args => <TransparentPage {...args} />,
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
