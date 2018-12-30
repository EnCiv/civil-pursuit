'use strict';

import {SubscribeQvoteInfo} from "../../api/subscribe-qvote-info"
import {spawn} from 'child_process'
import DB from '../../lib/util/db'
import {ObjectID} from 'mongodb'

const userId=ObjectID("5704c217feb3d90300bb83dd");

const dbPipe = spawn('mongod', ['--dbpath=./test', '--port', '27017'])
dbPipe.stdout.on('data', function (data) {
    console.log(data.toString('utf8'));
});

dbPipe.stderr.on('data', (data) => {
    console.log(data.toString('utf8'));
});

dbPipe.on('close', (code) => {
    console.info('Process exited with code: '+ code);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// dummy for socket.io
var lastEmitted;
var io={
    sockets: {in: ()=>{ 
        return {emit: (...args)=>{lastEmitted=args}}
    }}
}

function testIt(){
    async function asyncTestIt(){ // 12/29/2018 suddenly getting runtime Reference Error: regeneratorRuntime is not defined  if async if front of parent
        await DB.connect("mongodb://localhost:27017/test");
        try{ await DB.db.collection('qvote').drop();} // delete the collection
        catch(err){ if(!(err.name==='MongoError' && (err.errmsg==='ns not found' || err.code===26 || err.codeName==='NamespaceNotFound'))) throw (err); } // if the collection didn't exist, ignore the error

        var items=[];
        var itemId=ObjectID();
        for(let i=0;i<10;i++){
            items.push({item: itemId, criteria: ['most','neutral','least'][i%3], user: userId})
        }
        await DB.db.collection('qvote').insertMany(items);
        var qvotes = await DB.db.collection('qvote').find({}).toArray();
        console.info("qvotes:", qvotes);
        var result=await SubscribeQvoteInfo.getTotals(itemId,userId);
        console.info("result",result)
        var lastVote=await SubscribeQvoteInfo.getLastVote(itemId,userId);
        console.info("lastVote:",lastVote)

        var users=[];
        var items=[];
        let n;
        for(n=0;n<2;n++){
            items.push(ObjectID());
            users.push(ObjectID());
        }

        var prepItem=await SubscribeQvoteInfo.prepItem(items[0],users[0]);
        console.info("prepItem", prepItem);
        //for(let u of users){
        //    for(let i of items){
        //        SubscribeQvoteInfo.insert({user: u, item: i, criteria: ['most','neutral','least'][getRandomInt(0,2)]})
        //    }
        //}

        console.info("lastEmitted:", lastEmitted);
        
        SubscribeQvoteInfo.flush(async ()=>{
            console.info("lastEmitted after flush:", lastEmitted);
            await DB.close(); // make sure everything gets flushed before killing the db
            dbPipe.kill('SIGINT'); // kills the mongod process as well
        })
    }
    asyncTestIt();
}

testIt().catch(err=>{dbPipe.kill('SIGINT');console.error("testIt: there was an error", err)});



