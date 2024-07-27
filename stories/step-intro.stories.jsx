import React from 'react'
import StepIntro from '../app/components/step-intro'
import { levelDecorator } from './common'

export default {
  title: 'StepIntro',
  component: StepIntro,
  decorators: [levelDecorator],
}

const Template = Component => args => <Component {...args} />

export const oneParagh = Template(StepIntro).bind({})
oneParagh.args = {
  style: {},
  className: '',
  subject: 'oneParagh',
  description:
    'fhnewoanho fdsiahfoivnd doivn difhnondo dsoinewo vndsoinoew do dsjafoimsalkifmoiewjvoindcoinvoiewnaoifmoli fneiudsahnbfindsoinfoie ndsiuanfiuwne  fndislknfoiw',
}

export const twoParagh = Template(StepIntro).bind({})
twoParagh.args = {
  style: {},
  className: '',
  subject: 'twoParagh',
  description:
    'fhnewoanho fdsiahfoivnd doivn difhnondo dsoinewo vndsoinoew do dsjafoimsalkifmoiewjvoindcoinvoiewnaoifmoli fneiudsahnbfindsoinfoie ndsiuanfiuwne  fndislknfoiw \\n foiehfoidniosafniouewnnfcndsioanfoiwe',
}
