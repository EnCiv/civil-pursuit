import PairCompare from "../app/components/pair-compare";
import Point from "../app/components/point";
import React from 'react';

export default {
    component: PairCompare,
    args: {}
}


export const sixPoints = {
    args: {
        mainPoint: {
            subject: "Global Warming",
            description: "Climate change and global warning"
        },
        pointList: [<Point />,<Point />,<Point />,<Point />,<Point />,<Point />,]
    }
}
