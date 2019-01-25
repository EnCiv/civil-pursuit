'use strict';

import PVote from '../../models/pvote';
import {spawn,exec} from 'child_process'
import DB from '../../lib/util/db'
import {ObjectID} from 'mongodb'
import "@babel/polyfill"

const COLL="pvote";
global.logger={
    info: (...args)=>console.info(...args),
    error: (...args)=>console.info(...args)
}

const Ntests=10;

const userId=ObjectID("5704c217feb3d90300bb83dd");

import util from 'util';
const pexec = util.promisify(exec);

export function startUp() {
    return new Promise(async (ok,ko)=>{
        try{
            const { stdout, stderr } = await pexec('mkdir test');
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        }
        catch(err){
            if(err.code!==1){
                console.info(err);
                ko(err);
            } 
            //else just fall through and continue
        }

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

        ok();
    })
}

export function shutDown(){
    return new Promise(async (ok,ko)=>{
        await DB.close(); // make sure everything gets flushed before killing the db
        const shutdown=spawn('mongo', ['--eval', "db.getSiblingDB('admin').shutdownServer();quit()"]);
        shutdown.on('close',code=>{
            if(!code) return ok();
            console.error('Shutdown process exited with code', code);
            ko();
        })
    })
}

// unit test that want to test with PVote will need to startup and shutdown before hand
//
const PVoteTest={startUp: startUp, shutDown: shutDown};
export default PVoteTest;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// dummy for socket.io
var lastEmitted=[];
global.io={
    sockets: {in: (itemId)=>{ 
        return {emit: (...args)=>{
            let event=args[0].split('-');
            if(event[1]!==itemId){
                console.error("emit PvoteInfo Id did not match", itemId,args[0])
            }
            console.info("itemId:",itemId,"emitted:",args);
            lastEmitted[itemId]=args
        }}
    }}
}

function asyncSleep(t){
    return new Promise(ok=>setTimeout(ok,t))
}

async function testIt(){
    await startUp();
    await DB.connect("mongodb://localhost:27017/test?connectTimeoutMS=3000000");

    function resetDB(){
        lastEmitted=[];
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
            for(let i=0;i<10;i++){
                items.push({item: itemId, criteria: ['most','neutral','least'][i%3], user: userId})
            }
            await DB.db.collection(COLL).insertMany(items);
            var pvotes = await DB.db.collection(COLL).find({}).toArray();
            console.info("pvotes:", pvotes);
            var result=await PVote.getTotals(itemId,userId);
            console.info("result",result)
            var lastVote=await PVote.getLastVote(itemId,userId);
            console.info("lastVote:",lastVote)
            if(result._ownVote.criteria==='most' && result._ownVote.lastId.toString()===lastVote.lastId.toString() && result._ownVote.criteria===lastVote.criteria)
                console.info("Passed!");
            else
                console.error("Failed");
            ok();
        })
    }
    

    //var prepItem=await PVote.prepItem(items[0],users[0]);
    //console.info("prepItem", prepItem);

    function bulkUserItemTest(){
        return new Promise(async(ok,ko)=>{
            var users=[];
            var items=[];
            let n;
            for(n=0;n<Ntests;n++){
                items.push(ObjectID());
                users.push(ObjectID());
            }

            await resetDB();
            var jobs=[]
            users.forEach(u=>{
                items.forEach(async i=>{
                    jobs.push(async ()=>{
                        PVote.insert({user: u, item: i, criteria: ['most','neutral','least'][getRandomInt(0,2)]})
                        if(Math.random()>0.5){
                            jobs.shift()();
                            return;
                        }
                        await asyncSleep(Math.random*10)
                        jobs.shift()();
                    })
                })
            })
            jobs.push(async ()=>{
                showPVoteInfoEmitted()
                await PVote.pollPending()
                console.info("lastEmitted after poll:");
                let total=showPVoteInfoEmitted()
                if(total===(Ntests*Ntests)) console.info("Passed!",total)
                else console.error("Failed:", total, "expected", (Ntests*Ntests))
                await asyncSleep(10000);
                await asyncSleep(1);
                ok();
            })
            jobs.shift()(); // start the jobs
        })
    }


    function randomizedTest(){
        return new Promise(async(ok,ko)=>{

            var users=[];
            var items=[];
            let n;
            for(n=0;n<Ntests;n++){
                items.push(ObjectID());
                users.push(ObjectID());
            }

            await resetDB();

            users.forEach(u=>{
                items.forEach(i=>{
                    setTimeout(()=>PVote.insert({user: u, item: i, criteria: ['most','neutral','least'][getRandomInt(0,2)]}),Math.random()*500)
                })
            })
        
            await asyncSleep(1000);
            showPVoteInfoEmitted()
            await PVote.pollPending()
            console.info("lastEmitted after poll:");
            showPVoteInfoEmitted()
            await asyncSleep(10000);
        
            console.info("now do it again")
            users.forEach(u=>{
                items.forEach(i=>{
                    setTimeout(()=>PVote.insert({user: u, item: i, criteria: ['most','neutral','least'][getRandomInt(0,2)]}),Math.random()*500)
                })
            })
            await PVote.pollPending()
            await asyncSleep(10000);
            console.info("lastEmitted after poll:");
            let total=showPVoteInfoEmitted();
            if(total===(Ntests*Ntests)) console.info("Passed!",total)
            else console.error("Failed:", total, "expected", (Ntests*Ntests))
            await asyncSleep(10000);
            ok();
        })
    }

    await simpleTest();
    await bulkUserItemTest();
    await randomizedTest();
    await shutDown();
}



function showPVoteInfoEmitted(){
    let totalVotes=0;
    console.info("showPVoteInfoEmitted:", Object.keys(lastEmitted).length);
    Object.keys(lastEmitted).forEach(itemId=>{
        var info=lastEmitted[itemId][1];
        var string='['+itemId+']:';
        var votes=0;
        Object.keys(info).forEach(criteria=>{
            string=string+criteria+'='+lastEmitted[itemId][1][criteria].count+' ';
            votes+=lastEmitted[itemId][1][criteria].count
        })
        string+='votes: '+votes;
        console.info(string);
        totalVotes+=votes;
    })
    return totalVotes;
}

testIt()



