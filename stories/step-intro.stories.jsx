import React from 'react';
import  { StepIntro } from '../app/components/step-intro';

export default {
    title: "StepIntro",
    component: StepIntro,
}


const Template = (Component) => (args) => <Component {...args} />;

export const oneParagh = Template(StepIntro).bind({});
oneParagh.args = {
    style: {},
    className: "",
    subject: "test1",
    description: "fhnewoanho fdsiahfoivnd doivn difhnondo dsoinewo vndsoinoew do",
};
