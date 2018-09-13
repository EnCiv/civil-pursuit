'use strict';

import {MongoClient} from 'mongodb';


export default class DB {
    // static client;
    // static db;
    static connect(url){
        url= url || process.env.MONGO_URL || 'mongodb://@localhost';
        if(this.client) return Promise.resolve();
        return new Promise((ok,ko)=>{
            MongoClient.connect(url, { useNewUrlParser: true }, (err, result)=>{
                if(err) {console.error("error connection", err); return ko(err);}
                if(!result) {console.error("error connecting no db!"); return ko(err);}
                this.client=result;
                this.db=result.db();
                ok();
            });
        });
    }
    static close(){
        this.client && this.client.close((err,result)=>{this.client=undefined; this.db=undefined;});
    }
}

