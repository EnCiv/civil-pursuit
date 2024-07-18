// https://github.com/EnCiv/civil-pursuit/issues/47

'use strict'
import React from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';

function StatusBadge(props) {
    const { style = {}, className = "", name = "", status = "", number = undefined, ...otherProps } = props;
    const classes = useStyles();

    return (
        <span className={cx(classes.container, classes[status.toLowerCase()], className)} {...otherProps}>
            <span className={classes.status}>{name}</span>
            {
                number !== undefined && number !== null && (
                    <span className={classes.number}>{Number(number)}</span>
                )}
        </span>
    )
}

const useStyles = createUseStyles(theme => ({

    container: {
        borderRadius: '1rem',
        borderWidth: theme.border.width.thin,
        borderStyle: 'solid',
        padding: '0.375rem 0.625rem',
        fontFamily: theme.font.fontFamily,
    },
    status: {
        fontWeight: '300',
        lineHeight: '1.375rem',
    },
    number: {
        fontWeight: '600',
        lineHeight: '1.125rem',
        marginLeft: '1rem'
    },
    progress: {
        borderColor: theme.colors.statusBadgeProgressBorder,
        backgroundColor: theme.colors.statusBadgeProgressBackground,
    },
    complete: {
        borderColor: theme.colors.statusBadgeCompletedBorder,
        backgroundColor: theme.colors.statusBadgeCompletedBackground,
    },
    inactive: {
        borderColor: theme.colors.statusBadgeInactiveBorder,
        backgroundColor: theme.colors.statusBadgeInactiveBackground,
    },
    error: {
        borderColor: theme.colors.statusBadgeErrorBorder,
        backgroundColor: theme.colors.statusBadgeErrorBackground,
    }
}))

export default StatusBadge;
