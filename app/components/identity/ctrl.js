'use strict';

import Controller       from  '../../lib/app/controller';
import Nav              from '../../lib/util/nav';
import Upload           from '../../lib/util/upload';

class IdentityCtrl extends Controller {

  constructor (props) {
    super(props);

    this.props = props;

    this.user = this.props.user;

    this.template = $('#identity');
  }

  find (name) {

    let { template } = this;

    switch ( name ) {
      case 'toggle arrow':
      return $('.toggle-arrow i.fa', template);

      case 'expand':
      return $('.identity-collapse', template);

      case 'image':
      return $('img.user-image', template);

      case 'upload button pretty':
      return $('.upload-image', template);

      case 'upload button':
      return $('.upload-identity-picture', template);

      case 'first name':
      return $('[name="first-name"]', template);

      case 'middle name':
      return $('[name="middle-name"]', template);

      case 'last name':
      return $('[name="last-name"]', template);

      case 'citizenship':
      return $('.citizenship', template);
    }
  }

  show () {
    Nav.reveal(this.find('expand'), this.template,
      this.domain.intercept(() => {
        this.find('toggle arrow')
          .removeClass('fa-arrow-down')
          .addClass('fa-arrow-up');
      }));
  }

  toggle () {

    let self = this;

    this.find('toggle arrow').on('click', function () {
      
      let arrow = $(this);

      Nav.toggle(self.find('expand'), self.template, () => {
        if ( self.find('expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });
  }

  render () {

    // Show

    this.show();

    /** Toggle arrow: expand/collapse identity */

    this.toggle();

    // User image

    if ( this.user.image ) {
      this.find('image').attr('src', this.user.image);
    }

    // Upload image

    this.avatar();

    // Names

    this.names();

    // Citizenship

    this
      .publish('get countries')
      .subscribe((pubsub, countries) => {
        this.set('countries', countries);
        this.citizenship();
        pubsub.unsubscribe();
      });
  }

  avatar () {
    /** input[type=file] is hidden for cosmetic reasons
          and is substituted visually by a button.
        This snippet binds clicking button with clicking the input[type=file]
    */

    this.find('upload button pretty').on('click', () => {
      this.find('upload button').click();
    });

    new Upload(
      null,
      this.find('upload button'),
      this.template.find('.user-image-container'),
      (error, file) => {
        let stream = ss.createStream();

        ss(this.socket)
          .emit('upload image', stream, { size: file.size, name: file.name });
        
        ss.createBlobReadStream(file).pipe(stream);

        stream.on('end', () => {
          // new_item.image = file.name;

        this
          .publish('save user image', file.name)
          .subscribe((pubsub, user) => {
            console.log('image saved', user);
            pubsub.unsubscribe();
          });
        });
      });
  }

  names () {
    let self = this;

    if ( this.user.first_name ) {
      this.find('first name').val(this.user.first_name);
    }

    this.find('first name').on('change', function () {
      if ( $(this).val() ) {
        self
          .publish('set first name', $(this).val())
          .subscribe((pubsub) => {
            console.log('first name saved');
            pubsub.unsubscribe();
          });
      }
    });

    if ( this.user.middle_name ) {
      this.find('middle name').val(this.user.middle_name);
    }

    this.find('middle name').on('change', function () {
      if ( $(this).val() ) {
        self
          .publish('set middle name', $(this).val())
          .subscribe((pubsub) => {
            console.log('middle name saved');
            pubsub.unsubscribe();
          });
      }
    });

    if ( this.user.last_name ) {
      this.find('last name').val(this.user.last_name);
    }

    this.find('last name').on('change', function () {
      if ( $(this).val() ) {
        self
          .publish('set last name', $(this).val())
          .subscribe((pubsub) => {
            console.log('last name saved');
            pubsub.unsubscribe();
          });
      }
    });
  }

  citizenship () {
    let countries = this.get('countries');

    function addOption (country, index) {
      var option = $('<option></option>');

      option.val(country._id);

      option.text(country.name);

      // if ( identity.profile.user && identity.profile.user.citizenship
      //   && identity.profile.user.citizenship[index] === country._id ) {
      //   option.attr('selected', true);
      // } 

      return option;
    }

    this.find('citizenship').each(function (index) {

      var select = $(this);

      countries.forEach(function (country) {
        if ( country.name === 'USA' ) {
          select.append(addOption(country, index));
        }
      });

      countries.forEach(function (country) {
        if ( country.name !== 'USA' ) {
          select.append(addOption(country, index));
        }
      });

    });
  }

}

export default IdentityCtrl;

function foo () {
  
  'use strict';


  /**
   *  @function
   *  @return
   *  @arg
   */

  function Identity (profile) {
    template = $('#identity');

    this.profile = profile;

    this.template.data('identity', this);
  }

  Identity.prototype.find = function (name) {
    switch ( name ) {
      case 'expand':
        return this.template.find('.identity-collapse');

      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'title':
        return this.template.find('.item-title');

      case 'description':
        return this.template.find('.description');

      case 'upload button':
        return this.template.find('.upload-identity-picture');

      case 'upload button pretty':
        return this.template.find('.upload-image');

      case 'first name':
        return this.template.find('[name="first-name"]');

      case 'middle name':
        return this.template.find('[name="middle-name"]');

      case 'last name':
        return this.template.find('[name="last-name"]');

      case 'image':
        return this.template.find('img.user-image');

      case 'citizenship':   return this.template.find('.citizenship');

      case 'dob':           return this.template.find('.dob');

      case 'gender':        return this.template.find('.gender');
    }
  };

  // Identity.prototype.render = require('syn/components/Identity/controllers/render');

  /**
   *  @method saveName
   */

  Identity.prototype.saveName = function () {
    var name = {
      first_name:   this.find('first name').val(),
      middle_name:  this.find('middle name').val(),
      last_name:    this.find('last name').val()
    };

    app.socket.emit('change user name',       
      
      
      
      app.socket.synuser, name);
        };

  /**
   *  @method
  */

  Identity.prototype.renderUser = function () {

    // User image

    if ( this.user.image ) {
      this.find('image').attr('src', this.user.image);
    }

    // First name

    this.find('first name').val(this.user.first_name);

    // Middle name

    this.find('middle name').val(this.user.middle_name);

    // Last name

    this.find('last name').val(this.user.last_name);

    // Date of birth

    var dob = new Date(this.user.dob);

    var dob_year = dob.getFullYear();
    var dob_month = dob.getMonth() + 1;
    var dob_day = dob.getDate() + 1;

    if ( dob_month < 10 ) {
      dob_month = "0" + dob_month;
    }

    if ( dob_day < 10 ) {
      dob_day = "0" + dob_day;
    }

    this.find('dob').val([dob_year, dob_month, dob_day].join('-'));

    // Gender

    this.find('gender').val(this.user.gender);
  };

  /**
   *  @method
  */

  Identity.prototype.renderCountries = function () {
    var identity = this;

    function addOption (country, index) {
      var option = $('<option></option>');

      option.val(country._id);

      option.text(country.name);

      if ( identity.profile.user && identity.profile.user.citizenship
        && identity.profile.user.citizenship[index] === country._id ) {
        option.attr('selected', true);
      } 

      return option;
    }

    this.find('citizenship').each(function (index) {

      var select = $(this);

      identity.profile.countries.forEach(function (country) {
        if ( country.name === 'USA' ) {
          select.append(addOption(country, index));
        }
      });

      identity.profile.countries.forEach(function (country) {
        if ( country.name !== 'USA' ) {
          select.append(addOption(country, index));
        }
      });

    });
  };

  module.exports = Identity;

}
