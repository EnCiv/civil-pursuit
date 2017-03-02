'use strict';

import React from 'react';
import Icon  from './util/icon';
import smoothScroll       from '../lib/app/smooth-scroll';
import CloudinaryImage    from './util/cloudinary-image';
import ClassNames          from 'classnames';


class CivilPursuitLogo extends React.Component {
    render(){
        return(
            <section className={'civil-pursuit-logo-image'}>
                    <CloudinaryImage id="Synaccord_logo_64x61_znpxlc.png" transparent/>
                    <p>Civil Pursuit<sub>TM</sub></p>
            </section>
        );
    }
}

class Boxes extends React.Component {
// if viewport is wider than tall (desktop), lay children out horizontally
// otherwise lay them out vertically (smartphone)
    renderChildren (width,horizontal) {
        return React.Children.map(this.props.children, child => {
            console.info("Boxes.child",width,horizontal);
            return(
                <div style={{width: width+'%', display: horizontal ? 'inline-block' : 'block'}}
                className={ClassNames(this.props.className, {childhorizontal: horizontal}, {childvertical: !horizontal})}
                >
                    { child }
                </div>
            );
        });
    }
    render(){
        console.info("Boxes");
        const {className}=this.props;
        let count=this.props.children.length;
        let w=1920; // if this is running on the server, pick something
        let h=1080;
        if(typeof document !== 'undefined'){
            w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        }
        let horizontal=  w > h;
        let width = horizontal ? 100/count : 100;
        return (
        <section className={ClassNames(className, {horizontal: horizontal}, {vertical: !horizontal})} >
            { this.renderChildren(w, horizontal) }
        </section>
        );
    }
}

class Stack extends React.Component {
// if viewport is wider than tall (desktop), lay children out vertically
// otherwise lay them out horizontally (smartphone)
    renderChildren (horizontal) {
        return React.Children.map(this.props.children, child =>{
            if(horizontal){
                return (
                    <div style={{display: 'table-cell'}}>
                        { child }
                    </div>
                );
            }else{
                return (
                    child
                );
            }
        });
    }
    render(){
        let w=1920; // if this is running on the server, pick something
        let h=1080;
        if(typeof document !== 'undefined'){
            w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        }
        let horizontal= !(w > h);
        const {className}=this.props;
        return (
        <section style={{display: horizontal ? 'table' : 'block'}}
            className={ClassNames(className, {horizontal: horizontal}, {vertical: !horizontal})} 
        >
            { this.renderChildren(horizontal) }
        </section>
        );
    }
}

class CDNImg extends React.Component {
    state={width: 0};

    componentDidMount() {
        let width=this.refs.image.clientWidth;
        console.info("CDNImg.copnentDidMount", width);
        if(width > 0) this.setState({width: width});
    }

    render(){
        let parts=this.props.src.split('/');
        let src=null;
        let width=this.state.width;
        if(width){
            switch(parts.length){
                case 8: // transforms not encoded eg http://res.cloudinary.com/hrltiizbo/image/upload/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png
                    parts.splice(6,0,'c_scale,w_'+width);
                    if(parts[0]==='http:') parts[0]='https:';
                    src=parts.join('/');
                    break;
                case 9: // transfroms present eg http://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_1600/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png
                    parts[4]=parts[6]+',c_scale,w_'+width; // just paste it on the end of whats there - it will override anything previous
                    if(parts[0]==='http:') parts[0]='https:';
                    src=parts.join('/');
                    break;
                default:
                    console.error("CloudinaryImage",this.props.src,"expected 8 or 9 parts got:", parts.length);
                    src=this.props.src;
                    break;
            }
        }
        console.info("CDNImg src=", src);
        return(<div ref='image'><img className={this.props.className} style={this.props.style} src={src}/></div>);
    }
}

class OnlineDeliberationGame extends React.Component {

    resize = null;

    componentDidMount() {
        this.resize=this.resizeListener.bind(this);
        window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    resizeListener(){
        console.info("OnlineDeliberationGame.resizeListener");
        this.forceUpdate();
    }


  smooth(tag,e){
    e.preventDefault();
    let link=document.getElementsByName(tag);
    smoothScroll(link[0].offsetTop, 500);
    //document.body.animate({scrollTop: link[0].offsetTop}, 500);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const page = (
        <section className='odg-intro'>
            <Boxes className='odg-main-box'>
                <div className='odg-main-box-text'>
                    <CivilPursuitLogo />
                    <div className='odg-main-box-tag-line'>Bridge the Political Divide</div>
                    <div className='odg-main-box-description'>A muiliplayer deliberation game where diverse teams take on polarized issues to find solutions that unite us</div>
                </div>
                <div className='odg-main-box-image'>
                    <CDNImg src="http://res.cloudinary.com/hrltiizbo/image/upload/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png" />
                </div>
            </Boxes>
            <div className='odg-intro-tag-line'>Find the Solutions to What Divides Us</div>
            <Boxes className='odg-icon-box'>
                <Stack className='odg-icon-stack'>
                    <Icon icon="arrows-alt" />
                    <p>Take on a polarized challenge</p>
                </Stack>
                <Stack className='odg-icon-stack'>
                    <Icon icon="group" />
                    <p>Join a team of diverse Americans</p>
                </Stack>
                <Stack className='odg-icon-stack'>
                    <Icon icon="search" />
                    <p>Find the solution that unites your team</p>
                </Stack>
                <Stack className='odg-icon-stack'>
                    <Icon icon="unlock-alt" />
                    <p>Proceed to the next level</p>
                </Stack>
            </Boxes>
            <div className='odg-trailer'>The more you play the more real it becomes</div>
        </section>
    );
    return ( page );
  }
}

export default OnlineDeliberationGame;
