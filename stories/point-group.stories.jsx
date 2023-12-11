import React from 'react';
import Common from './common';
import { expect } from '@storybook/jest';
import PointGroup from '../app/components/point-group';
import Point from '../app/components/point';
import PointLeadButton from '../app/components/point-lead-button'


export default {
    component: PointGroup,
}

const createPoint = (subject, description = "Point Description", vState = "default", children = null, groupedPoints = []) => {
    return <Point subject={subject} description={description} />;
}

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

const point1 = createPoint("Point 1", "Point 1 Description");
const point2 = createPoint("Point 2", "Point 2 Description");
const point3 = createPoint("Point 3", "Point 3 Description");


export const DefaultSinglePoint = { args: { pointObj: point1, vState: 'default' } };
export const EditSingPoint = { args: { pointObj: point1, vState: 'edit' } };
export const ViewSinglePoint = { args: { pointObj: point1, vState: 'view' } };

export const Empty = () => { return <PointGroup /> };