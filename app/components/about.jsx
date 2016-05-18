'use strict';

import React from 'react';

class About extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    console.info("About:", this.props)
    return (
      <section>
        <h1>About</h1>
        <h2> "What's Wrong"</h2>
        <p> "You’re rational, good-natured, and you genuinely want to find the best solution,
         but politics has become too hostile, deceitful, and uncivilized that you about it. You care, but you’re disengaging because it’s futile and unhealthy."
         </p>
         <p> "You’re not alone, most people agree this country is heading in the wrong direction, and think we need big changes or a complete 
         government overhaul to fix it."
        </p>
      </section>
    );
  }
}

export default About;
