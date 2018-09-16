'use strict';
// The Mechanical Turk values will be stored in class, all components that include this class will be able to access the same TASK files.  No need to React Context

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
