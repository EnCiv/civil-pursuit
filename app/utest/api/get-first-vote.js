'use strict';

import getFirstVote from "../../api/get-first-vote"
import {spawn} from 'child_process'
import DB from '../../lib/util/db'
import {ObjectID} from 'mongodb'
import "@babel/polyfill"

const COLL="pvote";
global.logger={
    info: (...args)=>console.info(...args),
    error: (...args)=>console.info(...args)
}


const userId=ObjectID("5704c217feb3d90300bb83dd");
const dbPipe = spawn('mongod', ['--quiet', '--dbpath=./test', '--port', '27017'])
var dbStdout=[]; // accumulate stdout info - it's noisy

dbPipe.stdout.on('data', function (data) {
    //console.log(data.toString('utf8'));
    dbStdout.push(data.toString('utf8'));
    ;
});

dbPipe.stderr.on('data', (data) => {
    // if there's been an error flush all the stdout info first
    let out;
    while(out=dbStdout.shift)
        console.log(out);
    console.log(data.toString('utf8'));
});

dbPipe.on('close', (code) => {
    if(!code) return;
    console.info('Process exited with code: '+ code);
});

function asyncSleep(t){
    return new Promise(ok=>setTimeout(ok,t))
}

async function finished(){
    await DB.close(); // make sure everything gets flushed before killing the db
    const shutdown=spawn('mongo', ['--eval', "db.getSiblingDB('admin').shutdownServer();quit()"]);
    shutdown.on('close',code=>{
        if(!code) return;
        console.info('Shutdown process exited with code', code);
    })
}

async function testIt(){
    await DB.connect("mongodb://localhost:27017/test?connectTimeoutMS=3000000");

    function resetDB(){
        return new Promise(async (ok,ko)=>{
            try{ 
                await DB.db.collection(COLL).drop(); // delete the collection
                ok();
            } 
            catch(err){ 
                if(!(err.name==='MongoError' && (err.errmsg==='ns not found' || err.code===26 || err.codeName==='NamespaceNotFound'))) 
                    throw (err); 
                ok();
            } // if the collection didn't exist, ignore the error
        })
    }

    function simpleTest(){
        return new Promise(async(ok,ko)=>{
            await resetDB();
            var items=[];
            var itemId=ObjectID();
            items.push({_id: ObjectID(), item: itemId, criteria: 'first', user: userId})
            items.push({_id: ObjectID(), item: itemId, criteria: 'second', user: userId})
            items.push({_id: ObjectID(), item: itemId, criteria: 'first', user: userId})
            await DB.db.collection(COLL).insertMany(items);
            var that={synuser: {id: userId}}
            getFirstVote.call(that,itemId,'first',first=>{
                if(first && first===items[0]._id.toString())
                    console.info("Passed");
                else 
                    console.info("Failed");
                ok();
            })
        })
    }

    function simpleNoUser(){
        return new Promise(async(ok,ko)=>{
            var that={};
            var itemId=ObjectID();
            getFirstVote.call(that,itemId,'first',first=>{
                if(first)
                    console.info("Failed");
                else 
                    console.info("Passed");
                ok();
            })
        })
    }

    function itemIdNotThere(){
        return new Promise(async(ok,ko)=>{
            await resetDB();
            var items=[];
            var itemId=ObjectID();
            items.push({_id: ObjectID(), item: itemId, criteria: 'first', user: userId})
            items.push({_id: ObjectID(), item: itemId, criteria: 'second', user: userId})
            items.push({_id: ObjectID(), item: itemId, criteria: 'first', user: userId})
            await DB.db.collection(COLL).insertMany(items);
            var that={synuser: {id: userId}}
            getFirstVote.call(that,ObjectID(),'first',first=>{
                if(first && first===items[0]._id.toString())
                    console.info("Failed", first);
                else 
                    console.info("Passed");
                ok();
            })
        })
    }
    
    await simpleTest();
    await simpleNoUser();
    await itemIdNotThere();
    finished()
}

testIt()



