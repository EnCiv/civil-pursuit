// https://github.com/EnCiv/civil-pursuit/issues/XXX

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { SecondaryButton, PrimaryButton, ModifierButton } from './button'
import QuestionBox from './question-box'
import Metadata from './metadata'
import StatusBadge from './status-badge'

function DiscussionTab(props) {
  const { className, discussions = [], ...otherProps } = props
  const classes = useStylesFromThemeFunction()

  const handleCreateClick = () => {
    console.log('Create new discussion')
  }

  const formatDate = dateString => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <div className={classes.header}>
        <h1 className={classes.title}>Discussions</h1>
        <SecondaryButton onDone={handleCreateClick}>+ Create</SecondaryButton>
      </div>

      <div className={classes.discussionsList}>
        {discussions.map(discussion => {
          const metadataFields = [
            { label: 'Created', value: formatDate(discussion.created) },
            { label: 'Last Accessed', value: formatDate(discussion.lastAccessed) },
            { label: 'Last Active', value: formatDate(discussion.lastActive) },
          ]

          const participantsBadge = <StatusBadge name={`${discussion.participants || 0} participant${discussion.participants !== 1 ? 's' : ''}`} />

          const statusBadge = discussion.isComplete ? <StatusBadge name="Complete" status="Complete" /> : <StatusBadge name={`Round ${discussion.currentRound || 1}`} status="Progress" />

          const buttonsRow = discussion.isComplete ? (
            <div className={classes.buttonsRow}>
              <PrimaryButton onDone={() => console.log('View Summary', discussion._id)}>View Summary</PrimaryButton>
              <SecondaryButton onDone={() => console.log('View My Activity', discussion._id)}>View My Activity</SecondaryButton>
            </div>
          ) : (
            <div className={classes.buttonsRow}>
              <ModifierButton onDone={() => console.log('Continue', discussion._id)}>Continue</ModifierButton>
            </div>
          )

          return (
            <div key={discussion._id} className={classes.discussionItem}>
              <Metadata
                title="View Dates"
                data={metadataFields}
                child={
                  <div className={classes.compactQuestionBox}>
                    <QuestionBox subject={discussion.subject} description={discussion.description} contentAlign="left" compact={true}>
                      <div className={classes.badgesRow}>
                        {participantsBadge}
                        {statusBadge}
                      </div>
                      {buttonsRow}
                    </QuestionBox>
                  </div>
                }
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    padding: '2rem',
    margin: '0 auto',
    maxWidth: '75rem',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },

  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: theme.colors.title,
    margin: 0,
  },

  discussionsList: {
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(25rem, 1fr))',
  },

  discussionItem: {
    display: 'flex',
    flexDirection: 'column',
  },

  compactQuestionBox: {
    // QuestionBox now has responsive styling built-in
  },

  badgesRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },

  buttonsRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    width: '100%',
    '& > *': {
      flex: 1,
    },
  },
}))

export default DiscussionTab
