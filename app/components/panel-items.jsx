'use strict';

import React from 'react';
import {ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import Item from './item';
import ClassNames from 'classnames';
import RASPPanelItems from './rasp-panel-items';
import PanelHeading from './panel-heading';

export default class PanelItems extends React.Component {
  render() {
    //logger.trace("PanelItems render");
    return (
      <ReactActionStatePath {...this.props} >
        <PanelHeading  cssName={'syn-panel-item'} panelButtons={['Creator','Instruction']}>
          <RASPPanelItems />
        </PanelHeading>
      </ReactActionStatePath>
    );
  }
}

