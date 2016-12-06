'use strict';

import React              from 'react';
import Panel              from './panel';
import Loading            from './util/loading';
import Link               from './util/link';
import panelType          from '../lib/proptypes/panel';
import makePanelId        from '../lib/app/make-panel-id';
import Join               from './join';
import Accordion          from './util/accordion';
import Promote            from './promote';
import EvaluationStore    from './store/evaluation';
import QSortButtons        from './qsort-buttons';
import Icon               from './util/icon';
import Creator            from './creator';
import ItemStore          from '../components/store/item';
import Details            from './details';
import DetailsStore       from './store/details';
import EditAndGoAgain     from './edit-and-go-again';
import Harmony            from './harmony';

class QSortItems extends React.Component {

  static propTypes  =   {
    panel           :   panelType
  };

  QSortButtonList = {
        unsorted: {
            name: 'unsorted',
            color: '#ffffff',
            title: {
                active: "Yea! this is in a stack",
                inactive: "Put this in in a stack"
            }

        },
        most: {
            name: 'most',
            color: '#f0f0ff',
            title: {
                active: "Yea! this is in the most important stack",
                inactive: "Put this in the most important stack"
            }

        },
        neutral: {
            name: 'neutral',
            color: '#f0f0f0',
            title: {
                active: "This is among the things that are neight most nor least important",
                inactive: "Put this among the things that are neight most nor least important"
            }
        },
        least: {
            name: 'least',
            color: '#fff0f0',
            title: {
                active: "This is in the least important stacko of them all",
                inactive: "Put this in the most important stack of them all"
            }
        }
    };
  
  sections = [];
  index = [];

  constructor(props){
      super(props);
      console.info("qsort constructor", this.QSortButtonList );
      let buttons = Object.keys(this.QSortButtonList);
      console.info("qsort buttons", buttons);
      buttons.forEach(button => this.sections[button]=[]);
      console.info("qsort section", this.sections);
      if(props.panel && props.panel.items) {
        props.panel.items.forEach((item,i) =>{
            this.sections['unsorted'].push(item._id);
            this.index[item._id]=i;
        });
      }
      console.info("qsort constructed");
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    componentWillReceiveProps(newProps){ //deleting items from sections that are nolonger in newProps is not a usecase
        let currentIndex = Object.entries(this.index);
        if(newProps.panel && newProps.panel.items) {
            newProps.panel.items.forEach((newItem,i) => {
                if(!(newItem.id in this.index)) {
                    this.sections['unsorted'].push(newItem._id);
                    this.index[newItem._id]=i;
                }else {
                    currentIndex[newItem.id]= -1; // items not marked -1 here should be deleted on day
                }
            }); 
        }
    }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount () {

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate () {
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggle (itemId, section) {
    //find the section that the itemId is in, take it out, and put it in the new section
    let i;
    if ( itemId ) {
        Object.keys(this.sections).forEach(
            (sectionName) => {
                if( (i = this.sections[sectionName].indexOf(itemId)) !== -1) {
                    if(sectionName === section ) { 
                        this.sections[sectionName].splice(i,1);
                        this.sections['unsorted'].unshift(itemId);
                        return;
                    } else { // take the i'th element out of the current section and put it at the top of the new section
                        this.sections[sectionName].splice(i,1);
                        this.sections[section].unshift(itemId);
                        return; //no need to continue, there's only one
                    }
                }
            }
        );
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const { panel, count, user, emitter } = this.props;

    let title = 'Loading items', name, loaded = false, content, loadMore,
      type, parent, items;

    if ( panel ) {
      items=panel.items;
      loaded = true;

      type = panel.type;
      parent = panel.parent;

      if(type) {
        name = `syn-panel-${type._id}`;
      } else
      { name = 'syn-panel-no-type';
      }

      if ( parent ) {
        name += `-${parent._id || parent}`;
      }

      title = type.name;

      if ( ! this.sections['unsorted'].length ) {
        content = (
          <div className="gutter text-center">
            <a href="#" onClick={ this.toggle.bind(this, null, 'creator') } className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = Object.keys(this.sections).map((name) => {
          this.sections[name].map(itemId => {
            let buttonstate=Object.keys(this.QSortButtonList).slice(1).map(button => {var obj={}; obj[button]=false; return(obj);});
            let item = items[this.index[itemId]];

            return (
                <div style={{backgroundColor: this.QSortButtonList[name].color}}>
                    <ItemStore item={ item } key={ `item-${item._id}` }>
                        <Item
                        item    =   { item }
                        user    =   { user }
                        buttons =   { (
                            <ItemStore item={ item }>
                            <QSortButtons
                                item    =   { item }
                                user    =   { user }
                                toggle  =   { this.toggle.bind(this) }
                                buttonstate = { buttonstate }
                                qsortbuttons={ this.QSortButtonList }
                                />
                            </ItemStore>
                        ) }
                        collapsed =  { false }  //collapsed if there is an active item and it's not this one
                        toggle  =   { this.toggle.bind(this) }
                        focusAction={this.props.focusAction}
                        truncateItems={this.props.resetView}
                        />
                    </ItemStore>
                </div>
            );
          })
        })
      }
    }
   
        return (
        <section id               =     "syn-panel-qsort">
            <Panel
            className   =   { name }
            ref         =   "panel"
            heading     =   {[( <h4>{ title }</h4> )]}
            >
            { content }
            </Panel>
        </section>
        );
    }
}

export default QSortItems;

import Item from './item';
