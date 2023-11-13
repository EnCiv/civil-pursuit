import React from 'react'
import Theme from '../app/components/theme'
import TopNavBar from '../app/components/top-nav-bar'

const menuArray = [{ name: "Home", func: () => { } },
{ name: "Discussion Portal", func: () => { } },
{ name: "Blog", func: () => { } },
[{ name: "About", func: () => { } },
{ name: "Contact", func: () => { } },
{ name: "FAQ", func: () => { } }],
[{ name: "Our Work", func: () => { } },
{ name: "Work 1", func: () => { } },
{ name: "Work 2", func: () => { } }]]


export default {
    component: TopNavBar
}

export const Empty = () => { return <TopNavBar /> }

export const PrimaryDefault = { args: { menu: menuArray } }

export const SmallParentDiv = () => {
    return <div style={{ width: '600px' }}><TopNavBar menu={menuArray} /></div>
}

export const LargeParentDiv = () => {
    return <div style={{ width: '1200px' }}><TopNavBar menu={menuArray} /></div>
}

export const phoneMode = () => {
    return <div style={{ width: '400px' }}><TopNavBar menu={menuArray} /></div>
}

