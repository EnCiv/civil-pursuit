// https://github.com/EnCiv/civil-pursuit/issues/100
// https://github.com/EnCiv/civil-pursuit/issues/221
// https://github.com/EnCiv/civil-pursuit/issues/224

/* 
  Each element in the children array is a row,
  while each item in each subarray is a component. 

  Defaults to flex display and even spacing.
  Grouping items together will disable that and justify the row's content.

  Ex. children: [row1, row2] 

  row1 = [[item1, item2]] (nested array, items are all justified left or right)
  row2 = [item1, item2] (flat array, items are spaced evenly in parent's width)

  See stories in question-box.stories.jsx for examples.
*/

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Markdown from 'markdown-to-jsx'

const QuestionBox = props => {
  const { className = '', subject = '', description = '', contentAlign = 'center', tagline = '', children = [], ...otherProps } = props
  const classes = useStylesFromThemeFunction({ ...props, contentAlign })

  return (
    <div className={cx(classes.questionBox, className)} {...otherProps}>
      <div className={classes.topic}>
        {tagline && <div className={classes.fixedText}>{tagline}</div>}
        <h1 className={classes.subject}>{subject}</h1>
        <div className={classes.description}>
          <Markdown>{description}</Markdown>
        </div>
        <div className={classes.children}>
          {children?.map((row, rowIndex) => (
            <div key={rowIndex} className={classes.row}>
              {row.length
                ? row.map((item, itemIndex) => (
                    <div key={itemIndex} className={classes.item}>
                      {item}
                    </div>
                  ))
                : row}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  questionBox: {
    position: 'relative',
    borderRadius: '1.875rem',
    border: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    backgroundColor: 'rgba(235, 235, 235, 0.4)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: props => (props.contentAlign === 'center' ? 'center' : props.contentAlign === 'left' ? 'flex-start' : 'flex-end'),
    padding: '3.625rem 9.875rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '3.1875rem 1.5625rem',
      borderRadius: '0',
    },
  },

  topic: {
    textAlign: props => props.contentAlign,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  fixedText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '1.0625rem',
    lineHeight: '1.5625rem',
    letterSpacing: '0.01em',
    color: theme.colors.primaryButtonBlue,
    textAlign: props => props.contentAlign,
    whiteSpace: 'nowrap',
  },

  subject: {
    marginBlockStart: '0',
    marginBlockEnd: '0',
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: '3.75rem',
    lineHeight: '4.125rem',
    letterSpacing: '-0.03em',
    color: theme.colors.primaryButtonBlue,
    textAlign: props => props.contentAlign,
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '3rem',
      lineHeight: '3.3rem',
    },
  },

  description: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.primaryButtonBlue,
    textAlign: 'left',
  },
  children: {},
  row: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem 0',
  },
  item: {
    display: 'flex',
    flex: 1,
    gap: '1rem',
  },
}))

export default QuestionBox
