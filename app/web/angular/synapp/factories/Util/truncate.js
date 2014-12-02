;(function () {

  module.exports = ['$rootScope', 'View']

  function TruncateAsAService ($rootScope, View) {
    function Truncate (item) {

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

      this.words.forEach(function (word) {

        var span = $('<span></span>');

        if ( self.truncated ) {
          span.addClass('truncated');
          span.hide();
        }

        span.text(word + ' ');

        self.description.append(span);

        if ( i === 5 ) {

          var diff = self.textWrapper.height() > self.height;

          if ( diff && ! self.truncated ) {

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

      this.more.find('a').text(moreLabel);

      // more button's on click behavior

      this.more.on('click', function () {

        // Exit if already an animation in progress

        if ( self.item.find('.is-showing').length ) {
          return false;
        }

        View.scrollToPointOfAttention(item, function () {

          // Show more

          if ( $(this).find('a').text() === moreLabel ) {
            // console.warn('lune rouge')
            if ( /^item-/.test(item.attr('id')) ) {

              var item_id = item.attr('id').split('-')[1];

              if ( item.find('.is-shown').length ) {
                self.$rootScope.publish("toggle view",
                  { view: "text", item: item_id });

                self.$rootScope.subscribe('did hide view', function (options) {
                  if ( options.item === item_id )  {
                    setTimeout(function () {
                      showMore($(this));
                    }.bind(this));
                  }
                }.bind(this));
              }

              else {
                showMore($(this));
              }
            }
            
            else {
              showMore($(this));
            }
          }

          // hide

          else {
            showLess($(this));
          }
        });
      });

      this.description.append(this.more);
    };

    Truncate.prototype.unTruncate = function () {
        
      var self = this;

      var interval = 0

      // show words 50 by 50

      for ( var i = 0; i < this.words.length ; i += 50 ) {
        setTimeout(function () {
          var k = this.i + 50;
          for ( var j = this.i; j < k ; j ++ ) {
            self.item.find('.truncated:eq(' + j + ')').show();
          }
        }.bind({ i: i }), interval += 100);
      }

      // on done showing words, wrap up

      setTimeout(function () {
        self.item.find('.reference').show();
        self.more.find('a').text(lessLabel);
        self.more.find('i').hide();  
      }, interval += 100);
    };

    Truncate.prototype.reTruncate = function () {
      
      var self = this;

      var interval = 0;

      for ( var i = 0; i < this.words.length ; i += 50 ) {
        setTimeout(function () {
          var k = this.i + 50;
          for ( var j = this.i; j < k ; j ++ ) {
            self.item.find('.truncated:eq(' + j + ')').hide();
          }
        }.bind({ i: i }), interval += 100);
      }

      setTimeout(function () {
        self.item.find('.reference').hide();
        slef.more.find('a').text(moreLabel);
        slef.more.find('i').show();
      }, interval += 100);
    };

    return Truncate;
  }

})();