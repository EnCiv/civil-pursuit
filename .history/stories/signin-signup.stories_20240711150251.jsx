// https://github.com/EnCiv/civil-pursuit/issues/150
import React from 'react'
import SignInSignUp from '../app/components/signin-signup.jsx'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

export default {
  component: SignInSignUp,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const Template = args => <SignInSignUp {...args} />

// export const Default = Template.bind({})
// Default.args = {
//     title: 'SignInSignUp',
//     SignInSignUp,
//     argTypes: {},
//     decorators: [
//         Story => (
//             <div>
//                 success@email.com / 'password' will succeed
//                 <br />
//                 all other combinations will fail
//                 <Story />
//             </div>
//         ),
//     ],
// }

export const Empty = Template.bind({})
Empty.args = {};

export const SignUp = mC({ startTab: 'Sign Up' })
export const LoginIn = mC({ startTab: 'Log In' })
export const DestinationHomeString = mC({ destination: '/?path=/story/app--home' })
export const DestinationHomeFunction = mC({ destination: value => (location.href = '/?path=/story/app--home') })