// https://github.com/EnCiv/civil-pursuit/issues/221

import React, { useContext } from 'react'
import StatusBadge from './status-badge'
import DeliberationContext from './deliberation-context'

const ParticipantsBadge = props => {
  const { className = '', minParticipants = 0, ...otherProps } = props
  const { data } = useContext(DeliberationContext)
  const participants = data?.participants
  const badgeName = `${participants || 0} participant` + (participants > 1 ? 's' : '')

  if (!participants || participants < minParticipants) {
    return null
  }

  return <StatusBadge name={badgeName} status="" className={className} {...otherProps} />
}

export default ParticipantsBadge
