! function () {
  
  'use strict';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Library dependencies
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var html5                   =   require('syn/lib/html5');
  var Element                 =   html5.Element;
  var Page                    =   require('syn/lib/Page');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Components dependencies
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var _ItemDefaultButtons     =   require('syn/views/ItemDefaultButtons');
  var _Promote                =   require('syn/views/Promote');
  var _Details                =   require('syn/views/Details');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Export Item Box
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  module.exports              =   function renderItemComponent(itemOptions) {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Media
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $MediaWrapper         =   Element('.item-media-wrapper');

    var $Media                =   Element('.item-media');

    function getItemMedia (opt)   {

      if ( opt.media )            {

        return                    opt.media;
      }

      else if ( opt.item      &&  opt.item.image ) {

        return                    Element('img.img-responsive', {
          src                 :   opt.item.image });
      }

      return                      [];
    }

    $Media.add(                   getItemMedia(itemOptions));
    $MediaWrapper.add(            $Media);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Buttons
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Buttons              =   Element('.item-buttons', {
        $condition            :   function () {
          return                  itemOptions
            .buttons          !== false;
        }
      }
    );

    if ( itemOptions.buttons ){
      $Buttons.add(               itemOptions.buttons);
    }

    else                      {
      $Buttons.add(               _ItemDefaultButtons());
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Subject
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $SubjectHeader        =   Element('h4.item-subject.header');

    var $SubjectLink          =   Element('a', {
      
      href                      :     function (opt) {
        if ( opt && opt.item )  {
          return                      Page('Item Page', opt.item);
        }

        return                        '#';
      },

      $text                     :     function (opt) {
        if ( opt && opt.item )  {
          return                      opt.item.subject;
        }

        return                        '';
      }
    });

    $SubjectHeader.add(               $SubjectLink);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Description
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Description            =     Element('.item-description.pre-text', {
      $text                     :     function (opt) {
        if ( opt && opt.item )  {
          return                      opt.item.description;
        }

        return                        '';
      }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Reference
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  TEXT
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Text                   =     Element('.item-text');

    var $Truncatable            =     Element('.item-truncatable');
    
    var $ClearText              =     Element('.clear.clear-text');

    $Text.add(                        $Truncatable);

    $Truncatable.add(                 $SubjectHeader,
                                      $Description,
                                      $ClearText);
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Promote
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Promote                =     Element('.promote.is-container');

    var $PromoteSection         =     Element('.is-section')

    $Promote.add(                     $PromoteSection);

    $PromoteSection.add(              _Promote(itemOptions));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Details
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Details                =     Element('.details.is-container');

    var $DetailsSection         =     Element('.is-section')

    $Details.add(                     $DetailsSection);

    $DetailsSection.add(              _Details(itemOptions));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Arrow
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $ArrowWrapper           =     Element('.item-arrow', {
      $condition                :     function () {
        return itemOptions
          .collapsers           !==   false;
      }
    });

    var $Arrow                  =     Element('i.fa.fa-arrow-down');

    var $ArrowDiv               =     Element('div');

    $ArrowWrapper.add(                $ArrowDiv);

    $ArrowDiv.add(                    $Arrow);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Children
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Children               =     Element('.children.is-container');
    var $ChildrenSection        =     Element('.is-section');

    $Children.add(                    $ChildrenSection);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Item collapsers
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Collapsers           =   Element('.item-collapsers', {
      $condition              :   function () {
        return itemOptions
          .collapsers         !== false;
      }
    });

    $Collapsers.add(                  $Promote,
                                      $Details,
                                      $Children);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Item Box
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var itemAttributes        =   {
      id                      :   itemOptions.id
    };

    var $Item                 =   Element('.item', itemAttributes);

    $Item.add(                    $MediaWrapper,
                                  $Buttons,
                                  $Text,
                                  $ArrowWrapper,
                                  $Collapsers,
                                  Element('.clear'));

    return                        $Item;
  };

} ();
