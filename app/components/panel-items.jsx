'use strict';

import React from 'react';
import Accordion          from 'react-proactive-accordion';
import Icon from './util/icon';
import ItemStore from '../components/store/item';
import EditAndGoAgain from './edit-and-go-again';
import config from '../../public.json';
import {ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import Item from './item';
import PanelHead from './panel-head';
import RASPPanelItems from './rasp-panel-items';

export default class PanelItems extends React.Component {
  render() {
    logger.trace("PanelItems render");
    return (
      <ReactActionStatePath {...this.props} >
        <PanelHead  cssName={'syn-panel-item'} >
          <RASPPanelItems />
        </PanelHead>
      </ReactActionStatePath>
    );
  }
}

