'use strict';

import React from 'react';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import injectSheet from 'react-jss'
import cx from 'classnames'
import {JoinForm} from '../join'
import Input from '../util/input'
import Icon from '../util/icon'

class DebugOverlay extends React.Component {
    constructor(props){
        super(props);
        this.debug=React.createRef();
        this.state={enable: !!this.props.enable}
    }
    enable(enable){
        this.setState({enable})
    }
    info(str){
        if(this.debug.current) this.debug.current.innerText=str+'\n'+this.debug.current.innerText;
    }
    render(){
        const {enable}=this.state;
        return(<div className='debug-overlay' style={{display: enable ? 'block' : 'none', position: 'fixed', top: 0, left: 0, whiteSpace: 'pre-wrap', width: '100vw', height: '100vh', padding: '2em', background: '#ffffff00', pointerEvents: 'none', zIndex: 100}} ref={this.debug}></div>)
    }
}

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: '', info: '' };
    }
  
    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ hasError: true, error: error, info: info });
      // You can also log the error to an error reporting service
      //logger.error(error, info);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
            <div>
                <h1>Something went wrong.</h1>
                <div style={{whiteSpace: 'pre-wrap'}}>
                <label>Info</label>
                {JSON.stringify(this.state.info)}
                </div>
                <div style={{whiteSpace: 'pre-wrap'}}>
                <label>Error</label>
                {JSON.stringify(this.state.error)}
                </div>
            </div>
        );
      }
      return this.props.children;
    }
  }

/**
 * parent - the parent of the items being created.
 * type - the type of the item being create
 * 
 */


 class InlineJoinForm extends JoinForm {
     constructor(props){
         super(props);
     }

    render() {
        const className=this.props.className;
        const {info, successMessage, validationError}=this.state;
        return (
            <React.Fragment>
                <Input className={className} type="email" block autoFocus medium required placeholder="Email" ref="email" name="email" onChange={this.onChangeActive.bind(this)} />
                <Input className={className} type="password" required placeholder="Password" ref="password" medium name="password" onChange={this.onChangeActive.bind(this)} />
                <Input className={className} type="password" required placeholder="Confirm password" ref="confirm" medium name="confirm" onChange={this.onChangeActive.bind(this)} />
                <a className={className} href="#" onClick={this.agree.bind(this)}>
                    <Icon className={className} icon="square-o" size="2" ref="agree" name="agree" />
                </a>
                <span className={className}>I agree to the </span>
                <a className={className} href="/page/terms-of-service" target="_blank">Terms of Service</a>
                <button className={className} onClick={this.signup.bind(this)} disabled={!this.state.joinActive}>Join</button>
                {info && <span className={className}>{info}</span>}
                {successMessage && <span className={className}>{successMessage}</span>}
                {validationError && <span className={className} style={{color: 'red'}}>{validationError}</span>}
            </React.Fragment>
        )
    }
 }

const TransitionTime=500;
const TopMargin='0vh'
const Font='0.6vw'

const styles = {
    'participant': {
        'display': 'inline',
        '--width': '50vw',
        'width': 'var(--width)',
        'height': 'calc(var(--width) * 0.5625)',
        'transition': `all ${TransitionTime}ms linear`,
        'background': 'white',

        '$$speaking': {
        },
        '&$nextUp': {
            '--width': '20vw'
        },
        '&$seat2, &$seat3, &$seat4': {
            '--width': '15vw'
        },
        '&$finishUp': {
            '--width': '1vw'
        },
        '&$begin': {
            'background': '#62229f',
        }
    },
    'box': {
        'display': 'inline',
        'vertical-align': 'top',
        'position': 'absolute',
        'transition': 'all .5s linear'
    },
    outerBox: {
        'display': 'block',
        width: '100vw',
        height: `calc((50vw + 15vw) * 0.5625 + 5vh + 1.5vh + ${TopMargin})`
    },
    beginBox: {
        backgroundColor: '#f0f0f0e0',
        position: 'absolute',
        top: 0
    },
    beginButton: {
        color: 'white',
        background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': `calc(2 * ${Font})`,
        'padding': `calc(1 * ${Font})`
    },
    hangUpButton: {
        width: '12vw',
        position: 'absolute',
        left: '25vw',
        color: 'white',
        background: 'linear-gradient(to bottom, #ff6745 0%,#ff5745 51%,#ff4745 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': `calc(2 * ${Font})`,
        'padding': `calc(${Font})`
    },
    'speaking': {
        left: 'calc(2.5vw + 20vw + 2.5vw)',
        top: `${TopMargin}`
    },
    'nextUp': {
        left: '2.5vw',
        top: `calc( (50vw - 20vw) * 0.5625 + ${TopMargin})`,
    },
    'seat2': {
        left: 'calc(1.25vw)',
        top: `calc(50vw * 0.5625 + 5vh + ${TopMargin})`,
    },
    'seat3': {
        left: 'calc(1.25vw + 15vw + 1.25vw)',
        top: `calc(50vw * 0.5625 + 5vh + ${TopMargin})`,
    },
    'seat4': {
        left: 'calc(1.25vw + 15vw + 1.25vw + 15vw + 1.25vw)',
        top: `calc(50vw * 0.5625 + 5vh + ${TopMargin})`,
    },
    'finishUp': {
        left: 'calc(100vw / 2)',
        top: `calc(((50vw + 15vw) * 0.5625 + 5vh + 1.5vw + ${TopMargin}) / 2)`,
    },
    'finishButton': {
        width: '12vw',
        position: 'absolute',
        right: '25vw',
        color: 'white',
        background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': `calc(2 * ${Font})`,
        'padding': `calc(${Font})`,
        '&:disabled': {
            'text-decoration': 'none',
            'background': 'lightgray'
        }
    },
    'talkative': {
        background: 'yellow'
    },
    'videoFoot': {
        'text-align': 'center',
        'color': '#404',
        'font-weight': '600'
    },
    'agenda': {
        position: 'absolute',
        top: `${TopMargin}`,
        left: 'calc(2.5vw + 20vw + 2.5vw + 50vw + 2.5vw)',
        height: 'calc(25vw * 0.5625)',
        'font-weight': '600',
        'font-size': '125%',
        width: '15vw',
        display: 'table',
        'transition': 'all .5s linear',
        '&$finishUp': {
            left: 'calc(100vw / 2)',
            top: `calc(((25vw + 15vw) * 0.5625 + 5vh + 1.5vw + ${TopMargin}) / 2)`,
            height: '1vh',
            'font-size': '1%'
        }

    },
    'innerAgenda': {
        'vertical-align': 'middle',
        'display': 'table-cell'
    },
    'agendaItem': {
        'font-weight': '200'
    },
    'thanks': {
        'font-size': "200%",
        'font-weight': '600',
    },
    'begin': {},
    'join': {
        'margin-right': '1em',
        'button&': {
            'margin-left': '1em',
            'padding-top': '0.5em',
            'padding-bottom': '0.5em',
            '&:disabled': {
                'text-decoration': 'none',
                'background': 'lightgray'
            }
        },
        'a&': {
            'margin-right': '0.25em'
        },
        'i&': {
            'margin-right': 0
        }
    },
    'subOpening': {
        'font-size': "0.56vw",
        'font-weight': '100',
        'lineHeight': "200%",
        'margin-bottom': '2em'
    },
    'opening': {
        'font-size': "1vw",
        'font-weight': '600',
        'lineHeight': "2vw"
    },
}


const participants = {
    moderator: {
        speaking: ['https://res.cloudinary.com/hscbexf6a/video/upload/v1547852517/polarization-0-moderator.mp4', 'https://res.cloudinary.com/hscbexf6a/video/upload/v1547852517/polarization-1-moderator.mp4', 'https://res.cloudinary.com/hscbexf6a/video/upload/v1547854678/polarization-2-moderator.mp4'],
        speakingObjectURLs: [],
        speakingImmediate: [],
        listening: 'https://res.cloudinary.com/hscbexf6a/video/upload/ac_none/v1547853938/polarization-listening-moderator.mp4',
        listeningObjectURL: null,
        listeningImmediate: false,
        agenda: [['Who you are', 'Where you are', 'Your political party or belief'], ['Should we do something about political polarization', 'Why or Why Not'],['What did you think?']]
    },
    audience1: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547439786/qian-intro.mp4', 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547439195/qian-polarization.mp4'],
        speakingObjectURLs: [],
        speakingImmediate: [],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547439660/qian-silence.mp4',
        listeningObjectURL: null,
        listeningImmediate: false
    },
    audience2: {
        speaking: ['https://res.cloudinary.com/hscbexf6a/video/upload/v1547855641/polarization-0-audience2a.mp4', 'https://res.cloudinary.com/hscbexf6a/video/upload/v1547855641/polarization-1-audience2a.mp4'],
        speakingObjectURLs: [],
        speakingImmediate: [],
        listening: 'https://res.cloudinary.com/hscbexf6a/video/upload/ac_none/v1547858141/polarization-listening-audience2a.mp4',
        listeningObjectURL: null,
        listeningImmediate: false
    },
    human: {},
    audience3: {
        speaking: ['https://res.cloudinary.com/hscbexf6a/video/upload/v1547856641/polarization-0-audience3.mp4', 'https://res.cloudinary.com/hscbexf6a/video/upload/v1547856641/polarization-1-audience3.mp4'],
        speakingObjectURLs: [],
        speakingImmediate: [],
        listening: 'https://res.cloudinary.com/hscbexf6a/video/upload/ac_none/v1547856945/polarization-listening-audience3.mp4',
        listeningObjectURL: null,
        listeningImmediate: false
    }
}

const seating = ['speaking', 'nextUp', 'seat2', 'seat3', 'seat4']
const seatToName={
    speaking: "Speaking",
    nextUp: "Next Up",
    seat2: "Seat #2",
    seat3: "Seat #3",
    seat4: "Seat #4"
}

class AskWebRTC extends React.Component {
    render() {
        return (
            <ErrorBoundary>
                <ReactActionStatePath {...this.props}>
                    <RASPAskWebRTC />
                </ReactActionStatePath>
            </ErrorBoundary>
        )
    }
}

class RASPAskWebRTC extends ReactActionStatePathClient {

    requestPermissionElements = [];
    uploadQueue=[];
    preFetchList=[];
    constructor(props) {
        super(props, 'speaker', 0);
        if(typeof window !== 'undefined'){
            if(window.env==='development')
                this.rotateButton=true;
        } else {
            if(process.env.NODE_ENV==='development')
                this.rotateButton=true;
        }
        this.createDefaults();
        this.human = React.createRef();
        this.moderator = React.createRef();
        this.audience1 = React.createRef();
        this.audience2 = React.createRef();
        this.audience3 = React.createRef();
        this.debugOverlayRef=React.createRef();
        this.fixupLeft=this.fixupLeft.bind(this);
        this.requestPermission=this.requestPermission.bind(this);
        if(typeof window !== 'undefined')
            window.onresize=this.onResize.bind(this);

    }

    debugOverlay(str){
        if(this.debugOverlayRef.current) this.debugOverlayRef.current.info(str);
    }

    state = {
        errorMsg: '',
        seatOffset: 0,
        round: 0
    }

    componentDidMount() {
        if(window.MediaSource){
            this.mediaSource = new MediaSource();
            this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen.bind(this), false);
        }
        this.preFetchObjectURL('moderator',true,0);
        this.preFetchObjectURL('audience1',false,0);
        this.preFetchObjectURL('audience2',false,0);
        this.preFetchObjectURL('audience3',false,0);
        this.preFetchObjectURL('moderator',false,0);
        this.preFetchObjectURL('audience1',true,0);
        this.preFetchObjectURL('audience2',true,0);
        this.preFetchObjectURL('audience3',true,0);        
        this.preFetchObjectURL('moderator',true,1);
        this.preFetchObjectURL('audience1',true,1);
        this.preFetchObjectURL('audience2',true,1);
        this.preFetchObjectURL('audience3',true,1);        
        this.preFetchObjectURL('moderator',true,2);
        //this.initMedia();
    }

    componentWillUnmount() {
        this.stopRecording();
        this.releaseCamera();
    }

    onResize(){
        this.forceUpdate(()=>{setTimeout(()=>{ // We have to wait out the transition all time 
            let left=this.topRef.getBoundingClientRect().x;
            if(!left) return;
            left=parseFloat(this.state.left)-left;
            this.setState({left: left+'px'})
            },TransitionTime);
        });
    }

    // force it all the way to the left
    fixupLeft(e){
        if(e){
            this.topRef=e;
            let left=e.getBoundingClientRect().x;
            this.setState({left: -left + 'px'})
        }
    }

    releaseCamera() {
        if (this.stream && this.stream.getTracks) {
            var tracks = this.stream.getTracks();
            tracks.forEach(track => track.stop())
        }
    }

    handleSourceOpen(event) {
        console.log('MediaSource opened');
        this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', sourceBuffer);
    }

    async initMedia() {
        const constraints = {
            audio: {
                echoCancellation: { exact: true }
            },
            video: {
                width: 1280, height: 720
            }
        };
        console.log('Using media constraints:', constraints);
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.handleSuccess(stream);
        } catch (e) {
            console.error('navigator.getUserMedia error:', e);
        }
    }

    handleSuccess(stream) {
        console.log('getUserMedia() got stream:', stream);
        this.stream = stream;
        this.human.current.srcObject = stream;
        Object.keys(participants).forEach(part => this.nextMediaState(part))
    }

    startRecording() {
        this.debugOverlay(`startRecording`);
        this.recordedBlobs = [];
        if (!this.mediaRecorder) {
            if(typeof MediaRecorder === 'undefined'){
                this.debugOverlay(`MediaRecorder not supported`);
                this.setState({noMediaRecorder: true})
                return;
            }else{
                this.debugOverlay(`MediaRecorder exists`);
            }
            let options = { mimeType: 'video/webm;codecs=vp9' };
            try{
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.error(`${options.mimeType} is not Supported`);
                this.debugOverlay(`${options.mimeType} is not Supported`);
                options = { mimeType: 'video/webm;codecs=vp8' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.error(`${options.mimeType} is not Supported`);
                    this.debugOverlay(`${options.mimeType} is not Supported`);
                    options = { mimeType: 'video/webm' };
                    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                        console.error(`${options.mimeType} is not Supported`);
                        this.debugOverlay(`${options.mimeType} is not Supported`);
                        options = { mimeType: '' };
                    }
                }
            }}
            catch(err){
                this.debugOverlay(`MediaRecorder.isTypeSupported ${options.mimeType} caught error`);
            }
            this.debugOverlay(`startRecording before try options.mimeType: ${options.mimeType}`);
            try {
                this.mediaRecorder = new MediaRecorder(this.stream, options);
                this.debugOverlay(`startRecording succeeded`);
            } catch (e) {
                console.error('Exception while creating MediaRecorder:', e);
                this.debugOverlay(`Exception while creating MediaRecorder: ${e.toString()}`);
                return;
            }

            console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

            this.mediaRecorder.onstop = (event) => {
                console.log('Recorder stopped: ', event);
                this.downloadRecording();
            };
        }
        this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
        this.mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', this.mediaRecorder);
        this.debugOverlay(`startRecording started`);
    }

    handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            this.recordedBlobs.push(event.data);
        }
    }


    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop()
            console.log('Recorded Blobs: ', this.recordedBlobs);
        }
    }

    downloadRecording() {
        const blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
        const {seatOffset, round}=this.state;
        let oldSeatOffset = seatOffset + 1 % Object.keys(participants).length;
        let seat=this.seat(Object.keys(participants).indexOf('human'), oldSeatOffset);

        if (this.props.user) {
            return this.upload(blob,seat,round,this.props.user.id)
        } else {
            this.uploadQueue.push([blob,seat,round])
        }

        /* save the blob to a file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
        */
    }

    // for the given seatOffset and round, fetch the object, or start the media
    nextMediaState(part) {
        this.debugOverlay(`nextMediaState part:${part}`);
        if (part === 'human') return;
        // humans won't get here
        var { round } = this.state;

        let speaking = (this.seat(Object.keys(participants).indexOf(part)) === 'speaking')

        var objectURL;
        if (speaking) {
            if (!(objectURL = participants[part].speakingObjectURLs[round]))
                participants[part].speakingImmediate[round]=true;
        } else {
            if (!(objectURL = participants[part].listeningObjectURL))
                participants[part].listeningImmediate=true;
        }
        if (objectURL)
            this.playObjectURL(part, objectURL, speaking);
    }

    preFetchObjectURL(part,speaking,round){
        if(this.preFetchList.length){
            return this.preFetchList.push([part,speaking,round]);
        }
        const url=speaking ? (participants[part].speaking[round] || participants[part].listening) : participants[part].listening;
        console.info("preFetchObjectURL", part, url, speaking, round)
        this.debugOverlay(`preFetchObjectURL part:${part} url:${url} speaking:${speaking} round:${round}`);
        fetch(url)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(async blob => {
                var objectURL = URL.createObjectURL(blob);
                if (speaking) {
                    participants[part].speakingObjectURLs[round] = objectURL;
                    if(participants[part].speakingImmediate[round]){
                        this.playObjectURL(part, objectURL, speaking);
                        participants[part].speakingImmediate[round]=false;
                    }
                } else {
                    participants[part].listeningObjectURL = objectURL;
                    if(participants[part].listeningImmediate){
                        this.playObjectURL(part, objectURL, speaking);
                        participants[part].listeningImmediate=false;
                    }
                } 
                var args;
                if(args=this.preFetchList.shift()){
                    return this.preFetchObjectURL(...args)
                }
            })
            .catch(err => {
                this.debugOverlay(`pre fetch caught error: ${err.toString()}`);
                logger.error("AskWebRTC.preFecthObjectURL fetch caught error", url, err)
                var args;
                if(args=this.preFetchList.shift()){
                    return this.preFetchObjectURL(...args)
                }
            })
    }

    async playObjectURL(part, objectURL, speaking) {
        this.debugOverlay(`playObjectURL part:${part} objectURL:${objectURL}`);
        let element = this[part].current;
        element.src = null;
        element.srcObject = null;
        element.src = objectURL;
        try {
            await element.play()
        }
        catch (err) {
            if (err.name === "NotAllowedError") {
                this.requestPermissionElements.push(element);
                this.setState({ requestPermission: true });
            } else if (err.name === "AbortError") {
                this.requestPermissionElements.push(element);
                this.setState({ requestPermission: true });
            } else {
                this.debugOverlay(`play caught error: ${err.toString()}`);
                logger.error("AskWebRTC.startPlayback caught error", err.name);
            }
        }
    }

    async requestPermission(e) {
        try {
            var element;
            while (element = this.requestPermissionElements.shift())
                element.play();
            this.setState({ requestPermission: false });
        }
        catch (err) {
            if (err.name === "NotAllowedError") {
                this.setState({ requestPermission: true });
            }
            else {
                this.debugOverlay(`requestPermission caught error: ${err.toString()}}`);
                logger.error("AskWebRTC.startPlayback caught error", err.name)
            }
        }
    }

    seat(i, seatOffset) {
        if (this.state.finishUp) return 'finishUp';
        if (typeof seatOffset === 'undefined') seatOffset = this.state.seatOffset;
        return seating[(seatOffset + i) % seating.length]
    }

    rotateOrder() {
        var { seatOffset, round } = this.state;
        if (this.recordTimeout) {
            clearTimeout(this.recordTimeout);
            this.recordTimeout = 0;
        }
        if (this.talkativeTimeout) {
            clearTimeout(this.talkativeTimeout);
            this.talkativeTimeout = 0;
        }
        seatOffset -= 1;
        var followup = [];
        if (seatOffset === 0) round += 1; // back to the moderator, switch to the next round
        if (seatOffset < 0) {
            if (participants.moderator.speaking[round + 1])
                seatOffset = seating.length - 1; // moderator just finished, he moves to the back of the order
            else
                return this.hangup();
        }
        Object.keys(participants).forEach((participant, i) => {
            let oldChair = this.seat(i);
            let newChair = this.seat(i, seatOffset);
            var element = this[participant].current
            console.info("rotateOrder", participant, seatOffset, element.muted, element.loop)
            if (participant === 'human') {
                if (newChair === 'seat2') {
                    if(round===0)
                        return this.startRecording();
                } else if (oldChair === 'seat2') {
                    if(round===0)
                        return this.stopRecording();
                } else if (newChair === 'speaking') {
                    this.talkativeTimeout = setTimeout(() => this.setState({ talkative: true }), 3 * 60 * 1000)
                    this.recordTimeout = setTimeout(() => this.rotateOrder(), 5 * 60 * 1000)
                    return this.startRecording();
                } else if (oldChair === 'speaking')
                    return this.stopRecording();
            } else if (oldChair === 'speaking' || newChair === 'speaking') { // will be speaking 
                followup.push(() => this.nextMediaState(participant));
            } else {
                console.info("participant continue looping", participant, element.loop)
            }
        })
        this.debugOverlay(`rotateOrder: ${seatOffset}\n`);
        this.setState({ seatOffset, round, talkative: false}, () => { let func; while (func = followup.shift()) func(); })
    }

    hangup() {
        setTimeout(() => {
            this.releaseCamera();
            this.setState({ done: true });
        }, 1.5* TransitionTime);
        return this.setState({ finishUp: true });
    }

    upload(blob,seat,round,userId) {
        var stream = ss.createStream();
        stream.on('error',(err)=>logger.error("AskWebRTC.upload socket stream error:",err))

        var name = userId + '-' + round + '-' + seat + '.mp4';

        ss(window.socket).emit('upload video', stream, { name, size: blob.size });

        var bstream=ss.createBlobReadStream(blob, {highWaterMark: 1024 * 200}).pipe(stream); // high hiwWaterMark to increase upload speed
        bstream.on('error',(err)=>logger.error("AskWebRTC.upload blob stream error:",err))
        stream.on('end',()=>{
            var uploadArgs;
            if(uploadArgs=this.uploadQueue.shift()){
                this.setState({progress: `uploading. ${this.uploadQueue.length} segments to go`})
                return this.upload(...uploadArgs)
            } else {
                this.setState({progress: 'uploading. complete.', uploadComplete: true})
                console.info("upload after login complete");
            }
        })
        setTimeout(()=>console.info("stream:", stream, "bstream:", bstream), 1000)
    }

    onUserLogin(info){
        console.info("onUserLogin",info);
        const {userId}=info;
        this.uploadQueue.forEach(args=>{
            args.push(userId);
        })
        var uploadArgs;
        if(uploadArgs=this.uploadQueue.shift()){
            this.upload(...uploadArgs)
        }
        this.setState({progress: `uploading. ${this.uploadQueue.length} segments to go`})
    }

    render() {
        const { user, parent, className, classes } = this.props;
        const { finishUp, done, begin, requestPermission } = this.state;

        const beginOverlay=()=>(
            !begin &&
                <div className={cx(classes['outerBox'],classes['beginBox'])}>
                    <div className={cx(className, classes['box'], classes['speaking'])} key='begin-banner'>
                        <div className={cx(className, classes['participant'], classes['speaking'])}>
                            <div style={{width: "50vw", height: "calc(50vw * 0.5625)"}}>
                                <div style={{ width: '100%', height: '100%', display: 'table' }} >
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                                        <div><span className={classes['opening']}>
                                        <p>You are about to experience a new kind of web conference</p>
                                        <p style={{color: 'darkviolet', fontSize: '90%'}}>For productive, large scale, dialog and deliberation</p>
                                        <p>This test experience will connect you with several people by video, in a new way.</p>
                                        <p style={{color: 'darkviolet', fontSize: '90%'}}>The topic of the discussion is:</p>
                                        <p style={{fontSize: '110%'}}>Can We Bridge the Political Divide?</p></span></div>
                                        <div><span className={classes['subOpening']}>You will be placed in Seat #3. Your video will be stored locally, but not actually shared with anyone unless you agree, at the end. This discussion takes about 7 minutes</span></div>
                                        <div><button className={classes['beginButton']} onClick={()=>this.setState({begin: true},()=>this.initMedia())}>Begin</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes['videoFoot']}><span>{'Seat 3'}</span></div>
                    </div>
                </div>
        )

        const permissionOverlay=()=>(
            requestPermission &&
                <div className={cx(classes['outerBox'],classes['beginBox'])}>
                    <div style={{ width: '100%', height: '100%', display: 'table' }} >
                        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                            <div><span className={classes['thanks']}>The browser wants your permission to continue</span></div>
                            <div><button className={classes['beginButton']} onClick={this.requestPermission}>Continue</button></div>
                        </div>
                    </div>
                </div>
        )

        if (done) {
            return (
                <section id="syn-ask-webrtc" key='began' style={{position: 'relative', left: this.state.left, width: '100vw'}} ref={this.fixupLeft}>
                    <div className={classes['outerBox']}>
                        <div style={{ width: '100%', height: '100%', display: 'table' }} >
                            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                                <span className={classes['thanks']}>Thank You</span>
                            </div>
                        </div>
                    </div>
                    <div style={{textAlign: 'center'}}><span>Join and your recorded videos will be uploaded and shared</span></div>
                    <div style={{textAlign: 'center'}}>
                        <InlineJoinForm className={classes['join']} onChange={this.onUserLogin.bind(this)}/>
                        {this.state.progress && <span>{'uploading: '+this.state.progress}</span>}
                        {this.state.uploadComplete && <span>Upload Complete</span>}
                    </div>
                </section>
            )
        }

        let humanSpeaking = false;

        var videoBox = (participant, i) => {
            let chair = this.seat(i);
            if (participant === 'human' && this.seat(i) === 'speaking')
                humanSpeaking = true;
            return (
                <div className={cx(className, classes['box'], classes[this.seat(i)])} key={participant}>
                    <video className={cx(className, classes['participant'], classes[this.seat(i)], !begin && classes['begin'])}
                        ref={this[participant]}
                        playsInline
                        autoPlay
                        controls={false}
                        muted={participant === 'human' || chair !== 'speaking'}
                        loop={participant !== 'human' && chair !== 'speaking'}
                        onEnded={this.rotateOrder.bind(this)}
                        key={participant + '-video'}></video>
                    <div className={classes['videoFoot']}><span>{!finishUp && seatToName[this.seat(i)]}</span></div>
                </div>
            )
        }

        var agenda = () => {
            return (
                <div className={cx(classes['agenda'], finishUp && classes['finishUp'])} key={'agenda' + this.state.round}>
                    <div className={classes['innerAgenda']}>
                        <span>Questions</span>
                        <ol className={classes['agendaItem']}>
                            {participants.moderator.agenda[this.state.round] && participants.moderator.agenda[this.state.round].map((item, i) => <li key={item + i}>{item}</li>)}
                        </ol>
                    </div>
                </div>
            )
        };

        return (
            <section id="syn-ask-webrtc" key='began' style={{position: 'relative', left: this.state.left, width: '100vw'}} ref={this.fixupLeft}>
                <DebugOverlay ref={this.debugOverlayRef} />
                <div className={classes['outerBox']}>
                    {Object.keys(participants).map(videoBox)}
                    {agenda()}
                </div>
                {beginOverlay()}
                {permissionOverlay()}
                <div style={{height: '5.5rem'}}>
                    <button disabled={!humanSpeaking} className={cx(classes['finishButton'], this.state.talkative && classes['talkative'])} onClick={this.rotateOrder.bind(this)} key='finish'>Finished Speaking</button>
                    <button className={classes['hangUpButton']} onClick={this.hangup.bind(this)} key='hangup'>Hang Up</button>
                    {this.rotateButton && <button onClick={this.rotateOrder.bind(this)} key='rotate'>Rotate</button>}
                </div>
                <div style={{whiteSpace: 'pre-wrap'}}>
                    <span>{this.state.errorMsg}</span>
                </div>
            </section>
        );
    }
}

export default injectSheet(styles)(AskWebRTC);



