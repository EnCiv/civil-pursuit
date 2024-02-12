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
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Secondary Button"
};

export const Modifier = Template(ModifierButton).bind({});
Modifier.args = {
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Modifier Button"
};

export const Primary = Template(PrimaryButton).bind({});
Primary.args = {
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Primary Button"
};

export const Text = Template(TextButton).bind({});
Text.args = {
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Text Button"
};

export const HoverTest = Template(SecondaryButton).bind({});
HoverTest.args = {
    className: "hover",
    onDone: null,
    title: "Press me",
    disabled: false,
    disableOnClick: false,
    children: "Hover State Button"
};

export const LongPressTest = Template(SecondaryButton).bind({});
LongPressTest.args = {
    onDone: null,
    title: "Press me fdsaf fdasfds  ewfavdszvwea dafd adfgew vdfgreat fsdgaew",
    disabled: false,
    disableOnClick: false,
    children: "Hover State Button"
};