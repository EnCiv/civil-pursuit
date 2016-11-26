'use strict';

import React                  from 'react';
import itemType               from '../lib/proptypes/item';

class YouTube extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    item : itemType
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static loadedYouTube=false;

  static initYoutube {
   var tag = document.createElement('script');
   tag.src = "http://www.youtube.com/player_api";
   var firstScriptTag = document.getElementsByTagName('script')[0];
   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  static onYouTubePlayerAPIReady() {
    loadedYouTube=true;
    console.info("youtube player loaded");
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  constructor(props){
        super(props);
        let { item } = this.props;
        let { url } = item.references[0];
        this.youTubeId = YouTube.getId(url);

        if(!loadedYouTube){ 
          initYouTube(); 
        }
  }

  state= { vHeight: 0,
            vWidth: 0
  };

  player=null;

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
    if(!(container.clientHeight && container.clientWidth) ) { console.info("youtube did mount, no size yet"); return }
    let vHeight = container.clientHeight;
    let vWidth = container.clientWidth;
    this.player = new YT.Player(`ytplayer-${this.props.item._id}`, {
      height: vHeight,
      width: vWidth,
      videoId: this.videoId
    });
  }

  componentDidUpdate() {
    let container=this.refs.container;
  }

  iframeDidLoad() {
    let container=this.refs.container;
    if(!(container.clientHeight && container.clientWidth) ) { return }
    let vHeight = container.clientHeight;
    let vWidth = container.clientWidth;
    let bS=0.15; //button Scale not what you were thinking
    let player=this.refs.player;
    let innerDoc = player.contentDocument || player.contentWindow.document;
    let playerButton=innerDoc.getElementsByClassName("ytp-icon-large-play-button-hover");
    console.info("found the youtube play button element", playerButton);
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

    return (
      <div className="video-container" ref="container" id={`ytplayer-${item._id}`} >
      </div>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

export default YouTube;
