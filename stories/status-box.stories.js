import StatusBox from '../app/components/status-box'

export default {
  component: StatusBox,
  args: {},
}

export const statusUndefined = { args: { subject: "This isn't defined." } }

export const statusError = {
  args: {
    status: 'error',
    subject: 'Oops!',
    description: 'You have an error!',
  },
}

export const statusDone = {
  args: {
    status: 'done',
    subject: 'Finished!',
    description: 'You are done!',
  },
}
export const statusWarn = {
  args: {
    status: 'warn',
    subject: 'Please Review',
    description: 'You are being warned!',
  },
}

export const statusNotice = {
  args: {
    status: 'notice',
    subject: 'Notice',
    description: 'You are being notified!',
  },
}
