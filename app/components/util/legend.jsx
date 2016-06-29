//this is based on http://www.reactexamples.com/react-bar-chart/ with credit and gratitude
'use strict';

import React from 'react';

class Legend extends React.Component {
  render() {
    var labels = this.props.labels,
      colors = this.props.colors;

    return (
    <div className="Legend">
      { labels.map(function(label, labelIndex) {
        return (
        <div>
          <span className="Legend--color" style={{ backgroundColor: colors[labelIndex % colors.length]  }} />
          <span className="Legend--label">{ label }</span>
        </div>
        );
      }) }
    </div>
    );
  }
};

export default Legend;
