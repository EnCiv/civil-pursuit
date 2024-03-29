import CompareReasons from "../app/components/compare-reasons";
import { onDoneDecorator, onDoneResult } from "./common";

export default {
    component: CompareReasons,
    args: {},
    decorators: [onDoneDecorator],
}

const pointOne = { subject: "Point 1", description: "This is the first point" };
const pointTwo = { subject: "Point 2", description: "This is the second point" };
const pointThree = { subject: "Point 3", description: "This is the third point" };
const pointFour = { subject: "Point 4", description: "This is the fourth point" };
const pointFive = { subject: "Point 5", description: "This is the fifth point" };
const pointSix = { subject: "Point 6", description: "This is the sixth point" };
const pointSeven = { subject: "Point 7", description: "This is the seventh point" };
const pointEight = { subject: "Point 8", description: "This is the eighth point" };
const pointNine = { subject: "Point 9", description: "This is the ninth point" };
const pointTen = { subject: "Point 10", description: "This is the tenth point" };

const pointEleven = { subject: "Point 11", description: "This is the eleventh point" };
const pointTwelve = { subject: "Point 12", description: "This is the twelfth point" };
const pointThirteen = { subject: "Point 13", description: "This is the thirteenth point" };
const pointFourteen = { subject: "Point 14", description: "This is the fourteenth point" };
const pointFifteen = { subject: "Point 15", description: "This is the fifteenth point" };
const pointSixteen = { subject: "Point 16", description: "This is the sixteenth point" };
const pointSeventeen = { subject: "Point 17", description: "This is the seventeenth point" };
const pointEighteen = { subject: "Point 18", description: "This is the eighteenth point" };


const pointList = [
    {
        subject: "Headline Issue #1",
        description: "Description for Headline Issue #1",
        reasonPoints: {
            most: [pointOne, pointTwo, pointThree, pointFour, pointFive],
            least: [pointSix, pointSeven, pointEight, pointNine, pointTen]
        }
    },
    {
        subject: "Headline Issue #2",
        description: "Description for Headline Issue #2",
        reasonPoints: {
            most: [pointEleven, pointTwelve, pointThirteen],
            least: [pointFourteen, pointFifteen, pointSixteen]
        }
    },
    {
        subject: "Headline Issue #3",
        description: "Description for Headline Issue #3",
        reasonPoints: {
            most: [pointSeventeen, pointEighteen],
            least: []
        }
    }
]


export const threePointLists = {
    args: {
        pointList,
        side: "most",
    }
}
