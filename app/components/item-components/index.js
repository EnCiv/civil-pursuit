// @create-index
// imagine one day a program that automatically generates this (in ES5 compatible format).
// until that day, this is manual
'use strict';

var  Components={
        'Details': require('./details'),
        'Harmony': require('./harmony'),
        'Promote': require('./promote'),
        'Subtype': require('./subtype'),
        'QSortButtons': require('./qsort-buttons'),
        'Edit': require('./edit'),
        'CreateHarmony': require('./create-harmony'),
        'Refine': require('./refine'),
        "Totals": require('./totals'),
        "UseComponent": require('./use-component'),
        "InfoGraphic": require('./info-graphic')
}

export default Components;