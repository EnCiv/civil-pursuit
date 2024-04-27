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
    whyMosts: [point1, point2],
    whyLeasts: [point3, point4],
};

export const mostPoints = {
    args: {
        type: "most",
        intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
        shared: defaultSharedPoints
    },
};

export const leastPoints = {
    args: {
        type: "least",
        intro: "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
        shared: defaultSharedPoints
    },
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

export const zeroPoints = {
    args: {
        type: "most",
        intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
        shared: { mosts: [], leasts: [], whyMosts: [], whyLeasts: [] },
    },

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        expect(onDoneResult(canvas)).toMatchObject({
            count: 1,
            onDoneResult: {
                valid: true,
                value: []
            }
        });
    }
};

export const empty = {
    args: {},

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        expect(onDoneResult(canvas)).toMatchObject({
            count: 1,
            onDoneResult: {
                valid: true,
                value: []
            }
        });
    }
};

export const onDoneTest = {
    args: {
        type: "most",
        intro: "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
        shared: {
            mosts: [point1, point2],
            leasts: [point3],
            whyMosts: [point1, point2],
            whyLeasts: [point3],
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const subjectEle = canvas.getAllByPlaceholderText(/type some thing here/i);
        const descriptionEle = canvas.getAllByPlaceholderText(/description/i);

        // fill in the first point subject and description
        await userEvent.type(subjectEle[0], 'This is the first subject!');
        await userEvent.tab();
        await userEvent.type(descriptionEle[0], 'This is the first description!');
        await userEvent.tab();

        // fill in the second point subject and description
        await userEvent.type(subjectEle[1], 'This is the second subject!');
        await userEvent.tab();
        await userEvent.type(descriptionEle[1], 'This is the second description!');
        await userEvent.tab();

        expect(onDoneResult(canvas)).toMatchObject({
            count: 1,
            onDoneResult: {
                valid: true,
                value: [
                    {
                        "_id": "1",
                        "subject": "Point 1",
                        "description": "Point 1 Description",
                        "children": {
                            "type": {
                                "displayName": "WithStyles(DemInfo)",
                                "defaultProps": {},
                                "__docgenInfo": {
                                    "description": "",
                                    "methods": [],
                                    "displayName": "DemInfo"
                                }
                            },
                            "key": null,
                            "ref": null,
                            "props": {
                                "user": {
                                    "dob": "1990-10-20T00:00:00.000Z",
                                    "state": "NY",
                                    "party": "Independent"
                                }
                            },
                            "_owner": null,
                            "_store": {}
                        },
                        "valid": true,
                        "answerSubject": "This is the first subject!",
                        "answerDescription": "This is the first description!"
                    },
                    {
                        "_id": "2",
                        "subject": "Point 2",
                        "description": "Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ",
                        "children": {
                            "type": {
                                "displayName": "WithStyles(DemInfo)",
                                "defaultProps": {},
                                "__docgenInfo": {
                                    "description": "",
                                    "methods": [],
                                    "displayName": "DemInfo"
                                }
                            },
                            "key": null,
                            "ref": null,
                            "props": {
                                "user": {
                                    "dob": "1980-10-20T00:00:00.000Z",
                                    "state": "GA",
                                    "party": "Independent"
                                }
                            },
                            "_owner": null,
                            "_store": {}
                        },
                        "valid": true,
                        "answerSubject": "This is the second subject!",
                        "answerDescription": "This is the second description!"
                    },
                ]
            }
        });
    }
};
