import StatusBadge from '../app/components/status-badge';

export default {
    component: StatusBadge,
    args: {}
}

export const statusUndefined = { args: {}}

export const statusProgress = { args: {
    status: "Progress",
    name: "Unread",
}}

export const statusComplete = {
    args: {
        status: "Complete",
        name: "Complete"
    }
}

export const statusInactive = {
    args: {
        status: "Inactive",
        name: "Group, Inactive"
    }
}

export const statusError = {
    args: {
        status: "Error",
        name: "Most Important"
    }
}

export const statusProgressWithNumberZero = {
    args: {
        status: "Progress",
        name: "Unread",
        number: 0
    }
}

export const statusProgressWithNumberNotZero = {
    args: {
        status: "Progress",
        name: "Unread",
        number: 5
    }
}

export const statusCompleteWithNumberNotZero = {
    args: {
        status: "Complete",
        name: "Complete",
        number: 25
    }
}

export const statusInactiveWithNumberStringZero = {
    args: {
        status: "Inactive",
        name: "Group, Inactive",
        number: "0"
    }
}
