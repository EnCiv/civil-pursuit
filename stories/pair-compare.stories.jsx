import PairCompare from "../app/components/pair-compare";
import Point from "../app/components/point";
import { onDoneDecorator, onDoneResult } from "./common";
import { within, userEvent } from '@storybook/testing-library';
import expect from 'expect';
import React from 'react';

export default {
    component: PairCompare,
    args: {},
    decorators: [onDoneDecorator],
}

const pointOne = <Point subject="Point 1" description="This is the first point" />;
const pointTwo = <Point subject="Point 2" description="This is the second point" />;
const pointThree = <Point subject="Point 3" description="This is the third point" />;
const pointFour = <Point subject="Point 4" description="This is the fourth point" />;
const pointFive = <Point subject="Point 5" description="This is the fifth point" />;
const pointSix = <Point subject="Point 6" description="This is the sixth point" />;




export const sixPoints = {
    args: {
        mainPoint: {
            subject: "Global Warming",
            description: "Climate change and global warning"
        },
        pointList: [pointOne, pointTwo, pointThree, pointFour, pointFive, pointSix]
    }
}

export const onDoneTest = {
    args: {
        mainPoint: {
            subject: "Global Warming",
            description: "Climate change and global warning"
        },
        pointList: [pointOne, pointTwo, pointThree, pointFour]
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const Point1 = canvas.getByText("Point 1");
        await userEvent.click(Point1);

        setTimeout(() => { // wait for transition to occur
            const Point3 = canvas.getByText("Point 3");
            userEvent.click(Point3);
        }, 500)

        setTimeout(() => {
            const Point4 = canvas.getByText("Point 4");
            userEvent.click(Point4)
        }, 1300);

        setTimeout(() => {
            expect(onDoneResult(canvas)).toMatchObject({
                count: 2,
                onDoneResult: {
                    valid: true,
                    value: {
                        props: {
                            description: "This is the fourth point",
                            subject: "Point 4"
                        }
                    }
                }
            })

        }, 1500)

    }
}
