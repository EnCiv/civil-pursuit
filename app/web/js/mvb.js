function MVB (model) {
  this.model = model;
}

MVB.prototype.$bind = function(model, view) {

	var self = this,
    main;

  if ( typeof view === 'function' ) {
    view(self.model[model]);

    this.$watch(model, view);
  }

  else {
    (main = function () {
      MVB.$changeView(view, self.model[model]);
    })();

    this.$watch(model, main);
  }

  if ( arguments.length > 2 ) {
    Array.prototype.slice.call(arguments)
      .filter(function (arg, index) {
        return index > 1;
      })
      .forEach(function (view) {
        self.$bind(model, view);
      });
  }

	return this;
};

MVB.prototype.$listen = function(model, view) {
	
	var self = this;

	view.on('keyup', function () {
		self[model] = $(this).val();
	});

	return this;
};

MVB.prototype.$toggle = function(model, view) {
	
	var self = this;

	view.on('click', function () {
		self[model] = ! self[model];
	});

	return this;
};

MVB.prototype.$show = function(model, view) {

  var self = this;

  view.each(function () {

    // Show / hide view

    view[self[model] ? 'show' : 'hide']();

    // Add watcher

    Object.observe(self, function (changes) {

      // Walk changes

      changes.forEach(function (change) {

        // If change matches model

        if ( change.name === model ) {

          //  Show / Hide model

          view[self[model] ? 'show' : 'hide']();
        }
      });
    });
  });

  if ( arguments.length > 2 ) {
    Array.prototype.slice.call(arguments)
      .filter(function (arg, index) {
        return index > 1;
      })
      .forEach(function (view) {
        self.$show(model, view);
      });
  }

  return this;
};

MVB.prototype.$hide = function(model, view) {

  var self = this;

  view.each(function () {

    // Show / hide view

    view[self[model] ? 'hide' : 'show']();

    // Add watcher

    Object.observe(self, function (changes) {

      // Walk changes

      changes.forEach(function (change) {

        // If change matches model

        if ( change.name === model ) {

          //  Show / Hide model

          view[self[model] ? 'hide' : 'show']();
        }
      });
    });
  });

  if ( arguments.length > 2 ) {
    Array.prototype.slice.call(arguments)
      .filter(function (arg, index) {
        return index > 1;
      })
      .forEach(function (view) {
        self.$show(model, view);
      });
  }

  return this;
};

MVB.prototype.$map = function(model, map) {
  var self = this,
    main;

  (main = function () {
    if ( self.model[model] ) {
      for ( var key in map ) {
        MVB.$changeView(map[key], self.model[model][key]);
      }
    }
  })();

  MVB.$watch(model, main);

  return this;
};

MVB.prototype.$each = function(model, map) {
  var self = this,
    main;

  (main = function () {
    if ( Array.isArray(this[model]) ) {

      var wrapper = map.prev();

      if ( ! wrapper.length ) {
        wrapper = map.next();

        if ( ! wrapper.length ) {
          wrapper = map.parent();
        }
      }

      return;

      this[model].forEach(function (item, index) {

        if ( map.get(index) ) {
          MVB.$changeView($(map.get(index)), item);
        }

        else if ( index) {

        }
      });
    }
  }.bind(this))();

  MVB.$watch(model, main);

  return this;
};

MVB.prototype.$watch = function (model, watcher) {
  Object.observe(this.model, function (changes) {
    changes.forEach(function (change) {
      if ( change.name === model ) {
        watcher(model);
      }
    });
  });
}

MVB.$changeView = function (view, value) {

  function main () {
    var fn = 'text';

    switch ( this.nodeName.toLowerCase() ) {
      case 'input':
        fn = 'val';
        break;
    }

    var args = [value];

    $(this)[fn].apply(view, args);
  }

  if ( view.each ) {
    view.each(main);
  }
  else {
    main.apply(view);
  }
};