import DemInfo from '../app/components/dem-info';
import React from 'react';

export default {
    component: DemInfo,
    args: {}
}

export const Primary = { args: {
    user: {
        dob: new Date('1990-10-20'),
        state: 'NY',
        party: 'Independent'
      }
}}
