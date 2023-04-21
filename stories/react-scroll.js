import React from 'react';
//import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils'; // ES6

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { specs, describe, it } from 'storybook-addon-specifications'

import {ReactWrapper, mount} from "enzyme";
import expect from "expect";

import Common from "./common"

import ReactScrollBar from "../app/components/util/react-scrollbar"
import SmallLayout from "../app/components/small-layout"
import StaticLayout from "../app/components/static-layout"

import { Logger } from 'log4js/lib/logger';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

class Layout extends React.Component {
    render(){
        return (
            <div style={Common.outerStyle}>
                <div ref={e=>{if(!this.topBar && e) {this.topBar=e;this.forceUpdate()}}} style={{height: "100px", position: "fixed", top: 0, left: 0, right: 0,zIndex: 2, backgroundColor: "rgba(255,255,255,.9)", margin: 0,textAlign: "center", verticalAlign: "middle"}}>Banner</div>
                <ReactScrollBar style={{}} topBar={this.topBar} extent={0}>
                    <div id="scroll-bar">
                        {this.props.children}
                    </div>
                </ReactScrollBar>
            </div>
        )
    }
}

storiesOf('ReactScrollBar', module)
.add('setup', () => {
    Common.outerSetup();
    var lines=[];
    let i=0;
    while(i++<80) lines.push(<div key={'line-'+i}>{i}</div>);
    return (
        <Layout>
            <div style={{ backgroundColor: "lightblue"}}>
                {lines}
            </div>
        </Layout>
    );

})
.add('scrollFocus at 20', ()=>{
    var topBar=undefined;
    Common.outerSetup();
    var lines=[];
    let i=0;
    while(i++<80) lines.push(<div id={'line-'+i} key={'line-'+i}>{i}</div>);

    const story=<Layout>
        <div style={{ backgroundColor: "lightblue"}}>
            {lines}
        </div>
    </Layout>

    const storyTest= async (e)=>{ // do this after the story has rendered
        Common.Wrapper=mount(story,{attachTo: e});
        await Common.asyncSleep(600);
        
        specs(()=>describe('item should be found', ()=>{
            let item=document.getElementById("line-20");
            window.Synapp.ScrollFocus(item)
            it(`Item DOM Node should be found`, function () {
                expect(item).toBeTruthy();
            });
        }))

    }
    return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;

})
.add('scrollFocus at 80', ()=>{
    var topBar=undefined;
    Common.outerSetup();
    var lines=[];
    let i=0;
    while(i++<80) lines.push(<div id={'line-'+i} key={'line-'+i}>{i}</div>);

    const story=<Layout>
        <div style={{ backgroundColor: "lightblue"}}>
            {lines}
        </div>
    </Layout>

    const storyTest= async (e)=>{ // do this after the story has rendered
        Common.Wrapper=mount(story,{attachTo: e});
        await Common.asyncSleep(600);
        
        specs(()=>describe('item should be found', ()=>{
            let item=document.getElementById("line-80");
            window.Synapp.ScrollFocus(item)
            it(`Item DOM Node should be found`, function () {
                expect(item).toBeTruthy();
            });
        }))

    }
    return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;

})

.add('scrollFocus at 78', ()=>{
    var topBar=undefined;
    Common.outerSetup();
    var lines=[];
    let i=0;
    while(i++<80) lines.push(<div id={'line-'+i} key={'line-'+i}>{i}</div>);

    const story=<Layout>
        <div style={{ backgroundColor: "lightblue"}}>
            {lines}
        </div>
    </Layout>

    const storyTest= async (e)=>{ // do this after the story has rendered
        Common.Wrapper=mount(story,{attachTo: e});
        await Common.asyncSleep(600);
        
        specs(()=>describe('item should be found', ()=>{
            let item=document.getElementById("line-78");
            window.Synapp.ScrollFocus(item)
            it(`Item DOM Node should be found`, function () {
                expect(item).toBeTruthy();
            });
        }))

    }
    return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;

})

.add('scrollFocus 40 div too large', ()=>{
    var topBar=undefined;
    Common.outerSetup();
    var lines=[];
    let i=0;
    while(i++<80) lines.push(<div id={'line-'+i} style={i===40?{height: "2000px"}:{}} key={'line-'+i}>{i}</div>);

    const story=<Layout>
        <div style={{ backgroundColor: "lightblue"}}>
            {lines}
        </div>
    </Layout>

    const storyTest= async (e)=>{ // do this after the story has rendered
        Common.Wrapper=mount(story,{attachTo: e});
        await Common.asyncSleep(600);
        
        specs(()=>describe('item should be found', ()=>{
            let item=document.getElementById("line-40");
            window.Synapp.ScrollFocus(item)
            it(`Item DOM Node should be found`, function () {
                expect(item).toBeTruthy();
            });
        }))

    }
    return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;

})

.add('scrollFocus at 1', ()=>{
    var topBar=undefined;
    Common.outerSetup();
    var lines=[];
    let i=0;
    while(i++<80) lines.push(<div id={'line-'+i} key={'line-'+i}>{i}</div>);

    const story=<Layout>
        <div style={{ backgroundColor: "lightblue"}}>
            {lines}
        </div>
    </Layout>

    const storyTest= async (e)=>{ // do this after the story has rendered
        Common.Wrapper=mount(story,{attachTo: e});
        await Common.asyncSleep(600);
        
        specs(()=>describe('item should be found', ()=>{
            let item=document.getElementById("line-1");
            window.Synapp.ScrollFocus(item)
            it(`Item DOM Node should be found`, function () {
                expect(item).toBeTruthy();
            });
        }))

    }
    return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;

})

.add('scrollFocus small area 1', ()=>{
    var topBar=undefined;
    Common.outerSetup();
    var lines=[];
    let i=0;
    while(i++<20) lines.push(<div id={'line-'+i} key={'line-'+i}>{i}</div>);

    const story=<Layout>
        <div style={{ backgroundColor: "lightblue"}}>
            {lines}
        </div>
    </Layout>

    const storyTest= async (e)=>{ // do this after the story has rendered
        Common.Wrapper=mount(story,{attachTo: e});
        await Common.asyncSleep(600);
        
        specs(()=>describe('item should be found', ()=>{
            let item=document.getElementById("line-1");
            window.Synapp.ScrollFocus(item)
            it(`Item DOM Node should be found`, function () {
                expect(item).toBeTruthy();
            });
        }))

    }
    return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;

})

.add('scrollFocus small area 20', ()=>{
    var topBar=undefined;
    Common.outerSetup();
    var lines=[];
    let i=0;
    while(i++<20) lines.push(<div id={'line-'+i} key={'line-'+i}>{i}</div>);

    const story=<Layout>
        <div style={{ backgroundColor: "lightblue"}}>
            {lines}
        </div>
    </Layout>

    const storyTest= async (e)=>{ // do this after the story has rendered
        Common.Wrapper=mount(story,{attachTo: e});
        await Common.asyncSleep(600);
        
        specs(()=>describe('item should be found', ()=>{
            let item=document.getElementById("line-20");
            window.Synapp.ScrollFocus(item)
            it(`Item DOM Node should be found`, function () {
                expect(item).toBeTruthy();
            });
        }))

    }
    return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;

})