'use strict';

import React from 'react';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import injectSheet from 'react-jss'
import publicConfig from '../../../public.json'
import cx from 'classnames'

/**
 * parent - the parent of the items being created.
 * type - the type of the item being create
 * 
 */

 const TransitionTime=500;
 const TopMargin='0vh'

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
        'font-size': '1.5rem',
    },
    hangUpButton: {
        width: '10em',
        position: 'absolute',
        left: '25vw',
        color: 'white',
        background: 'linear-gradient(to bottom, #ff6745 0%,#ff5745 51%,#ff4745 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': '1.5rem',
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
        width: '10em',
        position: 'absolute',
        right: '25vw',
        color: 'white',
        background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': '1.5rem',
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
    'begin': {}

}


const participants = {
    moderator: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547245936/intro.webm', 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547491227/moderator-polarization.webm'],
        speakingObjectURLs: [],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547185486/listening1.webm',
        listeningObjectURL: null,
        agenda: [['Who you are', 'Where you are', 'Your political party or belief'], ['Should we do something about political polarization', 'Why or Why Not']]
    },
    audience1: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547439786/qian-intro.webm', 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547439195/qian-polarization.webm'],
        speakingObjectURLs: [],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547439660/qian-silence.webm',
        listeningObjectURL: null
    },
    audience2: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm', 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm'],
        speakingObjectURLs: [],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm',
        listeningObjectURL: null
    },
    human: {},
    audience3: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening4.webm', 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening4.webm'],
        speakingObjectURLs: [],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening4.webm',
        listeningObjectURL: null
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
            <ReactActionStatePath {...this.props}>
                <RASPAskWebRTC />
            </ReactActionStatePath>
        )
    }
}

class RASPAskWebRTC extends ReactActionStatePathClient {

    requestPermissionElements = [];
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
        this.fixupLeft=this.fixupLeft.bind(this);
        if(typeof window !== 'undefined')
            window.onresize=this.onResize.bind(this);
    }

    state = {
        errorMsg: '',
        seatOffset: 0,
        round: 0
    }

    componentDidMount() {
        this.mediaSource = new MediaSource();
        this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen.bind(this), false);
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
            this.setState({ errorMsg: `navigator.getUserMedia error:${e.toString()}` });
        }
    }

    handleSuccess(stream) {
        console.log('getUserMedia() got stream:', stream);
        this.stream = stream;
        this.human.current.srcObject = stream;
        Object.keys(participants).forEach(part => this.nextMediaState(part))
    }

    startRecording() {
        this.recordedBlobs = [];
        if (!this.mediaRecorder) {
            let options = { mimeType: 'video/webm;codecs=vp9' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.error(`${options.mimeType} is not Supported`);
                this.setState({ errorMsg: `${options.mimeType} is not Supported` });
                options = { mimeType: 'video/webm;codecs=vp8' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.error(`${options.mimeType} is not Supported`);
                    this.setState({ errorMsg: `${options.mimeType} is not Supported` });
                    options = { mimeType: 'video/webm' };
                    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                        console.error(`${options.mimeType} is not Supported`);
                        this.setState({ errorMsg: `${options.mimeType} is not Supported` });;
                        options = { mimeType: '' };
                    }
                }
            }

            try {
                this.mediaRecorder = new MediaRecorder(this.stream, options);
            } catch (e) {
                console.error('Exception while creating MediaRecorder:', e);
                this.setState({ errorMsg: `Exception while creating MediaRecorder: ${JSON.stringify(e)}` });
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
        if (this.props.user) {
            return this.upload(blob)
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    // for the given seatOffset and round, fetch the object, or start the media
    nextMediaState(part) {
        if (part === 'human') return;
        // humans won't get here
        var { round } = this.state;

        let speaking = (this.seat(Object.keys(participants).indexOf(part)) === 'speaking')

        var objectURL, url;
        if (speaking) {
            if (!(objectURL = participants[part].speakingObjectURLs[round]))
                url = participants[part].speaking[round] || participants[part].listening;
        } else {
            if (!(objectURL = participants[part].listeningObjectURL))
                url = participants[part].listening;
        }
        if (objectURL) {
            this.playObjectURL(part, objectURL, speaking);
        } else
            return this.fetchObjectURLThenPlay(part, url, speaking)
    }

    // fetchObjectURLThenPlay
    fetchObjectURLThenPlay(part, url, speaking) {
        console.info("fetchObjectURL", part, url, speaking)
        let { round } = this.state;
        fetch(url)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(async blob => {
                var objectURL = URL.createObjectURL(blob);
                if (speaking)
                    participants[part].speakingObjectURLs[round] = objectURL;
                else
                    participants[part].listeningObjectURL = objectURL;
                this.playObjectURL(part, objectURL, speaking);
            })
            .catch(err => logger.error("AskWebRTC.startPlayback fetch caught error", url, err))
    }


    async playObjectURL(part, objectURL, speaking) {
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
            } else
                logger.error("AskWebRTC.startPlayback caught error", err.name);
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
            else console.error("AskWebRTC.startPlayback caught error", err.name)
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
                if (newChair === 'speaking') {
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
        this.setState({ seatOffset, round, talkative: false }, () => { let func; while (func = followup.shift()) func(); })
    }

    hangup() {
        setTimeout(() => {
            this.releaseCamera();
            this.setState({ done: true });``
        }, 1.5* TransitionTime);
        return this.setState({ finishUp: true });
    }

    upload(blob) {
        var stream = ss.createStream();
        stream.on('error',(err)=>logger.error("AskWebRTC.upload socket stream error:",err))

        let oldSeatOffset = this.state.seatOffset + 1 % Object.keys(participants).length;
        var name = this.props.user.id + '-' + this.state.round + '-' + this.seat(Object.keys(participants).indexOf('human'), oldSeatOffset) + '.webm';

        ss(window.socket).emit('upload video', stream, { name, size: blob.size });

        var bstream=ss.createBlobReadStream(blob, {highWaterMark: 1024 * 200}).pipe(stream); // high hiwWaterMark to increase upload speed
        bstream.on('error',(err)=>logger.error("AskWebRTC.upload blob stream error:",err))
    }

    render() {
        const { user, parent, className, classes } = this.props;
        const { finishUp, done, begin } = this.state;

        
        const beginOverlay=()=>(
            !begin &&
                <div className={cx(classes['outerBox'],classes['beginBox'])}>
                    <div style={{ width: '100%', height: '100%', display: 'table' }} >
                        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                            <div><span className={classes['thanks']}>You are about to experience a new kind of web conference - for productive online deliberation.</span></div>
                            <div><button className={classes['beginButton']} onClick={()=>this.setState({begin: true},()=>this.initMedia())}>Begin</button></div>
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
                <div className={classes['outerBox']}>
                    {Object.keys(participants).map(videoBox)}
                    {agenda()}
                </div>
                {beginOverlay()}
                {this.state.requestPermission &&
                    <div>
                        <button onClick={this.requestPermission.bind(this)}>Begin</button>
                    </div>
                }
                <div>
                    <span>{this.state.errorMsg}</span>
                </div>
                <div style={{height: '5.5rem'}}>
                    <button disabled={!humanSpeaking} className={cx(classes['finishButton'], this.state.talkative && classes['talkative'])} onClick={this.rotateOrder.bind(this)} key='finish'>Finished Speaking</button>
                    <button className={classes['hangUpButton']} onClick={this.hangup.bind(this)} key='hangup'>Hang Up</button>
                    {this.rotateButton && <button onClick={this.rotateOrder.bind(this)} key='rotate'>Rotate</button>}
                </div>
            </section>
        );
    }
}

export default injectSheet(styles)(AskWebRTC);



