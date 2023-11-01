import React from 'react';
import  { Button, ModifierButton, SecondaryButton, PrimaryButton, TextButton } from '../app/components/button';

export default {
    title: "Button",
    component: Button,
}


const Template = (Component) => (args) => <Component {...args} />;

export const Base = Template(Button).bind({});
Base.args = {
    style: {},
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Base Button"
};

export const Secondary = Template(SecondaryButton).bind({});
Secondary.args = {
    style: {},
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Secondary Button"
};

export const Modifier = Template(ModifierButton).bind({});
Modifier.args = {
    style: {},
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Modifier Button"
};

export const Primary = Template(PrimaryButton).bind({});
Primary.args = {
    style: {},
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Primary Button"
};

export const Text = Template(TextButton).bind({});
Text.args = {
    style: {},
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Text Button"
};