import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { SecondaryButton, PrimaryButton, ModifierButton } from './button'
import QuestionBox from './question-box'
import Metadata from './metadata'
import StatusBadge from './status-badge'
import MyActivity from './my-activity'

function DiscussionTab(props) {
  const { className, ...otherProps } = props
  const classes = useStylesFromThemeFunction()
  const [currentView, setCurrentView] = useState('discussions')
  const [activityData, setActivityData] = useState({})
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null)
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.socket.emit('get-user-discussions', data => {
      if (data) {
        setDiscussions(data)
      }
      setLoading(false)
    })
  }, [])

  const handleCreateClick = () => {
    console.log('Create new discussion')
  }

  const handleMyActivityClick = discussionId => {
    // Check if we already have cached data for this discussion
    if (activityData[discussionId]) {
      setSelectedDiscussionId(discussionId)
      setCurrentView('activity')
      return
    }

    // Call the API to get activity data
    window.socket.emit('get-activity', discussionId, data => {
      if (data) {
        setActivityData(prev => ({ ...prev, [discussionId]: data }))
        setSelectedDiscussionId(discussionId)
        setCurrentView('activity')
      }
    })
  }

  const handleBackToDiscussions = () => {
    setCurrentView('discussions')
    setSelectedDiscussionId(null)
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
      {currentView === 'discussions' ? (
        <>
          <div className={classes.header}>
            <h1 className={classes.title}>Discussions</h1>
            <SecondaryButton onDone={handleCreateClick}>+ Create</SecondaryButton>
          </div>

          <div className={classes.discussionsList}>
            {loading ? (
              <div></div>
            ) : (
              discussions.map(discussion => {
                const metadataFields = [
                  { label: 'Your Last Activity', value: formatDate(discussion.userLastActivity) },
                  { label: 'Discussion Last Activity', value: formatDate(discussion.discussionLastActivity) },
                ]

                const participantsBadge = <StatusBadge name={`${discussion.participants || 0} participant${discussion.participants !== 1 ? 's' : ''}`} />

                const statusBadge = discussion.isComplete ? <StatusBadge name="Complete" status="Complete" /> : <StatusBadge name={`Round ${discussion.currentRound || 1}`} status="Progress" />

                const buttonsRow = discussion.isComplete ? (
                  <div className={classes.buttonsRow}>
                    <PrimaryButton onDone={() => console.log('View Summary', discussion._id)}>View Summary</PrimaryButton>
                    <SecondaryButton onDone={() => handleMyActivityClick(discussion._id)}>View My Activity</SecondaryButton>
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
              })
            )}
          </div>
        </>
      ) : (
        <MyActivity data={activityData[selectedDiscussionId]} onBackToDiscussions={handleBackToDiscussions} />
      )}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    padding: '2rem',
    margin: '0 auto',
    maxWidth: '75rem',
    fontFamily: theme.font?.fontFamily || 'Inter',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },

  title: {
    fontSize: '2.5rem',
    fontWeight: 300,
    color: theme.colors.title,
    margin: 0,
    fontFamily: theme.font?.fontFamily || 'Inter',
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
    backgroundColor: theme.colors?.white || '#FFF',
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
