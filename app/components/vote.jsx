'use strict';

import React                          from 'react';
import criteriaType                   from '../lib/proptypes/criteria';
import voteType                       from '../lib/proptypes/vote';
import itemType                       from '../lib/proptypes/item';
import Row                            from './util/row';
import Column                         from './util/column';

class Vote extends React.Component {

  state = { 
      itemId: null,
      total: null
  };

  constructor (props) {
    super(props);

  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes  =   {
    criteria        :   criteriaType,
    vote            :   voteType,
    item            :   itemType
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleDescription (e) {
    console.info("toggleDescription", this, e);
    let d = React.findDOMNode(this.description);
    console.info("toggleDescription:", this.description, d.classList.toggle('syn-hide'));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    this.makeChart();
  }

  componentDidUpdate () {
    this.makeChart();
  }

  makeChart () {

    let { criteria, vote, item } = this.props;

    console.info("makeChart:",this);

    if ( ! vote ) {
      vote = {
        values    : {
          '-1'    : 0,
          '0'     : 0,
          '1'     : 0
        },
        total: 0
      };
    }

    if ( this.state.total !== null && vote.total === this.state.total ) {
      return;
    }

    this.state.total = vote.total;

    if ( this.props.item && this.props.item._id !== this.state.itemId ) {
      this.state.itemId = this.props.item._id;
    }

    let svg = React.findDOMNode(this.refs.svg);

    console.info("makeChart svg", svg);

    svg.id = `chart-${item._id}-${criteria._id}`;

    let data = [];

    for ( let number in vote.values ) {
      data.push({
        label: 'number',
        value: vote.values[number] * 100 / vote.total
      });
    }

    let columns = [`${vote.total} vote(s)`];

    data.forEach(function (d) {
      columns.push(d.value);
    });

    console.info("makeChart:",columns)

{/* comment this out for now so we can see if this is what's messing things up. 

    let chart = c3.generate({
      bindto        :   '#' + svg.id,
      data          :   {
        x           :   'x',
        columns     :   [['x', -1, 0, 1], columns],
        type        :   'bar'
      },
      grid          :   {
        x           :   {
          lines     :   3
        }
      },
      axis          :   {
        x           :   {},
        y           :   {
          max       :   90,
          show      :   false,
          tick      :   {
            count   :   5,
            format  :   function (y) {
              return y;
            }
          }
        }
      },
      size          :   {
        height      :   80
      },
      bar           :   {
        // width       :   $(window).width() / 5
      }
    });
*/}

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { criteria, vote } = this.props;

    return (
      <div className="syn-votes-criteria" id={ `criteria-vote-${criteria._id}`}>
        <Row>
          <Column span="40">
            <h4 onClick={ this.toggleDescription.bind(this) }>{ criteria.name }</h4>
            <div className="syn-votes-criteria-description syn-hide" ref={(ref) => this.description = ref}>
              <h5>{ criteria.description }</h5>
            </div>
          </Column>

          <Column span="60">
            <svg className="chart" ref="svg"></svg>
          </Column>
        </Row>
      </div>
    );
  }
}

export default Vote;
