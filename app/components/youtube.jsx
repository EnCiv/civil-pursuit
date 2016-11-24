'use strict';

import React                  from 'react';
import itemType               from '../lib/proptypes/item';

class YouTube extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    item : itemType
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state= { vHeight: 0,
            vWidth: 0
  };

  static isYouTube (item) {
    let is = false;

    let references = item.references || [];

    if ( references.length ) {
      let url = references[0].url;

      if ( YouTube.regex.test(url) ) {
        is = true;
      }
    }

    return is;
  }

  componentDidMount() {
    let container=this.refs.container;
    if(!(container.clientHeight && container.clientWidth) ) { return }
    let vHeight = container.clientHeight;
    let vWidth = container.clientWidth;
    this.setState({vHeight: vHeight, vWidth: vWidth});
  }

  componentDidUpdate() {
    let container=this.refs.container;
    if(!(container.clientHeight && container.clientWidth) ) { return }
    let vHeight = container.clientHeight;
    let vWidth = container.clientWidth;
    if(vHeight!== this.state.vHeight || vWidth !== this.state.vWidth )){
      this.setState({vHeight: vHeight, vWidth: vWidth});
    }
    let bS=0.15; //button Scale not what you were thinking
    let player=this.refs.player;
    let playerButton=player.getElementsByClassName("ytp-icon-large-play-button-hover");
    console.info("found the youtube play button element");
    if (playerButton.length !== 1 ) { console.info("youtube.jsx Youtube has changed the player", playerButton.length ); return }
    playerButton[0].style.width= (vWidth * bS) + 'px';
    playerButton[0].style.height= (vHeight * bS) + 'px';
    playerButton[0].style.backgroundSize= (718 * bS)+'px '+(2186 * bS)+'px';
    playerButton[0].style.background =  "no-repeat url(//s.ytimg.com/yts/imgbin/player-cougar-2x-vfldumApe.png) "+(-230*bS)+'px'+(-804*bS)+'px';
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static getId (url) {
    let youTubeId;

    url.replace(YouTube.regex, (m, v) => youTubeId = v);

    return youTubeId;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { item } = this.props;

    let { url } = item.references[0];

    let youTubeId = YouTube.getId(url);

    return (
      <div className="video-container" ref="container">
        <iframe ref="player" id="ytplayer" modestbranding="1" controls="0" modestbranding="1" showinfo="0" type="text/html" allowFullScreen frameBorder="0" width={this.state.vWidth ? this.state.vWidth : "192"} height={ this.state.vHeight ? this.state.vHeight : "108" } 
         src={ `http://www.youtube.com/embed/${youTubeId}?autoplay=0` }>
        </iframe>
      </div>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

export default YouTube;
