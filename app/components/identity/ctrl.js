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

      case 'dob':
      return $('input.dob', template);

      case 'gender':
      return $('.gender', template);
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

    // Birthdate

    this.dob();

    // Gender

    this.renderGender();
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

    let self = this;

    let countries = this.get('countries');

    // Function to append an Option Element to a Country Select List

    let addOption = (country, index, isAlreadySelected) => {
      var option = $('<option></option>');

      option.val(country._id);

      option.text(country.name);

      if ( this.user && this.user.citizenship
        && this.user.citizenship[index] === country._id ) {
        option.attr('selected', true);
      }

      if ( isAlreadySelected ) {
        option.addClass('hide');
      }

      return option;
    }

    // For each Country Select Lists, create Option Elements for each Country

    this.find('citizenship').each(function (index) {

      var select = $(this);

      let citizenshipFromOtherList;

      let otherIndex = index ? 0 : 1;

      if ( self.user && self.user.citizenship[otherIndex] ) {
        citizenshipFromOtherList = self.user.citizenship[otherIndex];
      }

      // USA goes 1st of the list

      countries.forEach(function (country) {
        if ( country.name === 'USA' ) {
          select.append(
            addOption(country, index, ( citizenshipFromOtherList === country._id ))
          );
        }
      });

      // Then all the other countries

      countries.forEach(function (country) {
        if ( country.name !== 'USA' ) {
          select.append(
            addOption(country, index, ( citizenshipFromOtherList === country._id ))
          );
        }
      });

      // Save to back-end

      select.on('change', function () {
        let citizenship = $(this).val();

        self.template
          .find('.citizenship option.hide')
          .removeClass('hide');

        self.template
          .find('.citizenship')
          .eq(otherIndex)
          .find('option[value="' + $(this).val() + '"]')
          .addClass('hide');

        if ( citizenship ) {
          self
            .publish('set citizenship', citizenship, index)
            .subscribe((pubsub) => {
              pubsub.unsubscribe();
            });
        }
        else if ( index === 1 && self.user && self.user.citizenship[1] ) {
          self
            .publish('remove citizenship', self.user.citizenship[1])
            .subscribe((pubsub) => {
              pubsub.unsubscribe();
            });
        }
      });

    });
  }

  dob () {
    let self = this;

    this
      .find('dob')
      .on('change', function () {
        self
          .publish('set birthdate', $(this).val())
          .subscribe((pubsub) => {
            pubsub.unsubscribe();
          });
      });

    if ( this.user && this.user.dob ) {
      let dob = new Date(this.user.dob);

      let dob_year  = dob.getFullYear();
      let dob_month = dob.getMonth() + 1;
      let dob_day   = dob.getDate() + 1;

      if ( dob_month < 10 ) {
        dob_month = "0" + dob_month;
      }

      if ( dob_day < 10 ) {
        dob_day = "0" + dob_day;
      }

      this.find('dob').val([dob_year, dob_month, dob_day].join('-'));
    }
  }

  renderGender () {

    let self = this;

    this.find('gender').on('change', function () {
      self
        .publish('set gender', $(this).val())
        .subscribe((pubsub) => {
          pubsub.unsubscribe();
        });
    });
    
    if ( this.user && this.user.gender ) {
      this.find('gender').val(this.user.gender);
    }
  }

}

export default IdentityCtrl;
