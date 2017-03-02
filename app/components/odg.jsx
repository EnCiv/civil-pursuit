'use strict';

import React from 'react';
import Icon  from './util/icon';
import smoothScroll       from '../lib/app/smooth-scroll';
import CloudinaryImage    from './util/cloudinary-image';


class CivilPursuitLogo extends React.Component {
    render(){
        return(
            <section className={ `civil-pursuit-logo-image` }>
                <a href="/">
                    <CloudinaryImage id="Synaccord_logo_64x61_znpxlc.png" transparent/>
                    <p className={ `civil-pursuit-logo-text`}>Civil Pursuit<sub>TM</sub></p>
                </a>
            </section>
        );
    }
}

class Boxes extends React.Component {

    renderChildren (width,horizontal) {
        return React.Children.map(this.props.children, child => {
            console.info("Boxes.child",width,horizontal);
            return(
                <div style={{width: width+'%', display: horizontal ? 'inline-block' : 'block'}}>
                    { child }
                </div>
            );
        });
    }
    render(){
        console.info("Boxes");
        let count=this.props.children.length;
        let horizontal= (typeof screen != 'undefined') ? screen.width > screen.height : true;
        let width = horizontal ? 100/count : 100;
        return (
        <section>
            { this.renderChildren(width, horizontal) }
        </section>
        );
    }
}

class Stack extends React.Component {
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
        let horizontal= (typeof screen != 'undefined') ? !(screen.width > screen.height) : false;
        return (
        <section style={{display: horizontal ? 'table' : 'block'}}>
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
                    parts.splice(6,['c_scale,w_'+width]);
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
        return(<div ref='image'><img classNames={this.props.classNames} style={this.props.style} src={src}/></div>);
    }
}

class OnlineDeliberationGame extends React.Component {


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
            <Boxes>
                <div>
                    <CivilPursuitLogo />
                    <div>Bridge the Political Divide</div>
                    <div>A muiliplayer deliberation game where diverse teams take on polarized issues to find solutions that unite us</div>
                </div>
                <div>
                    <CDNImg src="http://res.cloudinary.com/hrltiizbo/image/upload/v1488346232/31311905_l_Circle_Table_-_white_mqbo5o.png" />
                </div>
            </Boxes>
            <div>Find the Solutions to What Divides Us</div>
            <Boxes>
                <Stack>
                    <Icon icon="group" />
                    <div>Join a team of diverse Americans</div>
                </Stack>
                <Stack>
                    <Icon icon="arrows-alt" />
                    <div>Take on a polarized challenge</div>
                </Stack>
                <Stack>
                    <Icon icon="search" />
                    <div>Find the solution that unites your team</div>
                </Stack>
                <Stack>
                    <Icon icon="unlock-alt" />
                    <div>Proceed to the next level</div>
                </Stack>
            </Boxes>
            <div>The more you play the more real it becomes</div>
        </section>
    );
    return ( page );
  }
}

export default OnlineDeliberationGame;
