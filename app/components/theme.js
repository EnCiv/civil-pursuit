'use strict'

const Theme = {
  zIndexes: {
    menu: 10,
  },
  focusOutline: 'solid .3rem #DCE8F2',
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
    secondaryDivider: '#D9D9D9',
    statusBadgeProgressBorder: '#EDBF01',
    statusBadgeProgressBackground: '#FFFAE8',
    statusBadgeCompletedBorder: '#005621',
    statusBadgeCompletedBackground: '#E6F3EB',
    statusBadgeInactiveBorder: '#EBEBEB',
    statusBadgeInactiveBackground: '#FFFFFF',
    statusBadgeErrorBorder: '#BF1300',
    statusBadgeErrorBackground: '#F9E7E5',
    inactiveGray: '#D9D9D9',
    stepContainerActive: 'rgba(6, 51, 92, 0.10)',
    svgArrow: 'rgb(206, 206, 206)',
    transparent: 'transparent',
    tabSelected: '#DCE8F2',
  },
  font: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    darkModeFont: '#FFFFFF',
  },
  border: {
    width: {
      thin: '0.0625rem',
      thick: '0.125rem',
    },
  },
  condensedWidthBreakPoint: '40rem',
  maxPanelWidth: '78rem',
  boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.5rem rgba(217, 217, 217, 0.40)',
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
