#!/usr/bin/env node
'use strict';

var MongoClient = require('mongodb').MongoClient;
var { ObjectId } = require('mongodb');

var arg;
var argv=process.argv;
var sourceJSON;
var destinationDB;
var client;

for(arg=2;arg<argv.length;arg++){
    switch(argv[arg]){
        case "src":
            arg+=1;
            sourceJSON=argv[arg];
            break;
        case "dst":
            arg+=1;
            destinationDB=argv[arg];
            break;
    }
}
var jObj=require(sourceJSON);

var checkErrors=(documents)=>{
    var ids={};
    var errors=0;
    documents.forEach(document=>{
        let id=document.id;
        if(!id) {
            console.error("this document has no id", document);
            errors+=1;
        }
        if(id.length !== 5) return;
        if(ids[id]){
            console.error("this one already exists:", id);
            errors+=1;
        } else {
            ids[id]={count: 0};
        }
        if(document._id && document._id.length===5 && document._id !=id){
            console.error("this id",id, "is not equal to it's _id",document._id);
            errors+=1;
        }
    });
    documents.forEach(document=>{
        let id=document.parent;
        if(id && id.length===5){
            if(ids[id])
                ids[id].count++;
            else {
                console.error("this document references a parent that does not exist",document);
                errors+=1;
            }
        }
        if(document.harmony && document.harmony.length){
            document.harmony.forEach((id,i)=>{
                if(id.length && id.length===5){
                    if(ids[id]){
                        ids[id].count++;
                    }else{
                        console.error("this id isn't defined", id, "but it's referenced by this document's harmony array", document);
                        errors+=1;
                    }
                }
            })
        }
        Object.keys(ids).forEach(id=>{
            if(ids.count===0){
                console.info("this id was never referenced", id);
                errors+=1;
            }
        })
    })
    return errors;
}

var createTypes=(discussion)=>{
    return new Promise((ok,ko)=>{
        var ids={};
        var db;
        function openDB(){
            MongoClient.connect(destinationDB).then(result=>{
                client=result;
                db=client.db();
                createThem();
            },
            err=>console.error("failed to open",destinationDB,err));
        }

        var upsert=(collection,obj,next)=>{
            if(obj._id && (typeof obj._id === 'string')){
                if(obj._id.length>5) obj._id=toOid(obj._id);
                else if(obj._id.length===5) delete obj._id;
                else console.error("upsert obj._id unknown type", obj);
            }

            db.collection(collection).findOneAndReplace({id: obj.id},obj,{upsert: true, returnNewDocument: true}).then(
                upserted=>{
                    if(upserted.lastErrorObject && upserted.lastErrorObject.upserted)
                        obj._id=upserted.lastErrorObject.upserted;
                    else if(upserted.value)
                        obj._id=upserted.value._id;
                    else 
                        console.error("upserted didn't return an _id", upserted);
                    if(upserted.value)
                        Object.assign(obj, Object.assign({},upserted.value,obj));
                    if(ids[obj.id]) ids[obj.id]._id=obj._id; else ids[obj.id]={_id: obj._id};
                    next(); // all done, now lets link them
                },  // fields from the dB not in the .json should be preserved, but fields in the .json should override
                err=>{console.error("findOneAndReplace error", collection, err, obj.id, obj.name ); ko(err);}
            )
        }

        function createThem(){
            var allSent=false;
            var needsUpdate=0;
            discussion.types.forEach(document=>{

                needsUpdate++;
                upsert("types",document,()=>{if(--needsUpdate<=0 && allSent) linkThem()})
            })
            allSent=true;
            if(needsUpdate<=0)
                linkThen(); 
        }

        var linkObjects = (obj)=>{
            if(obj instanceof ObjectId) return;
            if(typeof obj === "object"){
                if(Array.isArray(obj)){
                    obj.forEach((val,i)=>{
                        if(typeof val==='string' && val.length===5 && ids[val])
                            obj[i]=ids[val]._id;
                        else if(typeof(val)==='object')
                            linkObjects(val);
                })} else {
                    Object.keys(obj).forEach(key=>{ 
                        if(typeof obj[key] === 'object') {
                            if(obj[key]['$oid']){
                                obj[key]=ObjectId(obj[key]['$oid']);
                            } else
                                linkObjects(obj[key]);
                        } else if(key!=='id' && typeof obj[key] === 'string' && obj[key].length===5 && ids[obj[key]])
                            obj[key]=ids[obj[key]]._id;
                    })
                }
            }
        }

        var linkThem=()=>{
                discussion.types.forEach(doc=>linkObjects(doc));
                updateThem();
        }

        var updateThem=()=>{
            Promise.all(discussion.types.map(doc=>{
                //var update={};
                //if(doc.parent) update.parent=doc.parent;
                //if(doc.harmony && doc.harmony.length) update.harmony=doc.harmony;
                //if(!Object.keys(update).length) return null; // if nothing changed, no need to update
                return db.collection("types").update({_id: doc._id}, {...doc}).then(
                    (result)=>{},     
                    err=>{console.info("updateThem update error", err)}
                )}
            )).then(
                Parent,
                (err)=>{console.error("something went wrong: ", err); client.close(); process.exit(1)}
            )
        }

        var allDone=()=>{
            console.info("all done"); 
            Object.keys(ids).forEach(k=>console.info(k,ids[k]._id)); 
            client.close(); 
            process.exit(0)
        }

        function toOid(id){
            if(typeof id === "string" && id.length>5) return ObjectId(id);
            if(typeof id === "object" && id['$oid']) return ObjectId(id['$oid']);
            else return id;
        }

        var Parent=()=>{
            if(!discussion.Parent) return allDone();
            discussion.Parent.user=toOid(discussion.Parent.user);
            linkObjects(discussion.Parent);
            upsert("items", discussion.Parent, uploadComponentItems);
        }

        var uploadComponentItems=()=>{
            const components=['RuleList', 'PanelQuestions'];
            var upserted=0, allSent=false;
            const pId= discussion.Parent._id;
            for(let component of components){
                if(discussion[component]){
                    let tId= discussion.types.find(t=>t.component===component)._id;
                    discussion[component].forEach(item=>{
                        ++upserted;
                        item.parent=pId;
                        item.type=tId;
                        item.user=toOid(item.user);
                        upsert("items",item,()=>{if(--upserted<=0 && allSent) allDone() })
                    });
                }
            }
            allSent=true;
            if(upserted<=0){
                allDone();
            }
        }

        openDB();
    })
}

var errors=checkErrors(jObj.types);
if(!jObj.Parent) {
    console.error("Parent missing from input");
    errors+=1;
} 
if(!jObj.RuleList){
    console.warn("Warning no RuleList");
}
if(!jObj.PanelQuestions){
    console.warn("Warning no PanelQuestions");
}
if(!errors)
    createTypes(jObj);
else
    console.info(errors, "errors detected");
