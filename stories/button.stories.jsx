import React, { useCallback, useState } from 'react'
import { Button, ModifierButton, SecondaryButton, PrimaryButton, TextButton } from '../app/components/button'
import expect from 'expect'
import { userEvent, within } from '@storybook/test'
import { onDoneDecorator, onDoneResult } from './common'
import SvgPlusSign from '../app/svgr/plus-sign'

export default {
  title: 'Button',
  component: Button,
  decorators: [onDoneDecorator],
}

const Template = Component => args => <Component {...args} />

export const Base = Template(Button).bind({})
Base.args = {
  style: {},
  onDone: null,
  title: 'Press me',
  disabled: false,
  disableOnClick: false,
  children: 'Base Button',
}

export const Secondary = Template(SecondaryButton).bind({})
Secondary.args = {
  onDone: null,
  title: 'Press me',
  disabled: false,
  disableOnClick: false,
  children: 'Secondary Button',
}

export const Modifier = Template(ModifierButton).bind({})
Modifier.args = {
  onDone: null,
  title: 'Press me',
  disabled: false,
  disableOnClick: false,
  children: 'Modifier Button',
}

export const Primary = Template(PrimaryButton).bind({})
Primary.args = {
  onDone: null,
  title: 'Press me',
  disabled: false,
  disableOnClick: false,
  children: 'Primary Button',
}

export const Text = Template(TextButton).bind({})
Text.args = {
  onDone: null,
  title: 'Press me',
  disabled: false,
  disableOnClick: false,
  children: 'Text Button',
}

export const HoverTest = Template(SecondaryButton).bind({})
HoverTest.args = {
  className: 'hover',
  onDone: null,
  title: 'Press me',
  disabled: false,
  disableOnClick: false,
  children: 'Hover State Button',
}

export const LongPressTest = Template(SecondaryButton).bind({})
LongPressTest.args = {
  onDone: null,
  title: 'Press me fdsaf fdasfds  ewfavdszvwea dafd adfgew vdfgreat fsdgaew',
  disabled: false,
  disableOnClick: false,
  children: 'Hover State Button',
}
export const CreateHoverTest = Template(SecondaryButton).bind({})
CreateHoverTest.args = {
  className: 'createhover',
  onDone: null,
  title: 'Press me',
  disabled: false,
  disableOnClick: false,
  value: 'create',
  children: (
    <>
      {' '}
      <SvgPlusSign width="2rem" height="1rem" />
      Create, Hover{' '}
    </>
  ),
}
export const OnDoneClicked = {
  args: {
    style: {},
    onDone: null,
    title: 'Press me',
    disabled: false,
    disableOnClick: false,
    children: 'Click Here',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Click Here/i }))
    let result = onDoneResult(canvas)
    expect(result.count).toEqual(1)
  },
}

export const BaseFocus = {
  args: {
    style: {},
    onDone: null,
    title: 'Press me',
    disabled: false,
    disableOnClick: false,
    children: 'Base Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
  },
}

export const SecondaryFocus = {
  args: {
    onDone: null,
    title: 'Press me',
    disabled: false,
    disableOnClick: false,
    children: 'Secondary Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
  },
}

export const ModifierFocus = {
  args: {
    onDone: null,
    title: 'Press me',
    disabled: false,
    disableOnClick: false,
    children: 'Modifier Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
  },
}

export const PrimaryFocus = {
  args: {
    onDone: null,
    title: 'Press me',
    disabled: false,
    disableOnClick: false,
    children: 'Primary Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
  },
}

export const TextFocus = {
  args: {
    onDone: null,
    title: 'Press me',
    disabled: false,
    disableOnClick: false,
    children: 'Text Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
  },
}

export const HoverTestFocus = {
  args: {
    className: 'hover',
    onDone: null,
    title: 'Press me',
    disabled: false,
    disableOnClick: false,
    children: 'Hover State Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
  },
}

export const DeferredClickAfterBlur = () => {
  const [inputValue, setInputValue] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [clickCount, setClickCount] = useState(0)

  const handleInputChange = e => {
    const value = e.target.value
    setInputValue(value)
  }

  const handleInputBlur = () => {
    // Simulate validation on blur - enable button if input has content
    if (inputValue.trim().length > 0) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }

  const handleButtonClick = useCallback(() => {
    setClickCount(prev => prev + 1)
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Deferred Click After Input Blur Test</h3>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Type something..."
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          style={{
            padding: '0.5rem',
            marginRight: '1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '0.25rem',
          }}
        />
        <PrimaryButton disabled={buttonDisabled} onDone={handleButtonClick}>
          Submit
        </PrimaryButton>
      </div>
      <div>
        <strong>Button Status:</strong> {buttonDisabled ? 'Disabled' : 'Enabled'}
      </div>
      <div>
        <strong>Click Count:</strong> {String(clickCount)}
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.25rem' }}>
        <strong>Test Instructions:</strong>
        <ol>
          <li>Type some text in the input field</li>
          <li>While the input is still focused, click the Submit button</li>
          <li>The button should be initially disabled but become enabled after blur</li>
          <li>The onClick handler should execute automatically, incrementing the click count</li>
        </ol>
      </div>
    </div>
  )
}

export const DeferredClickAfterBlurInteractive = {
  render: () => <DeferredClickAfterBlur />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait a moment for component to fully render with initial state
    await new Promise(resolve => setTimeout(resolve, 50))

    const input = canvas.getByPlaceholderText('Type something...')
    const button = canvas.getByRole('button', { name: /Submit/i })

    // Initial state - button should be disabled
    expect(button.getAttribute('aria-disabled')).toEqual('true')

    // Verify click count starts at 0 by checking the full text pattern
    expect(canvasElement.textContent).toMatch(/Click Count:\s*0/)

    // Type in input
    await userEvent.type(input, 'test input')

    // Verify button is still disabled after typing
    expect(button.getAttribute('aria-disabled')).toEqual('true')

    // Click button while input still has focus
    // This simulates clicking the button which triggers blur on the input
    await userEvent.click(button)

    // After blur, button should become enabled and onClick should fire
    // Wait for React state updates and deferred click execution
    await new Promise(resolve => setTimeout(resolve, 200))

    // Button should now be enabled
    expect(button.getAttribute('aria-disabled')).toEqual('false')

    // Click count should have incremented from the deferred click
    expect(canvasElement.textContent).toMatch(/Click Count:\s*1/)
  },
}

export const DeferredClickAfterBlurKeyboard = {
  render: () => <DeferredClickAfterBlur />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Type something...')
    const button = canvas.getByRole('button', { name: /Submit/i })

    // Initial state - button should be disabled
    expect(button.getAttribute('aria-disabled')).toEqual('true')

    // Verify click count starts at 0
    expect(canvasElement.textContent).toMatch(/Click Count:\s*0/)

    // Click in input to focus it
    await userEvent.click(input)

    // Type in input
    await userEvent.keyboard('test keyboard')

    // Verify button is still disabled after typing
    expect(button.getAttribute('aria-disabled')).toEqual('true')

    // Tab to the button (this triggers blur on input and should enable button)
    await userEvent.tab()

    // At this point blur has fired and button should be becoming enabled
    // But there might be a race condition with focus
    // Wait a bit for state updates
    await new Promise(resolve => setTimeout(resolve, 150))

    // Button should now be enabled
    expect(button.getAttribute('aria-disabled')).toEqual('false')

    // Press space to activate the button
    await userEvent.keyboard(' ')

    // Wait for the click handler to execute
    await new Promise(resolve => setTimeout(resolve, 100))

    // Click count should have incremented
    expect(canvasElement.textContent).toMatch(/Click Count:\s*1/)
  },
}

export const DisabledButtonClickIgnored = () => {
  const [clickCount, setClickCount] = useState(0)

  const handleButtonClick = useCallback(() => {
    setClickCount(prev => prev + 1)
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Disabled Button Click Test</h3>
      <p>This button is disabled. Clicking it should not increment the click count.</p>
      <div style={{ marginBottom: '1rem' }}>
        <PrimaryButton disabled={true} onDone={handleButtonClick}>
          Disabled Button
        </PrimaryButton>
      </div>
      <div>
        <strong>Click Count:</strong> {String(clickCount)}
      </div>
    </div>
  )
}

export const DisabledButtonClickIgnoredInteractive = {
  render: () => <DisabledButtonClickIgnored />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait a moment for component to fully render
    await new Promise(resolve => setTimeout(resolve, 50))

    const button = canvas.getByRole('button', { name: /Disabled Button/i })

    // Button should be disabled
    expect(button.getAttribute('aria-disabled')).toEqual('true')

    // Verify click count starts at 0
    expect(canvasElement.textContent).toMatch(/Click Count:\s*0/)

    // Click the disabled button
    await userEvent.click(button)

    // Wait a bit for any potential state updates
    await new Promise(resolve => setTimeout(resolve, 100))

    // Click count should still be 0 (click was ignored)
    expect(canvasElement.textContent).toMatch(/Click Count:\s*0/)

    // Button should still be disabled
    expect(button.getAttribute('aria-disabled')).toEqual('true')
  },
}
