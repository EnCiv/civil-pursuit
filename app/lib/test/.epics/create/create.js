'use strict';

import selectors from '../../../../selectors.json';

class CreateItem {

  //----------------------------------------------------------------------------

  constructor (driver, panel) {
    this.driver = driver;

    this.dom = {
      toggle        :   ` ${panel} > ${selectors.panel.heading} >  ${selectors.create.toggle}`,

      form          :   `${panel} > ${selectors.panel.body} >  ${selectors.create.form}`,

      accordion     :   `${panel} > ${selectors.panel.body} >  ${selectors.accordion.main}`
    };
  }

  //----------------------------------------------------------------------------

  showJoinOnToggleIfVisitor () {
    return it => {
      it('click toggle button', () => this.driver.client.click(this.toggle));
      it('should show join', () => this.driver.isVisible(selectors.join, 1500));
    };
  }

  //----------------------------------------------------------------------------

  showCreateFormIfUser () {
    return it => {
      it('form should be hidden',
        () => this.driver.isHidden(this.accordion));

      it('click toggle button',
        () => this.driver.client.click(this.toggle));

      it('should show create form',
        () => this.driver.isVisible(this.accordion, 1500));
    };
  }

  //----------------------------------------------------------------------------

  hideCreateForm () {
    return it => {
      it('form should be visible',
        () => this.driver.isVisible(this.accordion));

      it('click toggle button',
        () => this.driver.client.click(this.toggle));

      it('form should be hidden',
        () => this.driver.isHidden(this.accordion, 1500));
    };
  }

  //----------------------------------------------------------------------------

  createEmptyItem () {
    return it => {
      it('should submit form',
        () => this.driver.client.setValue(selectors.create.form))
    };
  }

  //----------------------------------------------------------------------------

}

export default CreateItem;
