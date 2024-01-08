import React from 'react';
import { expect } from '@storybook/jest';
import PointGroup from '../app/components/point-group';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';



export default {
    component: PointGroup,
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS,
        },
    }
};

const createPointObj = (_id, subject, description = "Point Description", groupedPoints = []) => {
    return {
        subject,
        description,
        groupedPoints,
    }
};


function DemInfoTestComponent(props) {
    const { vState } = props
    const theme = Theme
    return (
        <div
            style={{
                color: vState === 'selected' ? theme.colors.success : '#5D5D5C',
                ...theme.font,
                fontSize: '1rem',
                fontWeight: '400',
                lineHeight: '1.5rem',
            }}
        >
            DemInfo | Component
        </div>
    )
}

const point1 = createPointObj("1", "Point 1", "Point 1 Description");

const point2 = createPointObj("2", "Point 2", "Point 2 Description");
const point3 = createPointObj("3", "Point 3", "Point 3 Description");
const point4 = createPointObj("4", "Point 4", "Point 4 Description");
const point5 = createPointObj("5", "Point 5", "Point 5 Description", [point2, point3, point4]);



export const Empty = () => { return <PointGroup /> };

export const DefaultSinglePoint = { args: { pointObj: point1, defaultVState: 'default' } };
export const EditSingPoint = { args: { pointObj: point1, defaultVState: 'edit' } };
export const ViewSinglePoint = { args: { pointObj: point1, defaultVState: 'view' } };

export const defaultMultiplePoints = { args: { pointObj: point5, defaultVState: 'default' } };
export const editMultiplePoints = { args: { pointObj: point5, defaultVState: 'edit' } };
export const viewMultiplePoints = { args: { pointObj: point5, defaultVState: 'view' } };

export const mobileDefaultPoints = {
    args: { pointObj: point5, defaultVState: 'default', isMobile: true },
    parameters: {
        viewport: {
            defaultViewport: 'iphonex',
        },
    },
};
