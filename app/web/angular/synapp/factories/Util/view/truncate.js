;(function () {

  module.exports = function (item) {

    var self = this;

    var text = item.find('.description').text().toString();

    item.find('.description').empty();

    var i = 0;

    var paddingBottom = parseInt(item.find('.item-text').css('paddingBottom'));

    var hide = false;

    text.split(' ').forEach(function (word) {

      var span = $('<span></span>');

      if ( hide ) {
        span.addClass('truncated');
        span.hide();
      }

      span.text(word + ' ');

      item.find('.description').append(span);

      if ( i === 5 ) {

        var diff = item.find('.item-text').height() > paddingBottom;

        if ( diff && ! hide ) {

          hide = true;
        }

        i = -1;
      }

      i ++;
    });

    if ( hide ) {
      var moreLabel = 'more', lessLabel = 'less';

      var more = $('<span><i>... </i>[<a href=""></a>]</span>');

      more.find('a').text(moreLabel);

      function showMore (elem) {          

        var interval = 0, length = item.find('.truncated').length;

        for ( var i = 0; i < length ; i += 50 ) {
          setTimeout(function () {
            var k = this.i + 50;
            for ( var j = this.i; j < k ; j ++ ) {
              item.find('.truncated:eq(' + j + ')').show();
            }
          }.bind({ i: i }), interval += 100);
        }

        setTimeout(function () {
          item.find('.reference').show();
          elem.find('a').text(lessLabel);
          elem.find('i').hide();  
        }, interval += 100);

        // 
      }

      function showLess (elem) {

        var interval = 0, length = item.find('.truncated').length;

        for ( var i = 0; i < length ; i += 50 ) {
          setTimeout(function () {
            var k = this.i + 50;
            for ( var j = this.i; j < k ; j ++ ) {
              item.find('.truncated:eq(' + j + ')').hide();
            }
          }.bind({ i: i }), interval += 100);
        }

        setTimeout(function () {
          item.find('.reference').hide();
          elem.find('a').text(moreLabel);
          elem.find('i').show();
        }, interval += 100);

      }

      more.on('click', function () {
        if ( item.find('.is-showing').length ) {
          return false;
        }

        self.$rootScope.scrollToPoA(item, function () {
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

      item.find('.description').append(more);

      item.find('.reference').hide();
    }
  }

})();