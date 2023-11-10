import React from 'react'
import Theme from '../app/components/theme'
import TopNavBar from '../app/components/top-nav-bar'
import Point from '../app/components/point'

const menu = [{ name: "Home", func: () => { } },
[{ name: "About", func: () => { } }]]


export default {
    component: TopNavBar
}

// export const Empty = () => { return <TopNavBar /> }

export const PrimaryDefault = { args: { menu: menu } }

