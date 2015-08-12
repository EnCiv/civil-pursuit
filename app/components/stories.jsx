'use strict';

import React from 'react';
import Button from './util/button';

class Story extends React.Component {
  render () {
    return (
      <tr>
        <td><h4>{ this.props.pitch }</h4></td>
        <td>{ this.props.currently }</td>
      </tr>
    );
  }
}

class Stories extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      stories : []
    };

    this.get();

    this.listen();
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket
        .emit('get stories')
        .once('OK get stories', stories => this.setState({ stories }));
    }
  }

  listen () {
    if ( typeof window !== 'undefined' ) {
      window.socket
        .on('running story', storyId => {
          let { stories } = this.state;

          stories = stories.map(story => {
            if ( story._id === storyId ) {
              story.currently = 'running';
            }

            return story;
          });

          this.setState({ stories });
        })

        .on('ko story', storyId => {
          let { stories } = this.state;

          stories = stories.map(story => {
            if ( story._id === storyId ) {
              story.currently = 'failed';
            }

            return story;
          });

          this.setState({ stories });
        });
    }
  }

  run () {
    window.socket.emit('run story', this.state.stories);
  }

  render () {
    let { stories } = this.state;

    let rows = stories.map(story => ( <Story key={ story._id } { ...story } /> ));

    return (
      <section>
        <header><h1>Stories</h1></header>
        <table>
          <thead>
            <tr>
              <th><h3>Name</h3></th>
              <th><h3>Status</h3></th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </table>
        <Button primary large block onClick={ this.run.bind(this) }>
          Run
        </Button>
      </section>
    );
  }
}

export default Stories;
