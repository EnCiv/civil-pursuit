// https://github.com/EnCiv/civil-pursuit/issues/150

import React from 'react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import SignUp from '../app/components/sign-up.jsx'

export default {
  component: SignUp,
  args: {},
  decorators: [
    Story => (
        <div>
            success@email.com / 'password' will succeed
            <br />
            all other combinations will fail
            <Story />
            </div>
        ),
    ],
  parameters: {
    viewport: {
        viewports: INITIAL_VIEWPORTS
    }
  }
}

export const sign_up_page = {
    args: {
        startTab: 'Sign Up'
    }
}

export const Log_In_Page = {
    args: {
        startTab: 'Log In'
    }
}

export const Mobile_View = {
    parameters: {
        viewport: {
            defaultViewport: 'iphonex',
        }
    },
    args: {}
}

// export const DestinationHomeString = mC({ destination: '/?path=/story/app--home' })
// export const DestinationHomeFunction = mC({ destination: value => (location.href = '/?path=/story/app--home') })