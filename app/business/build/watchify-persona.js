/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             

       $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$ 
      $$        $$    $$  $$    $$        $$  $$    $$  $$    $$
       $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$
            $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$
      $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$ 
                      $$                      $$        $$      
                      $$                      $$        $$     
                 $$$$$$                       $$        $$                     









***/

! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var browserify    =   require('browserify');
  var watchify      =   require('watchify');
  var source        =   require('vinyl-source-stream');
  var gutil         =   require('gulp-util');
  var config        =   require('../config.json');

  exports.task      =   function watchifyApp () {
    var bundler = watchify(
      browserify(
        path.join(process.cwd(), 'app/web/js/pages/Persona.js'),
        watchify.args));

    bundler.on('update', rebundle);

    function rebundle() {
      return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('persona.js'))
        .pipe(gulp.dest(config.dirs['dist js']));
    }

    return rebundle();
  };

}();
