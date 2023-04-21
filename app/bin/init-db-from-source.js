'use strict';

import DB from "../lib/util/db"
import "@babel/polyfill"

var arg;
var argv=process.argv;
var destinationDB;
var sourceDB;

for(arg=2;arg<argv.length;arg++){
    switch(argv[arg]){
        case "src":
            arg+=1;
            sourceDB=argv[arg];
            break;
        case "dst":
            arg+=1;
            destinationDB=argv[arg];
            break;
    }
}


// copy these collections from the source to the destination, including their index setup.
const copyCollections=['config','countries','criterias','discussions','educations','employments','marital_statuses','political_party','political_tendency','races','state','trainings','users'];

// initialize these collections including their indexes, but don't copy any data
const initCollections=['feedback','items','qvote','types','upvote','votes'];

class localDB {  //DB is a static class, wrap it so we can have multiple instances
    connect(url){
        return DB.connect.call(this,url);
    }
    close(){
        return DB.close.call(this)
    }
}

const sDB=new localDB();
const dDB=new localDB();
var collectionsInAction=0;

async function initDbFromSource() {
    await dDB.connect(destinationDB);
    const collections=await dDB.db.listCollections().toArray();
    if(collections && collections.length>1){
        console.error("the database is not empty:",collections.length, "collections exist:", ...collections.map(c=>c.name))
        dDB.close();
        process.exit();
    }

    await sDB.connect(sourceDB);

    copyCollections.forEach(async collection=>{
        collectionsInAction+=1;
        const indexes=await sDB.db.collection(collection).indexes();
        for(let i in indexes) delete indexes[i].ns;  // the name space from sourceDB includes the db name and will conflict with the new db
        await dDB.db.collection(collection).createIndexes(indexes);
        const docs=await sDB.db.collection(collection).find({}).toArray();
        await dDB.db.collection(collection).insertMany(docs);
        if(--collectionsInAction <= 0){
            sDB.close();
            dDB.close();
        }
        console.info("collection in action", collectionsInAction)
    })
    initCollections.forEach(async collection=>{
        collectionsInAction+=1;
        const indexes=await sDB.db.collection(collection).indexes();
        for(let i in indexes) delete indexes[i].ns;  // the name space from sourceDB includes the db name and will conflict with the new db
        await dDB.db.collection(collection).createIndexes(indexes);
        if(--collectionsInAction <= 0){
            sDB.close();
            dDB.close();
        }
        console.info("collection in action", collectionsInAction)
    })
}

initDbFromSource();