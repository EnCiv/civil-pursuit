'use strict';
var AWS = require('aws-sdk');
AWS.config = {
    "accessKeyId": process.env.AWSAccessKeyId,
    "secretAccessKey": process.env.AWSSecretAccessKey,
    "region": 'us-east-1',
    "sslEnabled": 'true'
};

const UsaStates=require('usa-states').UsaStates;

function getUsaState2toName(){
    const Us=new UsaStates({includeTerritories: true});
    var UsaState2toName={};
    Us.states.forEach(s=>UsaState2toName[s.abbreviation]=s.name);
    return UsaState2toName;
}
const UsaState2toName=getUsaState2toName();


class MechanicalTurk {
    static updateHITList(){
        return new Promise((ok,ko)=>{
            if(MechanicalTurk.HITTime && ((MechanicalTurk.HITTime.getTime()+1000) > (new Date()).getTime())) ok(); // don't exceed rate;
            MechanicalTurk.mturk.listHITs({},(err,data)=>{
                if(err) {
                    console.error("Mechanical Turk:", err.message);
                    ko(err.message);
                } else {
                    MechanicalTurk.HITTime=new Date();
                    MechanicalTurk.HITList=data.HITs;
                }
                ok();
            })
        })
    }

    static findHIT(hit){
        var hitRecord;
        if(MechanicalTurk.HITList){
            MechanicalTurk.HITList.some(h=>{
                if(h.HITId===hit) return (hitRecord=h);
            })
        }
        return hitRecord;
    }

    static extractProfileFromHIT(hit) {
        var result={};
        if(hit.QualificationRequirements){
            hit.QualificationRequirements.forEach(q=>{
                let l;
                if(q.QualificationTypeId!=='00000000000000000071') return; // Location Information
                if((l=q.LocaleValues) && l.length==1 ){
                    if(l[0].Subdivision){
                        return(result={state: UsaState2toName[l[0].Subdivision] }); // return full name not 2 letter code
                    }
                }
            })
        }
        return (result);
    }

    static getUserProfileForHITId(hit){
        var hitRecord;
        if(hitRecord=(MechanicalTurk.findHIT(hit)))
            return Promise.resolve(MechanicalTurk.extractProfileFromHIT(hitRecord));
        else {
            return new Promise((ok,ko)=>{
                MechanicalTurk.updateHITList().then(()=>{
                    if(hitRecord=(MechanicalTurk.findHIT(hit)))
                        ok(MechanicalTurk.extractProfileFromHIT(hitRecord));
                    else { 
                        console.error("MechanicalTurk search for HITId not found", hit)
                        return ok({});
                    }
                },ko)
            })
        }
    }
}

const endpoint = process.env.TURK_ENV==='production' ? 'https://mturk-requester.us-east-1.amazonaws.com' : 'https://mturk-requester-sandbox.us-east-1.amazonaws.com';
if(process.env.TURK_ENV==='production') console.info("TURK Running in Production!");
MechanicalTurk.mturk=new AWS.MTurk({ endpoint: endpoint });
MechanicalTurk.HITList=[];
MechanicalTurk.updateHITList().then(()=>{},()=>{});

module.exports=MechanicalTurk;

