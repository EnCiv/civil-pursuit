import React from 'react';
import { userEvent, within } from "@storybook/testing-library";
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import WhyStep from '../app/components/why-step';
import expect from 'expect';
import { onDoneDecorator, onDoneResult } from "./common";
import DemInfo from '../app/components/dem-info';

export default {
    component: WhyStep,
    args: {},
    decorators: [onDoneDecorator],
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS
        },
    },
};

const createPointObj = (
    _id,
    subject,
    description = 'Point Description',
    groupedPoints = [],
    user = {
        dob: '1990-10-20T00:00:00.000Z',
        state: 'NY',
        party: 'Independent',
    }
) => {
    return {
        _id,
        subject,
        description,
        children: <DemInfo user={user} />,
    };
};

const point1 = createPointObj('1', 'Point 1', 'Point 1 Description', []);
const point2 = createPointObj(
    '2',
    'Point 2',
    'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ',
    [],
    {
        dob: '1980-10-20T00:00:00.000Z',
        state: 'GA',
        party: 'Independent',
    }
);
const point3 = createPointObj('3', 'Point 3', 'Point 3 Description', [], {
    dob: '1995-10-20T00:00:00.000Z',
    state: 'CA',
    party: 'Independent',
});
const point4 = createPointObj('4', 'Point 4', 'Point 4 Description', [], {
    dob: '1998-10-20T00:00:00.000Z',
    state: 'CO',
    party: 'Independent',
});

const defaultSharedPoints = {
    mosts: [point1, point2],
    leasts: [point3, point4],
    whyMosts: [],
    whyLeasts: [],
};

export const mostPoints = {
    args: {
        type: "most",
        intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
        shared: defaultSharedPoints
    }
};

export const leastPoints = {
    args: {
        type: "least",
        intro: "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
        shared: defaultSharedPoints
    }
};

export const mobileMostPoints = {
    args: {
        type: "most",
        intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
        shared: defaultSharedPoints
    },
    parameters: {
        viewport: {
            defaultViewport: 'iphonex',
        }
    },
};

export const mobileLeastPoints = {
    args: {
        type: "least",
        intro: "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
        shared: defaultSharedPoints
    },
    parameters: {
        viewport: {
            defaultViewport: 'iphonex',
        }
    },
};

export const onDoneTest = {
    args: {

        point: {
            subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien",
            _id: "ExampleId",
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const subjectEle = canvas.getByPlaceholderText(/type some thing here/i);
        const descriptionEle = canvas.getByPlaceholderText(/description/i);
        await userEvent.type(subjectEle, 'This is the subject!');
        await userEvent.tab(); // onDone will be called after moving out of input field

        expect(onDoneResult(canvas)).toMatchObject({
            count: 1,
            onDoneResult: { valid: false, value: { subject: 'This is the subject!', description: '' } }
        });

        await userEvent.type(descriptionEle, 'This is the description!');
        await userEvent.tab(); // onDone will be called after moving out of input field

        expect(onDoneResult(canvas)).toMatchObject({
            count: 2,
            onDoneResult: {
                valid: true,
                value: {
                    subject: 'This is the subject!',
                    description: 'This is the description!',
                }
            }
        });
    }
};
