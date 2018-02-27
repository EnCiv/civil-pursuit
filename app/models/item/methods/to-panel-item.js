'use strict';

import config             from '../../../../public.json';
import sequencer          from 'promise-sequencer';

function toPanelItem (userId) {

  //console.info("toPanelItems, userId, this._id");

  return sequencer.pipe(

    () => this.populate(),

    () => this.$populated.type.populate(),

    () => Promise.all([
      this.$populated.type.getSubtype(),
      this.countVotes(),
      this.countChildren(),
      this.countHarmony(),
      this.countUpvote(userId)
    ]),

    results => new Promise((ok, ko) => {
      try {
        const {
          _id,              /** ObjectID **/
          parent,           /** ObjectID **/
          id,               /** String **/
          subject,          /** String **/
          description,      /** String **/
          image,            /** String **/
          references,       /** [{ title: String, url: String }] **/
          views,            /** Number **/
          promotions,       /** Number **/
          profiles,
          new_location
        } = this;

        const item = {
          _id,
          id,
          subject,
          description,
          image,
          references,
          views,
          promotions,
          parent,
          profiles,
          new_location
        };

        //console.info("toPanelItems.after promise subtype, this.subject");

        item.image        =   item.image || config['default item image'];
        const noIdUserProps=config['noIdUserProps'] || [];
        item.popularity   =   this.getPopularity();

        item.subtype    =   this.subtype ? this.$populated.subtype : results[0];
        item.votes      =   results[1];
        item.children   =   results[2];
        item.harmony    =   results[3];
        item.upvote     =   results[4];

        item.type       =   this.$populated.type;

        if ( 'harmony' in this.$populated.type.$populated ) {
          item.harmony.types = this.$populated.type.$populated.harmony;
        }

        item.user       =   this.$populated.user;

        let subObjects=[];
        if(typeof item.user === 'object'){
          Object.keys(item.user).forEach(userProp=>{
            if(userProp[0]==='$') 
              subObjects.push(userProp);
            else if(!noIdUserProps.includes(userProp) && !(userProp==='_id' && item.user._id === userId)) //$props are special for the prototype
              delete item.user[userProp];
          });
          subObjects.forEach(subObj=>{
            Object.keys(item.user[subObj]).forEach(userProp=>{
              if(userProp[0]!=='$' && !noIdUserProps.includes(userProp))
                delete item.user[subObj][userProp];
            })
          })
        }
        if ( typeof item.parent === 'undefined' ) {
          delete item.parent;
        }

        //console.info("toPanelItems end");

        ok(item);
      }
      catch(err) {ko(err)}
    })
  );
}

export default toPanelItem;
