! function () {
  
  'use strict';

  module.exports = ItemView;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Library dependencies
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var html5                   =   require('syn/lib/html5');
  var Element                 =   html5.Element;
  var Page                    =   require('syn/lib/app/Page');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Components dependencies
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var DefaultButtonsView =   require('syn/components/ItemDefaultButtons/View');
  var PromoteView             =   require('syn/components/Promote/View');
  var DetailsView             =   require('syn/components/Details/View');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Export Item Box
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /**
   *  @arg                        {Object} locals
  */

  function ItemView (locals) {

    console.log()
    console.log()
    console.log('got locals', arguments)
    console.log()
    console.log()

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Media
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $MediaWrapper         =   Element('.item-media-wrapper');

    var $Media                =   Element('.item-media');

    function getItemMedia (item)  {

      if ( item )             {
        if ( item.media )     {
          return                  item.media;
        }

        else if ( item.image ){
          return                  Element('img.img-responsive', {
            src               :   item.image });
        }
      }

      return                      [];
    }

    $Media.add(                   getItemMedia(locals.item));
    $MediaWrapper.add(            $Media);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Buttons
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Buttons              =   Element('.item-buttons', {
        $condition            :   function () {
          if ( locals.item )  {
            return locals.item.buttons  !== false;
          }
          return true;
        }
      }
    );

    if ( locals.item && locals.item.buttons ) {
      $Buttons.add(               locals.item.buttons);
    }

    else {
      $Buttons.add(               DefaultButtonsView());
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Subject
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $SubjectHeader        =   Element('h4.item-subject.header');

    var $SubjectLink          =   Element('a', {
      
      href                    :     function (locals) {
        if ( locals && locals.item )    {
          return                      Page('Item Page', locals && locals.item);
        }

        return                        '#';
      },

      $text                     :     function (locals) {
        if ( locals && locals.item )      {
          return                      locals.item.subject;
        }

        return                        '';
      }
    });

    $SubjectHeader.add(               $SubjectLink);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Description
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Description            =     Element('.item-description.pre-text', {
      $text                     :     function (locals) {
        if ( locals && locals.item )      {
          return                      locals.item.description;
        }

        return                        '';
      }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Reference
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  TEXT
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Text                   =     Element('.item-text');

    var $Truncatable            =     Element('.item-truncatable');
    
    var $ClearText              =     Element('.clear.clear-text');

    $Text.add(                        $Truncatable);

    $Truncatable.add(                 $SubjectHeader,
                                      $Description,
                                      $ClearText);
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Promote
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Promote                =     Element('.promote.is-container');

    var $PromoteSection         =     Element('.is-section');

    $Promote.add(                     $PromoteSection);

    $PromoteSection.add(              PromoteView(locals));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Details
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Details                =     Element('.details.is-container');

    var $DetailsSection         =     Element('.is-section')

    $Details.add(                     $DetailsSection);

    $DetailsSection.add(              DetailsView(locals));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Arrow
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $ArrowWrapper           =     Element('.item-arrow', {
      $condition                :     function () {
        if ( locals.item ) {
          return locals.item.collapsers !==   false;
        }
        return true;
      }
    });

    var $Arrow                  =     Element('i.fa.fa-arrow-down');

    var $ArrowDiv               =     Element('div');

    $ArrowWrapper.add($ArrowDiv);

    $ArrowDiv.add($Arrow);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Children
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Children               =     Element('.children.is-container');
    var $ChildrenSection        =     Element('.is-section');

    $Children.add(
      $ChildrenSection);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Item collapsers
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var $Collapsers             =   Element('.item-collapsers', {
      $condition                :   function () {
        if ( locals.item ) {
          return locals.item.collapsers !==   false;
        }
        return true;
      }
    });

    $Collapsers.add(
      $Promote,
      $Details,
      $Children);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Item Box
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var itemAttributes        =   {
      id                      :   locals.item ? 'item-' + locals.item.id  : ''
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
