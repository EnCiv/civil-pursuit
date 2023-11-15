import React from 'react'
import TopNavBar from '../app/components/top-nav-bar'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const menuFunc = (name) => {
    console.log(`Menu item ${name} clicked`)
}

const createMenuItem = (name) => {
    return { name: name, func: () => { menuFunc(name) } }
}

const menuArray = [createMenuItem("Home"),
createMenuItem("Discussion Portal"),
createMenuItem("Blog"),
[createMenuItem("About"), createMenuItem("Contact"), createMenuItem("FAQ")],
[createMenuItem("Our Work"), createMenuItem("Work 1"), createMenuItem("Work 2")]]



export default {
    component: TopNavBar,
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS,
        },
    },
}

export const Empty = () => { return <TopNavBar /> }

export const StandardMenu = { args: { menu: menuArray } }

export const MobileMode = {
    args: {
        menu: menuArray,
    },
    parameters: {
        viewport: {
            defaultViewport: 'iphonex',
        },
    },
}

export const SmallParentDiv = () => {
    return <div style={{ width: '700px' }}><TopNavBar menu={menuArray} /></div>
}

export const LargeParentDiv = () => {
    return <div style={{ width: '1200px' }}><TopNavBar menu={menuArray} /></div>
}

