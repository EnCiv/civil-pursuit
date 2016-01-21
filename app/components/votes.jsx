'use strict';

import React                    from 'react';
import Row                      from './util/row';
import Column                   from './util/column';
import criteriaType             from '../lib/proptypes/criteria';
import voteType                 from '../lib/proptypes/vote';
import itemType                 from '../lib/proptypes/item';
import Vote                     from './vote';

class Votes extends React.Component {
  static propTypes = {
    criterias : React.PropTypes.arrayOf(criteriaType),
    votes : React.PropTypes.arrayOf(voteType),
    item : itemType
  }

  render () {

    console.log('R', 'votes', this.props);

    const { criterias, votes, item } = this.props;

    let sliders;

    if ( item ) {
      sliders = criterias.map(criteria => (
        <Vote
          criteria    =   { criteria }
          vote        =   { votes[criteria._id] }
          key         =   { criteria._id }
          item        =   { item } />
      ));
    }

    return (
      <div className="syn-sliders">
        { sliders }
      </div>
    );
  }
}

export default Votes;
