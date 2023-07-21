'use strict'

import StaticProfileSelector from './lib/static-prof-selector'

export default class GunType extends StaticProfileSelector {
  name = 'gun_type'
  choices = ['Gun Rights Advocate', 'Gun Control Advocate']
}
