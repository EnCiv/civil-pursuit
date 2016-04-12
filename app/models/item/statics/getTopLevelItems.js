'use strict';

import sequencer from 'promise-sequencer';
import Type from '../../type';
import Config from '../../config';

function getTopLevelItems () {
  return sequencer.pipe(
    () =>       Config.get('top level type'),
    typeId =>   Type.findById(typeId),
    type =>     this.getPanelItems({ type })
  );
}

export default getTopLevelItems;
