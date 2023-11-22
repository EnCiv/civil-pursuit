'use strict'

const Theme = {
  // ui colors
  colors: {
    success: '#005621',
    lightSuccess: '#E6F3EB',
    white: '#FFF',
    borderGray: '#EBEBEB',
    title: '#1A1A1A',
    textBrown: '#403105',
    encivYellow: '#FFC315',
    disableSecBorderGray: '#5D5D5C',
    disableTextBlack: '#343433',
    primaryButtonBlue: '#06335C',
    mouseDownPrimeBlue: '#01172C',
  },
  font: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
  },
  condensedWidthBreakPoint: '50rem',
  enCivUnderline: {
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.26rem',
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

Note that Theme.styles is outside of the Theme object. This works since we are exporting as default: the entire object and any changes 
to it are exported as well.
*/
