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

export const XLargeParentDiv = () => {
    return <div style={{ width: '2000px' }}><TopNavBar menu={menuArray} /></div>
}

export const DefaultSelectedHome = {
    args: {
        menu: menuArray,
        defaultSelectedItem: "Home"
    }
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

        // expect the home button to be selected
        expect(homeButton.className).toContain("selectedItem");
        // expect the other buttons to not have bottom border
        const discussionPortalButton = canvas.getByText("Discussion Portal");
        expect(discussionPortalButton.className).not.toContain("selectedItem");
        const blogButton = canvas.getByText("Blog");
        expect(blogButton.className).not.toContain("selectedItem");

        // click the discussion portal button
        userEvent.click(discussionPortalButton);
        await Common.asyncSleep(600);
        expect(discussionPortalButton.className).toContain("selectedItem");
    },
}

export const HoverMenuGroup = {
    args: {
        menu: menuArray
    },
    play: async ({ canvasElement }) => {
        await Common.asyncSleep(1000);
        const canvas = within(canvasElement);
        const aboutButton = canvas.getByText("About \u25BE");
        userEvent.hover(aboutButton);
        await Common.asyncSleep(600);

    },
}

export const DarkMode = {
    args: {
        menu: menuArray,
        mode: "dark"
    }
}

export const DarkModeMobile = {
    args: {
        menu: menuArray,
        mode: "dark"
    },
    parameters: {
        viewport: {
            defaultViewport: 'iphonex',
        },
    },
}
