'use strict'

const Theme = {
  // ui colors
  colors: {
    success: '#005621',
    lightSuccess: '#E6F3EB',
    white: '#FFF',
    black: '#000',
    borderGray: '#EBEBEB',
    title: '#1A1A1A',
    textPrimary: '#000000',
    textBrown: '#403105',
    encivYellow: '#FFC315',
    hoverGray: '#B3B3B3',
  },
  font: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
  },
  condensedWidthBreakPoint: '40rem',
  maxPanelWidth: '90rem',
}

export default Theme

// NOTES:
/* 
If you try to reference the theme object within itself, storybook may complain about circular references. Here is an example of a
proper format for doing so:

Theme = {
    ...theme content
}

Theme.styles = {
    primary: { color: Theme.colors.primary },
};

Note that Theme.styles if outside of the Theme object. This works since we are exporting as default: the entire object and any changes 
to it are exported as well.
*/
