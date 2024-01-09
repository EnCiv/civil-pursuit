import PairCompare from "../app/components/pair-compare";
import Point from "../app/components/point";
import React from 'react';

export default {
    component: PairCompare,
    args: {}
}

const pointOne = <Point subject="Point 1" description="This is the first point"/>;
const pointTwo = <Point subject="Point 2" description="This is the second point"/>;
const pointThree = <Point subject="Point 3" description="This is the third point"/>;
const pointFour = <Point subject="Point 4" description="This is the fourth point"/>;
const pointFive = <Point subject="Point 5" description="This is the fifth point"/>;
const pointSix = <Point subject="Point 6" description="This is the sixth point"/>;




export const sixPoints = {
    args: {
        mainPoint: {
            subject: "Global Warming",
            description: "Climate change and global warning"
        },
        pointList: [pointOne, pointTwo, pointThree, pointFour, pointFive, pointSix]
    }
}
