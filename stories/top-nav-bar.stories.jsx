import React from 'react'
import Theme from '../app/components/theme'
import TopNavBar from '../app/components/top-nav-bar'
import Point from '../app/components/point'

const menu = [{ name: "Home", func: () => { } },
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

export const PrimaryDefault = { args: { menu: menu } }

