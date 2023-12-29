import StatusBadge from '../app/components/status-badge';

export default {
    component: StatusBadge,
    args: {}
}

export const statusUndefined = { args: {}}

export const statusProgress = { args: {
    status: "Progress"
}}

export const statusComplete = {
    args: {
        status: "Complete"
    }
}

export const statusInactive = {
    args: {
        status: "Inactive"
    }
}

export const statusError = {
    args: {
        status: "Error"
    }
}

export const statusProgressWithNumberZero = {
    args: {
        status: "Progress",
        number: 0
    }
}

export const statusProgressWithNumberNotZero = {
    args: {
        status: "Progress",
        number: 5
    }
}

export const statusCompleteWithNumberNotZero = {
    args: {
        status: "Complete",
        number: 25
    }
}

export const statusInactiveWithNumberStringZero = {
    args: {
        status: "Inactive",
        number: "0"
    }
}
