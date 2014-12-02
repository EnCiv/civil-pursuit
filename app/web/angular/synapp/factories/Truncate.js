;(function () {

  module.exports = ['$rootScope', 'View', TruncateAsAService]

  function TruncateAsAService ($rootScope, View) {
    function Truncate (item) {

      console.info('Truncating', item.attr('id'));

      // ============

      this.item = item;

      this.description = this.item.find('.description');

      this.textWrapper = this.item.find('.item-text');

      this.reference = this.item.find('.reference');

      this.text = this.description.text();

      this.words = this.text.split(' ');

      this.height = parseInt(this.item.find('.item-text').css('paddingBottom'));

      this.truncated = false;

      this.moreLabel = 'more';

      this.lessLabel = 'less';

      this.isIntro = ( this.item.attr('id') === 'intro' );

      if ( ! this.isIntro ) {
        this._id = this.item.attr('id').split('-')[1];
      }

      // ============

      this.tagify();

      if ( this.truncated ) {
        this.appendMoreButton();
      }
    }

    Truncate.prototype.tagify = function () {

      var self = this;

      this.description.empty();

      this.reference.hide();

      var i = 0;

      this.words.forEach(function (word, index) {

        var span = $('<span></span>');

        if ( self.truncated ) {
          span.addClass('truncated');
          span.hide();
        }

        span.text(word + ' ');

        self.description.append(span);

        if ( i === 5 ) {

          var diff = self.textWrapper.height() > self.height;

          if ( diff && ! self.truncated && (index !== (self.words.length - 1)) ) {

            self.truncated = true;
          }

          i = -1;
        }

        i ++;
      });
    };

    Truncate.prototype.appendMoreButton = function () {

      var self = this;

      // create more button

      this.more = $('<span><i>... </i>[<a href=""></a>]</span>');

      // more button's text

      this.more.find('a').text(self.moreLabel);

      // more button's on click behavior

      this.more.find('a').on('click', function () {

        var moreLink = $(this);

        // Exit if already an animation in progress

        if ( self.item.find('.is-showing').length ) {
          return false;
        }

        View.scrollToPointOfAttention(self.item, function () {

          // Show more

          if ( moreLink.text() === self.moreLabel ) {
            
            // If is intro

            if ( self.isIntro ) {
              self.unTruncate();
            }
            
            else {
              // If there is already stuff shown, hide it first

              if ( self.item.find('.is-shown').length ) {
                
                // Trigger the toggle view to hide current shown items

                $rootScope.publish("toggle view",
                  { view: "text", item: self._id });

                // Listen on hiding done

                $rootScope.subscribe('did hide view', function (options) {

                  // Make sure it concerns our item

                  if ( options.item === self._id )  {

                    // untruncate

                    setTimeout(function () {
                      self.unTruncate();
                    });
                  }
                });
              }

              else {
                self.unTruncate();
              }
            }
          }

          // hide

          else {
            self.reTruncate();
          }
        });
      });

      this.description.append(this.more);
    };

    Truncate.prototype.unTruncate = function () {
        
      var self = this;

      var interval = 0;

      var inc = 50;

      var inc = Math.ceil(self.height / self.words.length);

      console.log(self.words.length, inc)

      // show words 50 by 50

      for ( var i = 0; i < this.words.length ; i += inc ) {
        setTimeout(function () {
          var k = this.i + inc;
          for ( var j = this.i; j < k ; j ++ ) {
            self.item.find('.truncated:eq(' + j + ')').show();
          }
        }.bind({ i: i }), interval += (inc * 1.5));
      }

      // on done showing words, wrap up

      setTimeout(function () {
        self.item.find('.reference').show();
        self.more.find('a').text(self.lessLabel);
        self.more.find('i').hide();  
      }, interval);
    };

    Truncate.prototype.reTruncate = function () {
      
      var self = this;

      var interval = 0;

      var inc = Math.ceil(self.height / self.words.length);

      for ( var i = 0; i < this.words.length ; i += inc ) {
        setTimeout(function () {
          var k = this.i + inc;
          for ( var j = this.i; j < k ; j ++ ) {
            self.item.find('.truncated:eq(' + j + ')').hide();
          }
        }.bind({ i: i }), interval += (inc * 2));
      }

      setTimeout(function () {
        self.item.find('.reference').hide();
        self.more.find('a').text(self.moreLabel);
        self.more.find('i').show();
      }, interval);
    };

    return Truncate;
  }

})();