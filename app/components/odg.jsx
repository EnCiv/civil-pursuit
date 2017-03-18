'use strict';

import React from 'react';
import Icon  from './util/icon';
import smoothScroll       from '../lib/app/smooth-scroll';
import CloudinaryImage    from './util/cloudinary-image';
import ClassNames          from 'classnames';
import Footer               from './footer';


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
        var horizontal=  w > h;
        var widePercent = horizontal ? 100/count : 100;
        return (
        <section className={ClassNames(className, {horizontal: horizontal}, {vertical: !horizontal})} >
            { this.renderChildren(widePercent, horizontal) }
        </section>
        );
    }
}

class Stack extends React.Component {
// if viewport is wider than tall (desktop), lay children out vertically
// otherwise lay them out horizontally (smartphone)
    renderChildren (horizontal) {
        return React.Children.map(this.props.children, child =>{
                return (
                    <div style={{display: horizontal? 'table-cell' : 'inline-block'}}
                    className={ClassNames(this.props.className, {childhorizontal: horizontal}, {childvertical: !horizontal})}>
                        { child }
                    </div>
                );
        });
    }
    render(){
        let w=1920; // if this is running on the server, pick something
        let h=1080;
        if(typeof document !== 'undefined'){
            w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        }
        var horizontal= !(w > h);
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

    static getUrlbyHeight(src, height){
        let parts=this.props.src.split('/');
        switch(parts.length){
                case 8: // transforms not encoded eg http://res.cloudinary.com/hrltiizbo/image/upload/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png
                    parts.splice(6,0,'c_scale,h_'+height);
                    if(parts[0]==='http:') parts[0]='https:';
                    break;
                case 9: // transfroms present eg http://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_1600/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png
                    parts[4]=parts[6]+',c_scale,h_'+height; // just paste it on the end of whats there - it will override anything previous
                    if(parts[0]==='http:') parts[0]='https:';
                    break;
                default:
                    console.error("CloudinaryImage",this.props.src,"expected 8 or 9 parts got:", parts.length);
                    return(src);
        }
        return(parts.join('/'));
    }

    render(){
        let parts=this.props.src.split('/');
        let src=null;
        let width=this.state.width;
        if(this.refs.image && this.refs.image.clientWidth && this.refs.image.clientWidth > width) width=this.refs.image.clientWidth;
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

class CircleImg extends React.Component {

    state={width: 0, height: 0};

    componentDidMount() {
        let rect=this.refs.image.getBoundingClientRect();
        console.info("CircleImg.componentDidMount", rect);
        if(rect.width > 0 && rect.height >0 ) this.setState({width: rect.width, height: rect.height });
    }

    render(){

        var content=[];
        var {width, height} = this.state;
        if(width && height){
            var src=CDNImg.getURLbyHeight(this.props.src, height*this.props.r*2/100);
            content=[
                <svg width={width} height={height}>
                    <defs>
                        <pattern id="image" x={0} y={0} patternUnits="userSpaceOnUse" height={height*this.props.r*2/100} width={height*this.props.r*2/100}>
                            <image x={0} y={0} xlinkHref={this.props.src}></image>
                        </pattern>
                    </defs>
                    <circle id='top' cx={this.props.cx*width/100} cy={this.props.cy*width/100} r={height*this.props.r/100} fill="url(#image)"/>
                </svg>
            ]
        }
        return(
            <div ref="image" style={{position: "absolute", zIndex: 1}} >
                {content}
            </div>
        );
    }
}

class OnlineDeliberationGame extends React.Component {

    renderChildren () {
        return React.Children.map(this.props.children, child =>{
                return (
                    <div className={ClassNames(this.props.className, 'odg-child')}>
                        { child }
                    </div>
                );
        });
    }

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
        <section>
         <section className='odg-intro'>
            <Boxes className='odg-main-box'>
                <div className='odg-main-box-text'>
                    <CivilPursuitLogo />
                    <div className='odg-main-box-tag-line'>Bridge the Political Divide</div>
                    <div className='odg-main-box-description'>A muiliplayer deliberation game where diverse teams take on polarized issues to find solutions that unite us</div>
                </div>
                <div className='odg-main-box-image'>
                    <CircleImg cx={50} cy={50} r={30} src="http://res.cloudinary.com/hscbexf6a/image/upload/v1489551282/ojmi3fykiqtl2vqs8ru1.jpg" />
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
            <div className='odg-nothing'>The more you play the more real it gets</div>
            { this.renderChildren() }
        </section>
        <Footer />
      </section>
    );
    return ( page );
  }
}

export default OnlineDeliberationGame;
