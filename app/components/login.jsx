// https://github.com/EnCiv/civil-pursuit/issues/150

// CHANGELOG
// 7/11/24: removed instances of useAuth to try to get interface working, will fix later
// 7/12/24: removed "ref" from login.jsx file since its deprecated, trying to get some stories up
// 7/13/24: changed file name to login.jsx after installing civil-client
// 7/15/24: i had to change stuff on webpack-dev to get the email updating properly (buffer is not defined)
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import Color from 'color';
import { useAuth } from  'civil-client';

function Login(props, ref) {
    
    const { className, style, onDone = () => {}, startTab = 'login' } = props
    
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
        <div className={cx(className, classes.Login)} style={style} ref={ref}>
            <div className={classes.tabs}>
                <div className={cx(classes.tab, !isLogIn && classes.tabSelected)}>
                    {/* (remove corner decoration) <div className={cx(classes.leftTabCorner, !isLogIn && classes.disabled)}>
                        <div className={classes.leftTabCornerContent} />
                    </div> */}
                    <button onClick={e => setIsLogIn(false)} className={cx(classes.btnClick, !isLogIn && classes.btnClickSelected)}>
                        Sign Up
                    </button>
                </div>
                <div className={cx(classes.tab, isLogIn && classes.tabSelected)}>
                    {/* (remove corner decoration) <div className={cx(classes.rightTabCorner, isLogIn && classes.disabled)}>
                        <div className={classes.rightTabCornerContent} />
                    </div> */}
                    <button onClick={e => setIsLogIn(true)} className={cx(classes.btnClick, isLogIn && classes.btnClickSelected)}>
                        Log In
                    </button>
                </div>
            </div>
            <div className={cx(classes.inputContainer, isLogIn ? classes.tabRightSelected : classes.tabLeftSelected)}>
                <input
                    name='first-name'
                    placeholder='First Name'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                />
                <input
                    name='last-name'
                    placeholder='Last Name'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                />
                <input
                    name='email'
                    placeholder='Email Address'
                    className={classes.input}
                    onChange={e => methods.onChangeEmail(e.target.value)}
                />
                <input
                    name='password'
                    type='password'
                    placeholder='Password'
                    className={classes.input}
                    onChange={e => methods.onChangePassword(e.target.value)}
                />
                <input
                    name='confirm'
                    type='password'
                    placeholder='Confirm Password'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                    onChange={e => methods.onChangeConfirm(e.target.value)}
                />
                <div className={classes.agreeTermContainer}>
                    <div className={classes.checkTerm}>
                        <input
                            className={classes.checkTermBox}
                            type='checkbox'
                            name='agreed'
                            onClick={e => methods.onChangeAgree(e.target.checked)}
                        />
                        <label className={classes.agreeTermLabel}>
                            I agree to the
                            <a href='https://enciv.org/terms' target='_blank' className={classes.aLinkTerm}>
                                Terms of Service
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
                <div>
                    {state.error && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.error}</div>}
                    {state.info && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.info}</div>}
                    {state.success && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.success}</div>}
                </div>
            </div>
        </div>)
}

export default React.forwardRef(Login);

const useStyles = createUseStyles(theme => ({
    Login: {
        backgroundColor: 'white', 
        width: '60rem',
        maxWidth: '100vw',
        margin: 0,
        borderRadius: '1rem',
        height: '100%',
        padding: '0',
        fontFamily: 'Inter',
        fontSize: '16px', // change to rem?
        fontWeight: '700',
        lineHeight: '16px', // change to rem?
        textAlign: 'center',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 10,
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    btnClick: {
        color: '#1A1A1A',
        textDecoration: 'none',
        background: 'none',
        border: 'none',
        '&:hover': {
            color: '#fec215',
            cursor: 'pointer',
        },
    },
    aLinkTerm: {
        color: '#fec215',
        marginLeft: '0.3rem',
        textDecoration: 'none',
        '&:hover': {
            color: 'blue',
            cursor: 'pointer',
        },
    },
    tabs: {
        width: '80%',
        height: '3rem',
        margin: 'auto',
        borderRadius: '5rem',
        border: '1px solid #D9D9D9',
        padding: '0.2rem 0.2rem 0 0.2rem ',
        boxShadow:' 3px 3px 1rem 3px rgba(0, 0, 0, 0.1)',
    },
    tab: {
        display: 'inline-block',
        position: 'relative',
        width: '50%',
        color: 'blue',
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
        ...theme.button,
        borderRadius: '.5rem',
        backgroundColor: '#262D33',
        color: '#FFFFFF',
        display: 'block',
        margin: '1rem auto',
        textAlign: 'center',
        width: '50%',
        '&:hover': {
            backgroundColor: '#06335c',
            cursor: 'pointer',
            color: theme.colorPrimary,
        },
    },
    btnClick: {
        border: 'none',
        background: 'none',
        color: 'black',
        '&:hover': {
            background: 'none',
            borderColor: 'none',
            textDecoration: 'underline',
        },
    },
    btnClickSelected: {
        color: '#06335c',
    },
    inputContainer: {
        margin: 0,
        padding: '2rem',
        borderRadius: '0 0 1rem 1rem',
        backgroundColor: 'white',
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
        border: 'solid 1px #EBEBEB !important',
        padding: '1rem !important',
        marginBottom: '2rem',
        borderRadius: '0.5rem !important',
        boxSizing: 'border-box !important',
    },
    resetPasswordBtn: {
        width: '100%',
        margin: '2rem auto 1rem',
        cursor: 'pointer',
        textAlign: 'center',
    },
    resetBtn: {
        background: 'none',
        border: 'none',
        color: 'black',
        cursor: 'pointer',
        '&:hover': {
            color: '#fec215',
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
    disabled: {
        display: 'none',
    },
    leftTabCornerContent: {
        height: '100%',
        width: '100%',
        backgroundColor: Color(theme.colorPrimary).lighten(0.2).hex(),
        borderBottomRightRadius: '1rem',
    },
    leftTabCorner: {
        height: '1rem',
        width: '1rem',
        position: 'absolute',
        backgroundColor: theme.colorPrimary,
        bottom: 0,
        right: 0,
    },
    rightTabCornerContent: {
        backgroundColor: Color(theme.colorPrimary).lighten(0.2).hex(),
        borderBottomLeftRadius: '1rem',
        height: '100%',
        width: '100%',
    },
    rightTabCorner: {
        height: '1rem',
        width: '1rem',
        position: 'absolute',
        backgroundColor: theme.colorPrimary,
        bottom: 0,
        left: 0,
    },
}))
