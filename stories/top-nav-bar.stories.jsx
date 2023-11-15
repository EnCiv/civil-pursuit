import React from 'react';
import TopNavBar from '../app/components/top-nav-bar';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import Common from './common';
import { expect } from '@storybook/jest';
import { userEvent, within } from "@storybook/testing-library";

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

export const ClickMenuItem = {
    args: {
        menu: menuArray
    },
    play: async ({ canvasElement }) => {
        await Common.asyncSleep(1000);
        const canvas = within(canvasElement);
        const homeButton = canvas.getByText("Home");
        userEvent.click(homeButton);
        await Common.asyncSleep(600);

        // expect the home button to be selected and have bottom border
        expect(homeButton).toHaveClass("selectedItem");
        expect(homeButton).toHaveStyle("border-bottom: 2px solid black");
        // expect the other buttons to not have bottom border
        const discussionPortalButton = canvas.getByText("Discussion Portal");
        expect(discussionPortalButton).not.toHaveClass("selectedItem");
        expect(discussionPortalButton).not.toHaveStyle("border-bottom: 2px solid black");
        const blogButton = canvas.getByText("Blog");
        expect(blogButton).not.toHaveClass("selectedItem");
        expect(blogButton).not.toHaveStyle("border-bottom: 2px solid black");

        // click the discussion portal button
        userEvent.click(discussionPortalButton);
        await Common.asyncSleep(600);
        expect(discussionPortalButton).toHaveClass("selectedItem");
        expect(discussionPortalButton).toHaveStyle("border-bottom: 2px solid black");


    },
}


