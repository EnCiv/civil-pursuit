/***



                                        ,
                                   ,   /^\     ___
                                  /^\_/   `...'  /`
                               ,__\    ,'     ~ (
                            ,___\ ,,    .,       \
                             \___ \\\ .'.'   .-.  )
                               .'.-\\\`.`.  '.-. (
                              / (==== ."".  ( o ) \
                            ,/u  `~~~'|  /   `-'   )
                           "")^u ^u^|~| `""".  ~_ /
                             /^u ^u ^\~\     ".  \\
                     _      /u^  u ^u  ~\      ". \\
                    ( \     )^ ^U ^U ^U\~\      ". \\
                   (_ (\   /^U ^ ^U ^U  ~|       ". `\
                  (_  _ \  )U ^ U^ ^U ^|~|        ". `\.
                 (_  = _(\ \^ U ^U ^ U^ ~|          ".`.;      Joan Stark
                (_ -(    _\_)U ^ ^ U^ ^|~|            ""
                (_    =   ( ^ U^ U^ ^ U ~|
                (_ -  ( ~  = ^ U ^U U ^|~/
                 (_  =     (_^U^ ^ U^ U /
                  (_-   ~_(/ \^ U^ ^U^,"
                   (_ =  _/   |^ u^u."
                    (_  (/    |u^ u.(
                     (__/     )^u^ u/
                             /u^ u^(
                            |^ u^ u/
                            |u^ u^(       ____
                            |^u^ u(    .-'    `-,
                             \^u ^ \  / ' .---.  \
                       jgs    \^ u^u\ |  '  `  ;  |
                               \u^u^u:` . `-'  ;  |
                                `-.^ u`._   _.'^'./
                                   "-.^.-```_=~._/




**/

; ! function () {

  'use strict';

  module.exports = function bindPanel (panel, view) {
    var id = 'panel-' + panel.type;

    if ( panel.parent ) {
      id += '-' + panel.parent;
    }

    view.attr('id', id);
    
    view.find('.panel-title').text(panel.type);
  };

} ();
