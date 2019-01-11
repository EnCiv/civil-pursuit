'use strict';

import insertPvote from "../../api/insert-pvote"
import subscribePvoteInfo from "../../api/subscribe-pvote-info"
import {spawn, exec} from 'child_process'
import DB from '../../lib/util/db'
import {ObjectID} from 'mongodb'
import "@babel/polyfill"

const COLL='pvote'

global.logger={
    info: (...args)=>console.info(...args),
    error: (...args)=>console.info(...args)
}

const userId=ObjectID("5704c217feb3d90300bb83dd");

function asyncSleep(t){
    return new Promise(ok=>setTimeout(ok,t))
}

// dummy for socket.io
var lastEmitted=[];
global.io={
    sockets: {in: (itemId)=>{ 
        return {emit: (...args)=>{console.info("itemId:",itemId,"emitted:",args);lastEmitted[itemId]=args}}
    }}
}

import util from 'util';
const pexec = util.promisify(exec);

function startUp() {
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
        var dbStdout=[];
        dbPipe.stdout.on('data', function (data) {
            dbStdout.push(data.toString('utf8'));
        });
        
        dbPipe.stderr.on('data', (data) => {
            var out;
            while(out=dbStdout.shift())
                console.log(out)
            console.log(data.toString('utf8'));
        });
        
        dbPipe.on('close', (code) => {
            console.info('Process exited with code: '+ code);
        });

        ok();
    })
}

function shutDown(){
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

async function testIt(){
    await startUp();
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

    var socketJoined;

    async function subscribe(itemId) {
        return new Promise((ok,ko)=>{
            const that={
                synuser: {id: userId}, 
                socket: {
                    join: group=>{socketJoined=group; console.info("Joined",group)},
                    emit: (...args)=>{console.info("itemId:",itemId,"emitted:",args);lastEmitted[itemId]=args}
                }
            }
            subscribePvoteInfo.call(that,itemId,(success)=>{
                if(success) return ok();
                else console.error("Failed");
            })
        })
    }

    function simpleTest(){
        return new Promise(async(ok,ko)=>{
            await resetDB();
            const itemId=ObjectID();
            await subscribe(itemId);
            var that={synuser: {id: userId}}
            const pvote={item: itemId, criteria: "first"}
            insertPvote.call(that,pvote,success=>{
                if(success){
                    console.info("Passed");
                    return ok();
                } else {
                    console.error("Failed");
                    return ok();
                }
            })
        })
    }
    
    await simpleTest();
    await asyncSleep(1000); //vote needs time to get into the db or there will be an error
    await shutDown();
}

testIt()



