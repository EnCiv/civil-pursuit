'use strict';

import enterDiscussion from "../../api/enter-discussion"
import {spawn} from 'child_process'
import DB from '../../lib/util/db'
import {ObjectID} from 'mongodb'
import "@babel/polyfill"
import Mungo from 'mungo'

const COLL="pvote";
global.logger={
    info: (...args)=>console.info(...args),
    error: (...args)=>console.info(...args)
}


const userId=ObjectID("5704c217feb3d90300bb83dd");
const dbPipe = spawn('mongod', ['--quiet', '--dbpath=./test', '--port', '27017'])
var dbStdout=[]; // accumulate stdout info - it's noisy

dbPipe.stdout.on('data', function (data) {
    dbStdout.push(data.toString('utf8'));
    //console.info(data.toString('utf8'));
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
    console.info('Process exited with code: '+ code);
});

function asyncSleep(t){
    return new Promise(ok=>setTimeout(ok,t))
}

async function finished(){
    await DB.close(); // make sure everything gets flushed before killing the db
    await Mungo.disconnect();
    const shutdown=spawn('mongo', ['--eval', "db.getSiblingDB('admin').shutdownServer();quit()"]);
    shutdown.on('close',code=>{
        if(!code) return;
        console.info('Shutdown process exited with code', code);
    })
}

async function MungoStart(url){
    return new Promise((ok, ko) => {
        Mungo.connect(url)
          .on('error', error => { logger.error("Mungo connection error", {error}); return( ko );})
          .on('connected', ok);
      })
}

async function testIt(){
    await MungoStart("mongodb://localhost:27017/test?connectTimeoutMS=3000000");
    await DB.connect("mongodb://localhost:27017/test?connectTimeoutMS=3000000");


    function resetDB(){
        return new Promise(async (ok,ko)=>{
            try{ 
                await DB.db.collection("types").drop().catch(err=>{
                    if(!(err.name==='MongoError' && (err.errmsg==='ns not found' || err.code===26 || err.codeName==='NamespaceNotFound'))) 
                        throw (err); // delete the collection
                    else {
                        console.info("types wasn't there")
                        return;
                    }
                });
                console.info("types was dropped")
                await DB.db.collection(COLL).drop().catch(err=>{
                    if(!(err.name==='MongoError' && (err.errmsg==='ns not found' || err.code===26 || err.codeName==='NamespaceNotFound'))) 
                        throw (err); // delete the collection
                    else {
                        console.info(COLL, "wasn't there")
                        return;
                    }
                });
                console.info(COLL,"is not there");
                ok();
            } 
            catch(err){ 
                if(!(err.name==='MongoError' && (err.errmsg==='ns not found' || err.code===26 || err.codeName==='NamespaceNotFound'))) 
                    throw (err); 
                //ok();
                return;
            }
        })
    }

    const itemId=ObjectID();
    var discussionId;

    function simpleTest(){
        return new Promise(async(ok,ko)=>{
            await resetDB();
            enterDiscussion(itemId,1000,dId=>{
                if(!dId)
                    console.info("Failed");
                else{
                    discussionId=dId;
                    console.info("Passed",discussionId);
                }
                ok();
            })
        })
    }



    function testAgain(){
        return new Promise(async(ok,ko)=>{
            //don't reset the db we need the data from simpleTest
            enterDiscussion(itemId,1000,dId=>{
                if(!dId)
                    console.info("Failed")
                else {
                    if(discussionId===dId)
                        console.info("Passed",discussionId);
                    else
                        console.info("Failed");
                }
                ok();
            })
        })
    }

    function testLater(){
        return new Promise(async(ok,ko)=>{
            //don't reset the db we need the data from simpleTest
            await asyncSleep(1100); // wait longer than the discussion duration
            enterDiscussion(itemId,1000,dId=>{
                if(!dId)
                    console.info("Failed")
                else {
                    if(discussionId!==dId)
                        console.info("Passed",dId);
                    else
                        console.info("Failed");
                }
                ok();
            })
        })
    }
    
    await simpleTest();
    await testAgain();
    await testLater();
    finished()
}

testIt()



