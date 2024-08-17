import StatusBox from '../app/components/status-box'

export default {
  component: StatusBox,
  args: {},
}

export const statusUndefined = { args: {} }

export const statusError = {
  args: {
    status: 'error',
    subject: 'You have an error!',
  },
}

export const statusDone = {
  args: {
    status: 'done',
    subject: 'You are done!',
  },
}
export const statusWarn = {
  args: {
    status: 'warn',
    subject: 'You are being warned!',
  },
}

export const statusNotice = {
  args: {
    status: 'notice',
    subject: 'You are being notified!',
  },
}
