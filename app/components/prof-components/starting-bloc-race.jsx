'use strict'

import StaticProfileCheckbox from './lib/static-prof-checkbox'

export default class StartingBlocRace extends StaticProfileCheckbox {
  name = 'starting_bloc_race'
  choices = [
    { name: 'Black/African American' },
    { name: 'Native American/American Indian' },
    { name: 'Hispanic/Latino/Latinx' },
    { name: 'White/Caucasian' },
    { name: 'Biracial/Multiracial' },
    { name: 'Asian/Pacific Islander' },
    { name: 'Other' },
  ]
}
