import makeChapter from './make-chapter'
import component from '../app/components/signin-signup.jsx'
const mC = makeChapter(component)

export default {
    title: 'SignInSignUp',
    component,
    argTypes: {},
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
}

export const empty = mC({})
export const SignUp = mC({ startTab: 'Sign Up' })
export const LoginIn = mC({ startTab: 'Log In' })
export const DestinationHomeString = mC({ destination: '/?path=/story/app--home' })
export const DestinationHomeFunction = mC({ destination: value => (location.href = '/?path=/story/app--home') })