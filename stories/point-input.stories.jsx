import PointInput from '../app/components/point-input'
import { onDoneDecorator, onDoneResult } from './common'
import expect from 'expect'
import { userEvent, within, waitFor } from '@storybook/testing-library'

export default {
  component: PointInput,
  args: {},
  decorators: [onDoneDecorator],
}

export const defaultValueUndefined = { args: {} }

export const defaultValueEmpty = {
  args: {
    value: {},
  },
}

export const descriptionFieldGrowthWordCountOK = {
  args: {
    value: {
      description:
        'Risuspretiumquam vulputatedignissim suspendissein. Metusvulputateeuscelerisquefelis imperdietproinfermentumleo. Hachabitasseplatea dictumst quisque. Nibhsedpulvinarproin. Loremipsumdolorsit amet, consecteturadipiscingeliseddoeiusmodtempor incididunt ut labore etdolore magnaaliqua. Utenimadminimveniamquisnostrud exercitationullamcolaborisnisutaliquipcommodo consequat. Risuspretiumquamvulputatedignissim suspendissein est ante in. Metusvulputateeu imperdietproinfermentumleo. Hachabitasseplatea. Consecteturadipiscingeliseddoeiusmodtempor incididunt.',
    },
  },
}

export const descriptionFieldErrorTooMuchText = {
  args: {
    value: {
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Purus sit amet volutpat consequat mauris. Faucibus pulvinar elementum integer enim neque volutpat. Leo in vitae turpis massa sed elementum tempus egestas sed. Volutpat consequat mauris nunc congue nisi vitae suscipit. Egestas tellus rutrum tellus pellentesque eu. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Tincidunt dui ut ornare lectus sit amet est placerat in. Bibendum arcu vitae elementum curabitur vitae nunc sed velit.',
      subject: 'Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet.',
    },
  },
}

export const subjectFieldErrorTooMuchText = {
  args: {
    value: {
      subject:
        'Pellentesque habitant morbi tristique senectus et. Eu scelerisque felis imperdiet proin fermentum leo vel orci porta. Orci eu lobortis elementum nibh tellus molestie nunc. Vel turpis nunc eget lorem dolor sed. Leo vel orci porta non pulvinar neque laoreet.',
    },
  },
}

export const onDoneTest = {
  args: { value: {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const subjectEle = canvas.getByPlaceholderText(/type some thing here/i)
    const descriptionEle = canvas.getByPlaceholderText(/description/i)
    await userEvent.type(subjectEle, 'This is the subject')
    await userEvent.tab() // moving out of the input field causes onDone to be called
    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: { valid: false, value: { subject: 'This is the subject' } },
      })
    )
    await userEvent.type(descriptionEle, 'This is the detailed description')
    await userEvent.tab() // moving out of the input field causes onDone to be called
    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: true,
          value: {
            subject: 'This is the subject',
            description: 'This is the detailed description',
          },
        },
      })
    )
  },
}
