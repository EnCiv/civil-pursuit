// https://github.com/EnCiv/civil-pursuit/issues/150
import React from 'react'
import SignInSignUp from '../app/components/signin-signup.jsx'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

export default {
  component: SignInSignUp,
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


export const empty = {
    args: {}
}

export const SignUp = {
    args: {
        startTab: 'Sign Up'
    }
}

export const LogIn = {
    args: {
        startTab: 'Log In'
    }
}

export const Mobile = {
    parameters: {
        viewport: {
            defaultViewport: 'iphonex',
        }
    },
    args: {}
}

export const LogInWithDestination = {
    args: {
        startTab: 'login',
        destination: '/?path=/story/app--home',
    }
}


// export const DestinationHomeString = mC({ destination: '/?path=/story/app--home' })
// export const DestinationHomeFunction = mC({ destination: value => (location.href = '/?path=/story/app--home') })