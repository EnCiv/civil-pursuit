;(function () {

  module.exports = Accordion;

  function Accordion (elem) {
    var accordion = this;

    var events = ['show', 'shown', 'hide', 'hidden'];

    events.forEach(function (event) {
      elem.on(event + '.bs.collapse', function ($event) {
        accordion.emit(this.event, $event);
      }.bind( { event: event }));
    });

    accordion.triggers = {
      'show': [
        function () {
          $('.collapse.in')
            .each(function () {
              if ( ! $(this).has($event.target).length ) {
                $(this).collapse('hide');
              }
            });
        }
      ],
      'shown': [],
      'hide': [],
      'hidden': []
    };
  }

  Accordion.prototype.emit = function(event) {
    this.triggers[event].forEach(function (trigger) {
      trigger();
    });
  };

  Accordion.prototype.on = function(event, then) {
    this.triggers[event].push(then);
  };

  Accordion.prototype.toggle = function(what, $event) {
    $($event.target)
      .closest('.box-wrapper')
      .find('.synapp-' + what + ':eq(0)')
      .collapse('toggle');
  };

})();
