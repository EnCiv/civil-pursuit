// @create-index
// imagine one day a program that automatically generates this (in ES5 compatible format).
// until that day, this is manual
'use strict';

import QHome                            from './qhome';
import PanelList                        from './panel-list';
import Subtype                          from './subtype';
import QSortItems                       from './qsort-items';
import QSortWhy                         from './qsort-why';
import QSortRefine                      from './qsort-refine';
import QSortReLook                      from './qsort-harmony';
import QSortFinale                      from './qsort-finale';
import LoginPanel                       from './login-panel';
import ProfilePanel                     from './profile-panel';

var  Components={
        'PanelList': PanelList,
        'QHome': QHome,
        'Subtype': Subtype,
        'QSortItems': QSortItems,
        'QSortWhy': QSortWhy,
        'QSortRefine': QSortRefine,
        'QSortReLook': QSortReLook,
        'LoginPanel': LoginPanel,
        'QSortFinale': QSortFinale,
        'ProfilePanel': ProfilePanel,        
    }

export default Components;