// https://github.com/EnCiv/civil-pursuit/issues/XXX

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ShowDualPointList from './show-dual-point-list'
import HowYouRated from './how-you-rated'
import StatusBadge from './status-badge'

function MyActivity(props) {
  const { className, data = {}, ...otherProps } = props
  const classes = useStylesFromThemeFunction()

  const { subject, userResponse, rankCounts, userRanks = [] } = data

  // Process userRanks to extract points categorized by their 'post' ranking
  const processedRanks = {
    mosts: [],
    leasts: [],
  }

  userRanks.forEach(round => {
    round.forEach(entry => {
      if (entry.post === 'most') {
        processedRanks.mosts.push(entry.point)
      } else if (entry.post === 'least') {
        processedRanks.leasts.push(entry.point)
      }
    })
  })

  // Calculate percentages for rank counts
  const totalRanks = rankCounts ? rankCounts.mosts + rankCounts.leasts + rankCounts.neutrals : 0
  const percentages =
    totalRanks > 0
      ? {
          most: Math.round((rankCounts.mosts / totalRanks) * 100),
          least: Math.round((rankCounts.leasts / totalRanks) * 100),
          neutral: Math.round((rankCounts.neutrals / totalRanks) * 100),
        }
      : null

  return (
    <div className={cx(className)} {...otherProps}>
      {/* Header Section */}
      <div className={classes.headerContainer}>
        <h1 className={classes.pageHeader}>My Activity</h1>
        <div className={classes.breadcrumbs}>
          <a href="#" className={classes.breadcrumbLink}>
            Discussions
          </a>
          <span className={classes.breadcrumbSeparator}>&gt;</span>
          <span className={classes.breadcrumbCurrent}>My Activity</span>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className={classes.wrapper}>
        {/* First section: Prompt, Response, and Ratings */}
        {(subject || userResponse) && (
          <div className={classes.card}>
            {subject && (
              <div className={classes.subsection}>
                <h2 className={classes.promptHeader}>Prompt</h2>
                <p className={classes.promptText}>{subject}</p>
              </div>
            )}

            {userResponse && (
              <div className={classes.subsection}>
                <h2 className={classes.promptHeader}>Your Response</h2>
                <p className={classes.responseText}>{userResponse.description}</p>
              </div>
            )}

            {/* How others rated your response */}
            {percentages && (
              <div className={classes.ratingsSection}>
                <h3 className={classes.promptHeader}>How others rated your response</h3>
                <div className={classes.badgeContainer}>
                  <StatusBadge status="complete" name="Most Important" number={`${percentages.most}%`} />
                  <StatusBadge status="error" name="Least Important" number={`${percentages.least}%`} />
                  <StatusBadge status="inactive" name="Neutral" number={`${percentages.neutral}%`} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Second section: Participant's response to statement */}
        {(processedRanks.mosts.length > 0 || processedRanks.leasts.length > 0) && (
          <div className={classes.section}>
            <h2 className={classes.sectionHeader}>Participant's response to the statement</h2>
            <ShowDualPointList leftPoints={processedRanks.mosts} rightPoints={processedRanks.leasts} leftHeader="Why It's Most Important" rightHeader="Why It's Least Important" />
          </div>
        )}

        {/* Third section: How you rated */}
        {userRanks.length > 0 && (
          <div className={classes.section}>
            <HowYouRated entries={userRanks} />
          </div>
        )}
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingBottom: '2rem',
  },
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
  },
  pageHeader: {
    ...theme.font,
    fontWeight: '100',
    fontSize: '2.25rem', // 36px
    lineHeight: '2.9375rem', // 47px
    color: theme.colors.title,
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    paddingBottom: '0.5rem',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    ...theme.font,
    fontSize: '0.875rem',
    color: theme.colors.encivGray,
    paddingBottom: '0',
  },
  breadcrumbLink: {
    color: theme.colors.encivGray,
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  breadcrumbSeparator: {
    color: theme.colors.encivGray,
    padding: '0 0.25rem',
  },
  breadcrumbCurrent: {
    color: theme.colors.encivGray,
    fontWeight: '500',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    padding: '1.5rem',
    border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
    borderRadius: '0.5rem',
    backgroundColor: theme.colors.white,
    maxWidth: '38rem',
    alignSelf: 'flex-start',
    boxShadow: theme.boxShadowRightBottom,
  },
  subsection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  promptHeader: {
    ...theme.font,
    fontWeight: '600',
    fontSize: '1rem',
    color: theme.colors.title,
    margin: 0,
    marginBottom: '0rem',
    lineHeight: '1',
  },
  promptText: {
    ...theme.font,
    lineHeight: '1.5',
    color: theme.colors.title,
    margin: 0,
    marginBottom: '0rem',
  },
  sectionHeader: {
    ...theme.font,
    fontWeight: '600',
    lineHeight: '1.2',
    fontSize: '1.4rem',
    color: theme.colors.title,
    margin: 0,
    marginBottom: '0rem',
  },
  responseText: {
    ...theme.font,
    lineHeight: '1.5',
    color: theme.colors.title,
    margin: 0,
    marginBottom: '0rem',
  },
  ratingsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  ratingsHeader: {
    ...theme.font,
    fontWeight: '600',
    color: theme.colors.title,
    fontSize: '1.25rem',
    margin: 0,
  },
  badgeContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'nowrap',
  },
}))

export default MyActivity
