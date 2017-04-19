// @create-index
// imagine one day a program that automatically generates this (in ES5 compatible format).
// until that day, this is manual
'use strict';

//import PanelList                        from './panel-list';
//import Subtype                          from './subtype';
import QSortItems                       from './qsort-items';
import QSortWhy                         from './qsort-why';
import QSortRefine                      from './qsort-refine';
import QSortReLook                      from './qsort-relook';
import QSortFinale                      from './qsort-finale';
import LoginPanel                       from './login-panel';
import ProfilePanel                     from './profile-panel';

var  Components={
        'PanelList': require('./panel-list'),
        'Subtype': require('./subtype'),
        'QSortItems': QSortItems,
        'QSortWhy': QSortWhy,
        'QSortRefine': QSortRefine,
        'QSortReLook': QSortReLook,
        'LoginPanel': LoginPanel,
        'QSortFinale': QSortFinale,
        'ProfilePanel': ProfilePanel,        
    }

export default Components;