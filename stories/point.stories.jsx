import Point from '../app/components/point'

export default {
  component: Point,
  args: {
    subject: 'Phasellus diam sapien, placerat id sollicitudin eget',
    description:
      'Cras porttitor quam eros, vel auctor magna consequat vitae. Donec condimentum ac libero mollis tristique.',
  },
}

export const Primary = { args: { vState: 'default' } }
export const PrimaryMouseDown = { args: { vState: 'mouseDown' } }
export const PrimaryDisabled = { args: { vState: 'disabled' } }

// to do: implement test for clicking (mousedown)
// group stories
// better/more convetional names
