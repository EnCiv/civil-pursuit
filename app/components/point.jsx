// https://github.com/EnCiv/civil-pursuit/issues/23

'use strict'
import React from 'react'
import cx from 'classnames'
import insertSheet from 'react-jss'

function Point(props) {
  const { subject, description, vState, children, styles, classname, classes, ...otherProps } = props

  return (
    <>
      <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />

      <div className={cx(classes.unselectedBorder)}>
        <div className={cx(classes.commonStyles)}>
          <div className={cx(classes.moreCommonStyles)}>
            <div className={cx(classes.title)}>Phasellus diam sapien, placerat id sollicitudin eget</div>
            <div className={cx(classes.description)}>
              Cras porttitor quam eros, vel auctor magna consequat vitae. Donec condimentum ac libero mollis tristique.
            </div>
            <div>
              DemInfo | Component
              {/* <DemInfo {...otherProps} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const pointStyles = {
  commonStyles: {
    display: 'flex',
    // width: '33.5625rem',
    padding: '2.1875rem 1.875rem',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.625rem',
  },
  moreCommonStyles: {
    display: 'flex',
    // height: '8.125rem',
    // padding: var(--Response-Selected, 0px);
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.9375rem',
    alignSelf: 'stretch',
  },
  unselectedBorder: {
    borderRadius: '0.9375rem',
    border: '1px solid #EBEBEB',
    background: '#FFF',
    maxWidth: '33.5625rem',
    /* Card Shadow - Desktop */
    boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.5rem rgba(217, 217, 217, 0.40)',
  },
  title: {
    color: '#1A1A1A',
    /* h3 */
    fontFamily: 'Inter',
    fontSize: '1.25rem',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '1.875rem',
  },
  description: {
    alignSelf: 'stretch',
    color: '#1A1A1A',
    /* h3 */
    fontFamily: 'Inter',
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '1.5rem',
  },
}

export default insertSheet(pointStyles)(Point)

//notes:
// use variables for the css. ex: border color?
// note that certain things will change based on input, example the border of moreCommonStyles. look into vars on figma
// need better solution for importing the font
// the box shadow looks a lot bigger in the story than it does in the figma. I think this is becasue the figma background is slightly gray, making the border blend, and therefore seem smaller.
// That being said, maybe we should decrease the box shadow? looks a bit big against the white background
