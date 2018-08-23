// @create-index
// imagine one day a program that automatically generates this (in ES5 compatible format).
// until that day, this is manual
'use strict';

// IMPORTANT!!!
//
// This first letter of each component name must be unique in this list.  The first letter is the key being used in segment to state
//

var  Components={
        'CreateHarmony': require('./create-harmony'),
        'Details': require('./details'),
        'Edit': require('./edit'),
        'Harmony': require('./harmony'),
        "InfoGraphic": require('./info-graphic'),
        'Promote': require('./promote'),
        'QSortButtons': require('./qsort-buttons'),
        'Refine': require('./refine'),
        'Subtype': require('./subtype'),
        "Totals": require('./totals'),
        "UseComponent": require('./use-component')
}

export default Components;