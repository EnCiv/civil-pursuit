import React, { useCallback, useState } from 'react'
import { Button, ModifierButton, SecondaryButton, PrimaryButton, TextButton } from '../app/components/button'
import expect from 'expect'
import { userEvent, within } from '@storybook/test'
import { onDoneDecorator, onDoneResult } from './common'

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
  value:'create',
  children: `Create, Hover`,
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
