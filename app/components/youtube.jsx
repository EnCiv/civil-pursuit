'use strict';

import React                  from 'react';
import itemType               from '../lib/proptypes/item';

class YouTube extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    item : itemType
  };


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  constructor(props){
        super(props);
        let { item } = this.props;
        let { url } = item.references[0];
        this.youTubeId = YouTube.getId(url);

        if(!YouTube.loadedYouTube){ 
          YouTube.initYouTube(); 
        }
  }

  state= { vHeight: 0,
            vWidth: 0
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static loadedYouTube=false;
  static preMountQueue= [];

  static initYouTube() {
   var tag = document.createElement('script');
   tag.src = "http://www.youtube.com/player_api";
   var firstScriptTag = document.getElementsByTagName('script')[0];
   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }


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
    if(!(container.clientHeight && container.clientWidth) ) { console.info("youtube did mount, no size yet"); }
    let vHeight = container.clientHeight || 108;
    let vWidth = container.clientWidth || 192;
    if( typeof YT !== 'undefined' ) {
      this.player = new YT.Player(`ytplayer-${this.props.item._id}`, {
        height: vHeight,
        width: vWidth,
        videoId: this.youTubeId,
        events: {
          onReady: this.iframeDidLoad.bind(this),
        }
      });
      console.info("YouTube mounted");
    }else {
      console.info("YouTube not mounted yet");
      YouTube.preMountQueue.push(this.componentDidMount.bind(this));
    }
    console.info("YouTube did mount", this.player);
  }



  componentDidUpdate() {
    let container=this.refs.container;
  }

  iframeDidLoad() {
    console.info("iframDidLoad", this.player.a);
    let player=this.player.a;
    let vHeight = player.clientHeight;
    let vWidth = player.clientWidth;
    let bS=0.15; //button Scale not what you were thinking

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
      <div className="video-container" ref="container" id={`ytplayer-${item._id}`} style={{width: 192, height: 108}} >
      </div>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

function onYouTubePlayerAPIReady() {
  YouTube.loadedYouTube=true;
  console.info("youtube player loaded");
  if(YouTube.preMountQueue.length){
    YouTube.preMountQueue.foreach( component () );
  }
}

export default YouTube;
