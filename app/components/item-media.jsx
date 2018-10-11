'use strict';

import React from 'react';
import Image from './util/image';
import YouTube from './youtube';
import publicConfig from '../../public.json';
import cx from 'classnames';
import Uploader from './uploader';
import createRef from 'create-react-ref/lib/createRef';
React.createRef = createRef; // remove for React 16
import injectSheet from 'react-jss'

const styles = {
  'item-media-wrapper': {
    '&$title ': {
      display: 'none'
    }
  },
  'item-media': {
    float: 'left',
    'margin-right': `${publicConfig.itemVisualGap}`,
    'padding-bottom': `${publicConfig.itemVisualGap}`,
    height: '7em',
    'max-width': '13em',
    '&$collapsed, &$minified, &$title': {
      display: 'none'
    },
    '&$media-thin': {
      'max-width': '7em',
      overflow: 'hidden',
      "img": {
        'margin-left': "calc( ( 13em - 7em ) / -2)"
      }
    }
  },
  'collapsed': {},
  'minified': {},
  'title': {},
  'truncated': {},
  'open': {},
  'media-thin': {}
}


class ItemMedia extends React.Component {

  state = { mediaThin: false, image: '' };

  constructor(props) {
    super(props);
    this.afterLoad = this.afterLoad.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.wrapper = React.createRef();
    this.media = React.createRef();
    this.uploader = React.createRef();
  }

  componentWillReceiveProps(newProps) {
    if (this.state.image !== newProps.image)
      this.setState({ image: newProps.image });
  }

  afterLoad() {
    if (!this.wrapper || !this.media) { return }
    let wWidth = this.wrapper.clientWidth;
    let mWidth = this.media.clientWidth;
    if (!mWidth || !wWidth) { return }
    if (mWidth > (wWidth / 2)) {
      this.setState({ mediaThin: true });
    }
  }

  saveImage(image) {
    this.setState({ image });
    if (this.props.onChange)
      this.props.onChange({ value: { image } });
  }

  render() {
    let { item, className, classes, truncShape } = this.props;

    let media;

    if (truncShape === 'edit') {
      if (!(this.props.item.type && this.props.item.type.mediaMethod === "disabled")) {
        media = (
          <section className={classes["item-media-wrapper"]} key="media">
            <section className={classes["item-media"]} ref={this.media} style={{ width: "calc(13em - 8px)" }}>
              <Uploader
                ref={this.uploader}
                handler={this.saveImage}
                image={this.state.image} />
            </section>
          </section>
        );
      } else
        media = null;
    } else if (YouTube.isYouTube(item)) {
      media = (
        <section className={cx(classes['item-media-wrapper'], classes[className])} ref={this.wrapper}>
          <section className={cx(classes['item-media'], this.state.mediaThin && classes['media-thin'])} ref={this.media} >
            <YouTube item={item} />
          </section>
        </section>
      );
    } else if (item.image == publicConfig['default item image'] || item.image == publicConfig['old default item image']) {
      media = (
        <section className={cx(classes['item-media-wrapper'], classes[className])}>
        </section>
      );
    }
    else if (item.image && (/^http/.test(item.image) || /^https/.test(item.image))) {
      media = (
        <section className={cx(classes['item-media-wrapper'], classes[className])} ref={this.wrapper}>
          <section className={cx(classes['item-media'], this.state.mediaThin && classes['media-thin'])} ref={this.media}>
            <Image src={item.image} onLoad={this.afterLoad} responsive />
          </section>
        </section>
      );
    }
    else {
      /** don't show image if
      media = ( <Image src={ publicConfig['default item image'] } responsive /> ); **/
      media = (
        <section className={cx(classes['item-media-wrapper'], classes[className])}>
        </section>
      );
    }

    return (
      media
    );
  }
}

export default injectSheet(styles)(ItemMedia);
