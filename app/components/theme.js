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
    encivGray: '#5D5D5C',
    inputBorder: '#EBEBEB',
    inputErrorBorder: '#BF1300',
    inputErrorContainer: '#F9E7E5',
    inputWordCount: '#5D5D5C',
    inputErrorWordCount: '#BF1300',
    cardOutline: '#FBFBFB',
    disableSecBorderGray: '#5D5D5C',
    disableTextBlack: '#343433',
    primaryButtonBlue: '#06335C',
    mouseDownPrimeBlue: '#01172C',
    hoverGray: '#B3B3B3',
    darkModeGray: '#343433',
    lightGray: '#F7F7F7',
    statusBadgeProgressBorder: '#EDBF01',
    statusBadgeProgressBackground: '#FFFAE8',
    statusBadgeCompletedBorder: '#005621',
    statusBadgeCompletedBackground: '#E6F3EB',
    statusBadgeInactiveBorder: '#EBEBEB',
    statusBadgeInactiveBackground: '#FFFFFF',
    statusBadgeErrorBorder: '#BF1300',
    statusBadgeErrorBackground: '#F9E7E5',
    inactiveGray: '#D9D9D9',
  },
  font: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    darkModeFont: '#FFFFFF',
  },
  border: {
    width: {
      thin: '0.0625rem'
    },
  },
  condensedWidthBreakPoint: '40rem',
  maxPanelWidth: '90rem',
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

Note that Theme.styles if outside of the Theme object. This works since we are exporting as default: the entire object and any changes
to it are exported as well.
*/
