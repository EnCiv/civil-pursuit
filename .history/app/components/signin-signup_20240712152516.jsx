// https://github.com/EnCiv/civil-pursuit/issues/150

// CHANGELOG
// 7/11/24: removed instances of useAuth to try to get interface working, will fix later
// 7/12/24: removed "ref" from login.jsx file since its deprecated, trying to get some stories up
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import Color from 'color';
// import { useAuth } from 'civil-client';

function SignInSignUp(props, ref) {
    
    const { className, style, onDone = () => {}, startTab = 'login' } = props
    
    // checks if start tab requests login or sign up page
    const [isLogIn, setIsLogIn] = useState(
        startTab.toLowerCase().includes('up') ? false : startTab.toLowerCase().includes('in') ? true : false
    )
    const { destination, userInfo = {} } = props
    const classes = useStyles()
    // const [state, methods] = useAuth(destination, userInfo)

    // if user has filled out required fields, automatically log them in
    if (userInfo) {
        useEffect(() => {
            onDone({ valid: true, value: userInfo });
            return;
        })
    }

    // otherwise, continue showing login/sign up page
    return (
        <div className={cx(className, classes.SignInSignUp)} style={style} ref={ref}>
            <div className={classes.tabs}>
                <div className={cx(classes.tab, !isLogIn && classes.tabSelected)}>
                    <div className={cx(classes.leftTabCorner, !isLogIn && classes.disabled)}>
                        <div className={classes.leftTabCornerContent} />
                    </div>
                    <button onClick={e => setIsLogIn(false)} className={classes.btnClick}>
                        Sign Up
                    </button>
                </div>
                <div className={cx(classes.tab, isLogIn && classes.tabSelected)}>
                    <div className={cx(classes.rightTabCorner, isLogIn && classes.disabled)}>
                        <div className={classes.rightTabCornerContent} />
                    </div>
                    <button onClick={e => setIsLogIn(true)} className={classes.btnClick}>
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
                    // onChange={e => methods.onChangeEmail(e.target.value)}
                />
                <input
                    name='password'
                    type='password'
                    placeholder='Password'
                    className={classes.input}
                    // onChange={e => methods.onChangePassword(e.target.value)}
                />
                <input
                    name='confirm'
                    type='password'
                    placeholder='Confirm Password'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                    // onChange={e => methods.onChangeConfirm(e.target.value)}
                />
                <div className={cx(classes.agreeTermContainer, isLogIn && classes.disabled)}>
                    <div className={classes.checkTerm}>
                        <input
                            className={classes.checkTermBox}
                            type='checkbox'
                            name='agreed'
                            // onClick={e => methods.onChangeAgree(e.target.checked)}
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
                    {/*<button className={cx(classes.btn, isLogIn && classes.disabled)} onClick={e => methods.signup()}>*/}
                    <button className={cx(classes.btn, isLogIn && classes.disabled)}>
                        Sign Up
                    </button>
                    {/*<button className={cx(classes.btn, !isLogIn && classes.disabled)} onClick={e => methods.login()}>*/}
                    <button className={cx(classes.btn, !isLogIn && classes.disabled)}>
                        Log In
                    </button>
                </div>
                <div className={cx(classes.resetPasswordBtn, !isLogIn && classes.disabled)}>
                    {/*<button onClick={e => methods.sendResetPassword()} className={classes.resetBtn}>*/}
                    <button className={classes.resetBtn}>
                        Send Reset Password
                    </button>
                </div>
                {/* <div>
                    {state.error && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.error}</div>}
                    {state.info && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.info}</div>}
                    {state.success && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.success}</div>}
                </div> */}
            </div>
        </div>)
}

export default React.forwardRef(SignInSignUp);

// comments next to code lines show new values
const useStyles = createUseStyles(theme => ({
    SignInSignUp: {
        backgroundColor: Color(theme.colorPrimary).lighten(0.2).hex(), // 'white'
        width: '60rem',
        maxWidth: '100vw',
        margin: 0,
        borderRadius: '1rem',
        height: "40rem",
        padding: '0',
        fontFamily: theme.defaultFontFamily,
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 10,
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    btnClick: {
        color: theme.colorPrimary, // #1A1A1A
        textDecoration: 'none',
        fontSize: '2rem',
        background: 'none',
        border: 'none',
        '&:hover': {
            color: '#fec215',
            cursor: 'pointer',
        },
    },
    aLinkTerm: {
        color: '#fec215',
        marginLeft: '1rem',
        textDecoration: 'none',
        fontSize: '1rem',
        '&:hover': {
            color: '#FFFFFF',
            cursor: 'pointer',
        },
    },
    tabs: {
        width: '100%',
        display: 'table',
    },
    tab: {
        display: 'table-cell',
        textAlign: 'center',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        position: 'relative',
    },
    tabSelected: {
        borderRadius: '1rem 1rem 0 0',
        backgroundColor: theme.colorPrimary,
    },
    btnContainer: {
        width: '100%',
    },
    btn: {
        ...theme.button,
        borderRadius: '.5rem',
        backgroundColor: '#262D33',
        color: '#FFFFFF',
        display: 'block',
        margin: '1rem auto',
        textAlign: 'center',
        fontSize: '2rem',
        width: '100%',
        '&:hover': {
            backgroundColor: '#fec215',
            cursor: 'pointer',
            color: theme.colorPrimary,
        },
    },
    inputContainer: {
        margin: 0,
        padding: '2rem',
        borderRadius: '0 0 1rem 1rem',
        backgroundColor: 'theme.colorPrimary', // white
    },
    tabLeftSelected: {
        borderRadius: '0 1rem 1rem 1rem',
    },
    tabRightSelected: {
        borderRadius: '1rem 0 1rem 1rem',
    },
    input: {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.8)', // '#FBFBFB'
        fontSize: '1.5rem',
        border: 'solid 1px #EBEBEB',
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '0.5rem',
        boxSizing: 'border-box',
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
        fontSize: '1.15rem',
        color: '#FFFFFF',
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
        color: '#FFFFFF',
        fontSize: '1rem',
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
