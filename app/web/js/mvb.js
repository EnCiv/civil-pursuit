function MVB () {

	this.model = new Watchable();
}

MVB.prototype.inject = function(model, value) {
	this.model.set(model, value);

	return this;
};

MVB.prototype.bind = function (model, view, options) {
	options = options || { watch: true };

	if ( typeof model === 'string'  ) {

	 if ( MVB.isJQuery(view) ) {
			switch ( typeof this.model.scope[model] ) {
				case 'string':

					model = this.model.scope[model];

					view.each(function () {
						if ( this.nodeName === 'INPUT' ) {
							view.val(model);
						}
						else {
							view.text(model);
						}
					});
					
					break;
			}

			if ( options.watch ) {
				options.watch = false;
				this.model.watch(model, function () {
					this.bind(model, view, options);
				}.bind(this));
			}
		}

		else if ( typeof view === 'function' ) {
			this.model.watch(model, view);
		}
	}

	else if ( MVB.isJQuery(model) ) {
		if ( typeof view === 'string' ) {
			model.on(options.event || 'keyup', function () {
				this.model.set(view, model.val());
			}.bind(this));
		}

    else if ( typeof view === 'function' ) {
      model.on(options.event || 'click', function (event) {
        view(event, $(this));
      });
    }
	}

	return this;
};

MVB.isJQuery = function (obj) {
	return typeof obj === 'object'
		&& typeof obj.context === 'object'
		&& typeof obj.selector === 'string';
};
