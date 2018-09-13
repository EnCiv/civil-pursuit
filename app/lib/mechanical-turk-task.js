'use strict';

class MechanicalTurkTask {
    static setFromProps(props){
        if(props.MechanicalTurkTask) {
            MechanicalTurkTask.assignmentId=props.MechanicalTurkTask.assignmentId;
            MechanicalTurkTask.turkSubmitTo=props.MechanicalTurkTask.turkSubmitTo;
            MechanicalTurkTask.hitId=props.MechanicalTurkTask.hitId;
        }
    }
}

export default MechanicalTurkTask;
