// https://github.com/EnCiv/civil-pursuit/issues/150

import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
// import Color from 'color';
import { useAuth } from 'civil-client';

function SignUp(props, ref) {
    
    const { className, style, onDone = () => {}, startTab = 'login', ...otherProps} = props
    
    // checks if start tab requests login or sign up page
    const [isLogIn, setIsLogIn] = useState(
        startTab.toLowerCase().includes('up') ? false : startTab.toLowerCase().includes('in') ? true : false
    )
    const { destination, userInfo = {} } = props
    const classes = useStyles()
    const [state, methods] = useAuth(destination, userInfo)

    // if user has filled out required fields, automatically log them in
    if (userInfo.email && userInfo.password) {
        useEffect(() => {
            onDone({ valid: true, value: userInfo });
            return
        })
    }

    // otherwise, continue showing login/sign up page
    return (
        <div className={cx(className, classes.SignUp)} style={style} ref={ref} {...otherProps}>
            <div className={cx(classes.error, !(state.error || state.info || state.success) && classes.disabled)}>
                {!(state.email && state.password) && <div>Oops! Please fill out the missing items before continuing on.</div>}
                {state.error && <div>{state.error}</div>}
                {state.info && <div>{state.info}</div>}
                {state.success && <div>{state.success}</div>}
            </div>
            <div className={classes.tabs}>
                <div className={cx(classes.tab, !isLogIn && classes.tabSelected)}>
                    <button onClick={e => setIsLogIn(false)} className={cx(classes.btnClick, !isLogIn && classes.btnClickSelected)}>
                        Sign Up
                    </button>
                </div>
                <div className={cx(classes.tab, isLogIn && classes.tabSelected)}>
                    <button onClick={e => setIsLogIn(true)} className={cx(classes.btnClick, isLogIn && classes.btnClickSelected)}>
                        Log In
                    </button>
                </div>
            </div>
            <div className={cx(classes.inputContainer, isLogIn ? classes.tabRightSelected : classes.tabLeftSelected)}>
                <div className={cx(classes.inputBoxes, isLogIn && classes.disabled)}>
                    <p id="text">First Name</p>
                <input
                    name='first-name'
                    placeholder='John'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                />
                </div>
                <div className={cx(classes.inputBoxes, isLogIn && classes.disabled)}>
                   <p id="text">Last Name</p>
                <input
                    name='last-name'
                    placeholder='Doe'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                />
                </div>
                <div className={cx(classes.inputBoxes, !state.email && classes.invalid)}>
                    <p id="text">E-mail</p>
                <input
                    name='email'
                    placeholder='Johndoe@gmail.com'
                    className={cx(classes.input, !state.email && classes.invalidInput)}
                    onChange={e => methods.onChangeEmail(e.target.value)}
                />
                </div>
                <div className={cx(classes.inputBoxes, !state.password && classes.invalid)}>
                    <p id="text">Password</p>
                <input
                    name='password'
                    type='password'
                    placeholder='********'
                    className={cx(classes.input, !state.password && classes.invalidInput)}
                    onChange={e => methods.onChangePassword(e.target.value)}
                />
                </div>
                <div className={cx(classes.inputBoxes, isLogIn && classes.disabled)}>
                    <p id="text">Confirm Password</p>
                <input
                    name='confirm'
                    type='password'
                    placeholder='********'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                    onChange={e => methods.onChangeConfirm(e.target.value)}
                />
                </div>
                <div className={classes.agreeTermContainer}>
                    <div className={classes.checkTerm}>
                        <input
                            className={classes.checkTermBox}
                            type='checkbox'
                            name='agreed'
                            onClick={e => methods.onChangeAgree(e.target.checked)}
                        />
                        <label className={classes.agreeTermLabel}>
                            Yes, I agree to the
                            <a href='https://enciv.org/terms' target='_blank' className={classes.aLinkTerm}>
                                Terms of Service 
                            </a>
                             and
                            <a href='https://enciv.org/privacy' target='_blank' className={classes.aLinkTerm}>
                                Privacy Policy.
                            </a>
                        </label>
                    </div>
                </div>
                <div className={classes.btnContainer}>
                    <button className={cx(classes.btn, isLogIn && classes.disabled)} onClick={e => methods.signup()}>
                        Sign Up
                    </button>
                    <button className={cx(classes.btn, !isLogIn && classes.disabled)} onClick={e => methods.login()}>
                        Log In
                    </button>
                    <button className={cx(classes.btn, !isLogIn && classes.disabled)} onClick={e => methods.skip()}>
                        Skip
                    </button>
                </div>
                <div className={cx(classes.resetPasswordBtn, !isLogIn && classes.disabled)}>
                    <button onClick={e => methods.sendResetPassword()} className={classes.resetBtn}>
                        Send Reset Password
                    </button>
                </div>
                <div className={cx("go-to-sign-up", isLogIn && classes.disabled)}>
                    <p> Don't have an account? Click Join, it only takes a minute to sign up!</p>
                </div>
                <div className={cx("privacy-statement", isLogIn && classes.disabled)}>
                    <p> By submitting my information, I confirm that I have read and agreed to the
                        <a href="https://c1.sfdcstatic.com/content/dam/web/en_us/www/documents/legal/Privacy/salesforce-candidate-privacy-statement.pdf" target="_blank" className={classes.aLinkTerm}>
                            Privacy Statement.
                        </a>
                    </p>
                </div>
            </div>
        </div>)
}

export default React.forwardRef(SignUp);

const useStyles = createUseStyles(theme => ({
    SignUp: {
        color: theme.colors.textPrimary, 
        margin: 0,
        borderRadius: '1rem',
        padding: '0',
        fontFamily: 'Inter',
        fontSize: '1rem',
        fontWeight: '700',
        lineHeight: '1rem',
        textAlign: 'center',
        // position: 'fixed',
        overflowY: 'auto',
    },
    btnClick: {
        color: theme.colors.primaryButtonBlue,
        textDecoration: 'none',
        background: 'none',
        border: 'none',
        '&:hover': {
            color: theme.colors.mouseDownPrimeBlue,
            cursor: 'pointer',
        },
    },
    aLinkTerm: {
        marginLeft: '0.3rem', // add space
        marginRight: '0.3rem', // add space
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
            color: theme.colors.mouseDownPrimeBlue,
        },
    },
    tabs: {
        // width: '80%',
        height: '3rem',
        margin: 'auto',
        borderRadius: '5rem',
        border: '0.1rem solid #D9D9D9',
        padding: '0.2rem 0.2rem 0 0.2rem ',
        boxShadow:' 0.3rem 0.3rem 1rem 0.3rem rgba(0, 0, 0, 0.1)',
    },
    tab: {
        display: 'inline-block',
        position: 'relative',
        width: '50%',
        color: theme.colors.colorPrimary,
    },
    tabSelected: {
        display: 'inline-block',
        position: 'relative',
        borderRadius: '5rem',
        background: '#DCE8F2',
    },
    btnContainer: {
        width: '100%',
        display: 'flex',
        gap: '2rem',
    },
    btn: {
        borderRadius: '.5rem',
        border: '0.2rem solid',
        borderColor: theme.colors.primaryButtonBlue,
        backgroundColor: theme.colors.white,
        color: theme.colors.primaryButtonBlue,
        display: 'block',
        margin: '1rem auto',
        textAlign: 'center',
        width: '50%',
        '&:hover': {
            backgroundColor: theme.colors.primaryButtonBlue,
            borderColor: theme.colors.primaryButtonBlue,
            cursor: 'pointer',
            color: theme.colors.white,
        },
    },
    btnClick: {
        border: 'none',
        background: 'none',
        color: theme.colors.colorPrimary,
        '&:hover': {
            background: 'none',
            borderColor: 'none',
            textDecoration: 'underline',
        },
    },
    btnClickSelected: {
        color: theme.colors.primaryButtonBlue,
    },
    inputContainer: {
        margin: 0,
        padding: '2rem',
        borderRadius: '0 0 1rem 1rem',
        backgroundColor: theme.colors.white,
    },
    inputBoxes: {
        margin: '0 0.1rem',
        width: '80%',
        textAlign: 'left',
    },
    text: {
        margin: '0 0 1rem',
    },
    tabLeftSelected: {
        borderRadius: '0 1rem 1rem 1rem',
    },
    tabRightSelected: {
        borderRadius: '1rem 0 1rem 1rem',
    },
    input: { // '!important' to override from index.css
        width: '100%',
        background: '#FBFBFB',
        border: 'solid 0.1rem #EBEBEB !important',
        padding: '1rem !important',
        marginBottom: '2rem',
        borderRadius: '0.5rem !important',
        boxSizing: 'border-box !important',
    },
    invalid: {
        color: theme.colors.inputErrorBorder,
    },
    invalidInput: {
        border: '0.1rem solid red',
        backgroundColor: theme.colors.inputErrorContainer,
    },
    resetPasswordBtn: {
        width: '100%',
        margin: '2rem auto 1rem',
        cursor: 'pointer',
        textAlign: 'center',
    },
    resetBtn: {
        border: 'none',
        background: 'none',
        color: theme.colors.black,
        '&:hover': {
            background: 'none',
            borderColor: 'none',
            textDecoration: 'underline',
        },
    },
    agreeTermContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '2rem',
        margin: '0 auto',
    },
    checkTerm: {
        width: '100%',
        margin: '0 auto',
        textAlign: 'left',
        alignItems: 'left',
    },
    checkTermBox: {
        margin: 0,
        width: '1.5rem',
        height: '1.5rem',
        verticalAlign: 'middle',
    },
    agreeTermLabel: {
        width: '100%',
        marginLeft: '1rem',
        verticalAlign: 'middle',
    },
    error: {
        width: '80%',
        color: theme.colors.black,
        backgroundColor: theme.colors.inputErrorContainer,
        border: '0.1rem solid #BF1300',
        borderRadius: '0.5rem',
        padding: '1rem',
        textAlign: 'center',
        margin: '1rem auto',
    },
    disabled: {
        display: 'none',
    }
}))
