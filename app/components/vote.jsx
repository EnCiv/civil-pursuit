'use strict';

import React                          from 'react';
import criteriaType                   from '../lib/proptypes/criteria';
import voteType                       from '../lib/proptypes/vote';
import itemType                       from '../lib/proptypes/item';
import Row                            from './util/row';
import Column                         from './util/column';

class Vote extends React.Component {

  item = {};

  total = null;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes  =   {
    criteria        :   criteriaType,
    vote            :   voteType,
    item            :   itemType
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleDescription (e) {
    let description = React.findDOMNode(this.refs.description);
    console.info("toggleDescription:", description, description.classList.toggle('syn-hide'));
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

    if ( this.total !== null && vote.total === this.total ) {
      return;
    }

    this.total = vote.total;

    if ( this.props.item && this.props.item._id !== this.item ) {
      this.item = this.props.item._id;
    }

    let svg = React.findDOMNode(this.refs.svg);

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
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { criteria, vote } = this.props;

    return (
      <div className="syn-votes-criteria" id={ `criteria-vote-${criteria._id}`}>
        <Row>
          <Column span="40">
            <h4 onClick={ this.toggleDescription.bind(this) }>{ criteria.name }</h4>
            <div className="syn-votes-criteria-description syn-hide" ref="description">
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
