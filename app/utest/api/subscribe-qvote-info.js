'use strict';

import {SubscribeQvoteInfo} from "../../api/subscribe-qvote-info"
import {spawn} from 'child_process'
import DB from '../../lib/util/db'
import {ObjectID} from 'mongodb'
import "@babel/polyfill"

global.logger={
    info: (...args)=>console.info(...args),
    error: (...args)=>console.info(...args)
}


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
var lastEmitted=[];
global.io={
    sockets: {in: (itemId)=>{ 
        return {emit: (...args)=>{console.info("itemId:",itemId,"emitted:",args);lastEmitted[itemId]=args}}
    }}
}

function asyncSleep(t){
    return new Promise(ok=>setTimeout(ok,t))
}

async function testIt(){
    await DB.connect("mongodb://localhost:27017/test?connectTimeoutMS=3000000");
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
    for(n=0;n<40;n++){
        items.push(ObjectID());
        users.push(ObjectID());
    }

    //var prepItem=await SubscribeQvoteInfo.prepItem(items[0],users[0]);
    //console.info("prepItem", prepItem);

    var jobs=[]
    users.forEach(u=>{
        items.forEach(async i=>{
            jobs.push(()=>{
                //console.info("job insert",i,u)
                SubscribeQvoteInfo.insert({user: u, item: i, criteria: ['most','neutral','least'][getRandomInt(0,2)]})
                //console.info("job flush",i,u)
                //SubscribeQvoteInfo.flush().then(()=>jobs.shift()());
                //console.info("job after flush",i,u);
                jobs.shift()();
            })
        })
    })

    jobs.push(async ()=>{
        showQvoteInfoEmitted()
        //await asyncSleep(10000);
        //console.info("after sleep")
        //showQvoteInfoEmitted()
        await SubscribeQvoteInfo.pollPending()
        console.info("lastEmitted after poll:");
        showQvoteInfoEmitted()
        await asyncSleep(1);
        await DB.close(); // make sure everything gets flushed before killing the db
        dbPipe.kill('SIGINT'); // kills the mongod process as well
    })

    jobs.shift()(); // start the jobs
}

function showQvoteInfoEmitted(){
    console.info("showQvoteInfoEmitted:", Object.keys(lastEmitted).length);
    Object.keys(lastEmitted).forEach(itemId=>{
        var info=lastEmitted[itemId][1];
        var string='['+itemId+']:';
        Object.keys(info).forEach(criteria=>{
            string=string+criteria+'='+lastEmitted[itemId][1][criteria].count+' ';
        })
        console.info(string);
    })
}

testIt()



