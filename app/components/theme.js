'use strict'

const Theme = {
  zIndexes: {
    menu: 10,
  },
  focusOutline: 'solid .3rem #DCE8F2',
  focusOutlineSignUp: 'solid .125rem #06335C',
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
    encivYellowBright: '#FFDA66',
    encivYellowLight: '#FFE8A6',
    encivGray: '#5D5D5C',
    encivBlue: '#06335C',
    lightModeColor: '#FFFFFF',
    disableGray: '#999999',
    textSecondary: '#5D5D5C',
    colorPrimary: '#06335C',
    navText: '#1A1A1A',
    navSurface: '#F5F4F48D',
    navHover: 'rgba(235, 234, 234, 0.61)',
    inputBorder: '#EBEBEB',
    inputErrorBorder: '#BF1300',
    inputErrorContainer: '#F9E7E5',
    inputWordCount: '#999999',
    inputErrorWordCount: '#BF1300',
    cardOutline: '#FBFBFB',
    disableSecBorderGray: '#5D5D5C',
    disableTextBlack: '#343433',
    primaryButtonBlue: '#06335C',
    inputFieldPlaceholder: '#1A1A1A4D',
    passwordInputPlaceholder: '#0A0A0AB3',
    mouseDownPrimeBlue: '#01172C',
    hoverGray: '#B3B3B3',
    darkModeGray: '#343433',
    lightGray: '#F7F7F7',
    secondaryDivider: '#D9D9D9',
    statusBadgeProgressBorder: '#EDBF01',
    statusBadgeProgressBackground: '#FFFAE8',
    statusBadgeProgressTextColor: '#342A00',
    statusBadgeCompletedBorder: '#005621',
    statusBadgeCompletedBackground: '#E6F3EB',
    statusBadgeCompletedTextColor: '#005621',
    statusBadgeInactiveBorder: '#EBEBEB',
    statusBadgeInactiveBackground: '#FFFFFF',
    statusBadgeResponseColor: '#5D5D5C',
    statusBadgeErrorBorder: '#BF1300',
    statusBadgeErrorBackground: '#F9E7E5',
    statusBadgeErrorTextColor: '#BF1300',
    rankInvalidBorder: ' #590900',
    rankInvalidText: '#BF1300',
    statusBoxErrorBackground: '#F9E7E5',
    statusBoxErrorBorder: '#BF1300',
    statusBoxDoneBackground: '#E6F3EB',
    statusBoxDoneBorder: '#005621',
    statusBoxWarnBackground: '#FFF3D0',
    statusBoxWarnBorder: '#EBDCB3',
    statusBoxNoticeBackground: '#DCE8F2',
    statusBoxNoticeBorder: '#ACC2E2',
    roundTrackerBackground: '#FDFDFD',
    inactiveGray: '#D9D9D9',
    stepContainerActive: 'rgba(6, 51, 92, 0.10)',
    svgArrow: 'rgb(206, 206, 206)',
    transparent: 'transparent',
    tabSelected: '#DCE8F2',
    pointDefault: '#FFFFFF',
    focusRing: 'rgba(74, 144, 226, 0.2)',
    radioButtonSelected: '#08447B',
    radioButtonUnselected: '#5D5D5C',
    wordCount: '#999999',
    lightBlueBackground: '#E7EDF2',
    lightGrayBackground: '#F9F9F9',
    veryLightGrayBackground: '#fafafa',
  },
  font: {
    fontFamily: 'Inter',
    headingFontFamily: 'Newsreader',
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
  maxPanelWidth: '70rem',
  motion: {
    instant: '1ms',
    fast: '160ms',
    form: '180ms',
    press: '120ms',
    short: '220ms',
    entrance: '280ms',
    carousel: '320ms',
    reveal: '420ms',
    intro: '520ms',
    swipe: '500ms',
    menu: '400ms',
    standardEase: 'ease',
    enterEase: 'ease-out',
    exitEase: 'ease-in',
    carouselEase: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    introEase: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
  },
  boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.5rem rgba(217, 217, 217, 0.40)',
  boxShadowRightBottom: '0.1875rem 0.1875rem 0.3125rem rgba(0, 0, 0, 0.05)',
  boxShadowSmall: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.12)',
  boxShadowMedium: '0 0.5rem 1rem rgba(0, 0, 0, 0.2)',
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
