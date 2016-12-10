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
import QSortButtons       from './qsort-buttons';
import Icon               from './util/icon';
import Creator            from './creator';
import ItemStore          from '../components/store/item';
import Details            from './details';
import DetailsStore       from './store/details';
import EditAndGoAgain     from './edit-and-go-again';
import Harmony            from './harmony';
import update             from 'immutability-helper';
import FlipMove           from 'react-flip-move';
import QSortFlipItem      from './qsort-flip-item'


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
            color: '#e0e0ff',
            title: {
                active: "Yea! this is in the most important stack",
                inactive: "Put this in the most important stack"
            }
        },
        neutral: {
            name: 'neutral',
            color: '#e0e0f0',
            title: {
                active: "This is among the things that are neight most nor least important",
                inactive: "Put this among the things that are neight most nor least important"
            }
        },
        least: {
            name: 'least',
            color: '#ffe0e0',
            title: {
                active: "This is in the least important stack of them all",
                inactive: "Put this in the least important stack of them all"
            }
        }
    };
  
  smooth(tag,e){
    e.preventDefault();
    let link=document.getElementsByName(tag);
    this.smoothScroll(link[0].offsetTop, 500);
    //document.body.animate({scrollTop: link[0].offsetTop}, 500);
  }

  smoothScroll(target, time) {
    // time when scroll starts
    const start = new Date().getTime();

        // set an interval to update scrollTop attribute every 25 ms
        const timer = setInterval( () => {

            // calculate the step, i.e the degree of completion of the smooth scroll 
            var step = Math.min(1, (new Date().getTime() - start) / time);

            // calculate the scroll distance and update the scrollTop
            document.body['scrollTop'] = (step * target);
            document.documentElement.scrollTop=(step * target); //this if for IE!!

            // end interval if the scroll is completed
            if (step == 1) clearInterval(timer);
        }, 25);
  }


  index ={};
  state={};

//from http://stackoverflow.com/questions/25100714/for-a-deep-copy-of-a-javascript-multidimensional-array-going-one-level-deep-see
  cloneSections(section) {  
        // Deep copy arrays. Going one level deep seems to be enough.
        var clone = {};
        Object.keys(section).forEach(button => {
            clone[button]=section[button].slice(0);
        });
        return clone;
  }

  constructor(props){
      super(props);
      var newObj={};
      let unsortedLength=0;
      let buttons = Object.keys(this.QSortButtonList);
      console.info("qsort buttons", buttons);
      this.state.sections={};
      buttons.forEach(button => {
          this.state.sections[button]=[];
          newObj[button]=[];
      });
      if(props.panel && props.panel.items) {
        props.panel.items.forEach((item,i) =>{
            newObj['unsorted'].push(item._id);
            this.index[item._id]=i;
            unsortedLength++;
        });
      }
      console.info("qsort contructor section", this.state);
      if(unsortedLength){
        this.setState({'sections': newObj});
      }
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    componentWillReceiveProps(newProps){ //deleting items from sections that are nolonger in newProps is not a usecase
        let currentIndex = Object.entries(this.index);
        let unsortedLength=0;
        var newObj= this.cloneSections(this.state.sections);
        if(newProps.panel && newProps.panel.items) {
            newProps.panel.items.forEach((newItem,i) => {
                if(!(newItem._id in this.index)) {
                    newObj['unsorted'].push(newItem._id);
                    this.index[newItem._id]=i;
                    unsortedLength++;
                }else {
                    currentIndex[newItem._id]= -1; // items not marked -1 here should be deleted one day
                }
            });
        }
        if(unsortedLength){
          this.setState({'sections': this.cloneSections(newObj)});
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

  toggle (itemId, button) {
    //find the section that the itemId is in, take it out, and put it in the new section
    let i;
    let done=false;
    var clone={};
    if ( itemId && button && button !=='harmony' ) {
        Object.keys(this.QSortButtonList).forEach(
            (sectionName) => {
                if( !done && ((i = this.state.sections[sectionName].indexOf(itemId)) !== -1)) {
                    if(sectionName === button ) { 
                        //take the i'th element out of the section it is in and put it back in unsorted
                        clone[button]=update(this.state.sections[button], {$splice:  [[i,1]]  });
                        clone['unsorted']=update(this.state.sections['unsorted'],  {$unshift: [itemId] });
                        done=true;
                    } else if(sectionName === 'unsorted') { 
                        // it was in unsorted, so take it out and put it where it in the button's section
                        clone['unsorted']= update(this.state.sections['unsorted'], {$splice:  [[i,1]]  });
                        clone[button]= update(this.state.sections[button], {$unshift: [itemId] });
                        done = true;
                    } else { // the item is in some other sectionName and should be moved to this button's section
                        clone[sectionName]= update(this.state.sections[sectionName], {$splice:  [[i,1]]  });
                        clone[button]= update(this.state.sections[button],  {$unshift: [itemId] });
                        done=true;
                    }
                } else if (sectionName != button) {  // copy over the other stction byt don't overwrite the one you are modifying
                    clone[sectionName]=this.state.sections[sectionName].slice();
                }
            }
        );
        this.setState({'sections': clone});

        const timer=setTimeout(()=>{this.smoothScroll(0,500)}, 600);
    }

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const { panel, count, user, emitter } = this.props;

    let title = 'Loading items', name, loaded = false, content=[], loadMore,
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

      if ( ! Object.keys(this.index).length ) {
        content = (
          <div className="gutter text-center">
            <a href="#" onClick={ this.toggle.bind(this, null, 'creator') } className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
                Object.keys(this.QSortButtonList).forEach((name) => {
                    this.state.sections[name].forEach(itemId => {
                        let buttonstate= {}
                        Object.keys(this.QSortButtonList).slice(1).forEach(button => {buttonstate[button]=false;});
                        if(name!='unsorted') {buttonstate[name]=true; }
                            let item = items[this.index[itemId]];
                            content.push (
                                {
                                    sectionName:    name,
                                    qbuttons:       this.QSortButtonList,
                                    user:           user,
                                    item:           item,
                                    toggle:         this.toggle.bind(this),
                                    buttonstate:    buttonstate,
                                    id:             item._id
                                }
                            );
                        });
                });
            }
      }
   
        return (
        <section id               =     "syn-panel-qsort">
            <Panel
            className   =   { name }
            ref         =   "panel"
            heading     =   {[( <h4>{ title }</h4> )]}
            >
                <div className="top-articles">
                    <FlipMove>
                       { this.renderQ(content) }
                    </FlipMove>
                </div>
            </Panel>
        </section>
        );
    }

    renderQ (content){
        return (content.map( article => <QSortFlipItem {...article} key={article.id} /> ));
    }
}

export default QSortItems;

import Item from './item';