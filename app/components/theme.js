'use strict'

const Theme = {
  // ui colors
  colors: {
    success: '#005621',
    lightSuccess: '#E6F3EB',
    white: '#FFF',
    borderGray: '#EBEBEB',
    textGray: '#1A1A1A',
    textBrown: '#403105',
    encivYellow: '#FFC315',
  },
  font: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
  },
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
