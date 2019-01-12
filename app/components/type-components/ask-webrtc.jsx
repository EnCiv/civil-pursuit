'use strict';

import React from 'react';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import injectSheet from 'react-jss'
import publicConfig from '../../../public.json'
import cx from 'classnames'
import { Object } from 'es6-shim';

/**
 * parent - the parent of the items being created.
 * type - the type of the item being create
 * 
 */

const styles = {
    'ask': {
        'font-size': '1.5em'
    },
    'creator': {
        padding: `${publicConfig.itemVisualGap} 0  ${publicConfig.itemVisualGap} ${publicConfig.itemVisualGap}`
    },
    'why': {
        padding: `0 0 1em 0`,
        'font-size': '1.375em'
    },
    'participant': {
        'display': 'inline',
        '--width': '25vw',
        'width': 'var(--width)',
        'height': 'calc(var(--width) * 0.5625)',
        '$$speaking': {
        },
        '&$nextUp': {
            '--width': '20vw'
        },
        '&$listening1, &$listening2, &$listening3': {
            '--width': '15vw'
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
        width: '75vw',
        height: 'calc((25vw + 15vw) * 0.5625 + 15vh)'
    },
    'speaking': {
        left: 'calc(20vw + 7.5vw + 5vw)',
        top: '5vh'
    },
    'nextUp': {
        left: '7.5vw',
        top: 'calc( 5vw * 0.5625 + 5vh)',
    },
    'listening1': {
        left: '5vw',
        top: 'calc(25vw * 0.5625 + 10vh)',
    },
    'listening2': {
        left: '25vw',
        top: 'calc(25vw * 0.5625 + 10vh)',
    },
    'listening3': {
        left: '45vw',
        top: 'calc(25vw * 0.5625 + 10vh)',
    },
    'finishButton': {
        float: 'right'
    },
    'talkative': {
        background: 'yellow'
    }
}

const listeners = [
    'https://res.cloudinary.com/hu74r07kq/video/upload/v1547185486/listening1.webm',
    'https://res.cloudinary.com/hu74r07kq/video/upload/v1547240803/listening2.webm',
    'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm',
    'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241434/listening4.webm'
]

const participants = {
    moderator: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547245936/intro.webm'],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547185486/listening1.webm'
    },
    audience1: {
        speaking: [],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547240803/listening2.webm'
    },
    audience2: {
        speaking: [],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm'
    },
    human: {},
    audience3: {
        speaking: [],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm'
    }
}
const seating = ['speaking', 'nextUp', 'listening1', 'listening2', 'listening3']

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

    constructor(props) {
        super(props, 'speaker', 0);
        this.createDefaults();
        this.human = React.createRef();
        this.moderator = React.createRef();
        this.audience1 = React.createRef();
        this.audience2 = React.createRef();
        this.audience3 = React.createRef();
    }

    state = {
        errorMsg: '',
        seatOffset: 0,
        round: 0
    }

    componentDidMount() {
        this.mediaSource = new MediaSource();
        this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen.bind(this), false);
        this.initMedia();
        this.playParts();
    }

    playParts() {
        Object.keys(participants).forEach((part, i) => {
            const seatOffset = this.state.seatOffset;
            const seat = seating[(seatOffset + i) % seating.length]
            let speaking = seat === 'speaking';

            if (part === 'human' && speaking) {
                this.startRecording();
                setTimeout(() => { this.setState({ talkative: true }) }, 60000);
                return;
            } else if (part === 'human') {
                return;
            }
            var url = speaking ? (url = participants[part].speaking[this.state.round] || participants[part].listening)
                : (url = participants[part].listening);
            if (participants[part].nowPlaying && participants[part].nowPlaying === url)
                return;
            participants[part].nowPlaying = url;
            this.startPlayback(this[part].current, url, speaking)
        })
    }

    componentWillUnmount() {
        this.stopRecording();
        this.releaseCamera();
    }

    releaseCamera(){
        if(window.stream && window.stream.getTracks){
            var tracks=window.stream.getTracks();
            tracks.forEach(track=>track.stop())
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
        window.stream = stream;
        this.human.current.srcObject = stream;
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
                this.mediaRecorder = new MediaRecorder(window.stream, options);
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
    };

    startPlayback(element, url, speaking) {
        fetch(url)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(async blob => {
                let objectURL = URL.createObjectURL(blob);
                element.src = null;
                element.srcObject = null;
                element.src = objectURL;
                element.controls = false;
                element.loop = !speaking;
                element.muted = !speaking;
                if (speaking)
                    element.addEventListener('ended', this.rotateOrder.bind(this));
                try {
                    await element.play()
                }
                catch (err) {
                    if (err.name === "NotAllowedError") {
                        this.setState({ requestPermission: true });
                    } else
                        logger.error("AskWebRTC.startPlayback caught error", err.name)
                }
            })
            .catch(err=>logger.error("AskWebRTC.startPlayback fetch caught error", url,err))
    }

    async requestPermission(e) {
        try {
            this.recorded0.current.play()
            this.setState({ requestPermission: false });
        }
        catch (err) {
            if (err.name === "NotAllowedError") {
                this.setState({ requestPermission: true });
            }
            else console.error("AskWebRTC.startPlayback caught error", err.name)
        }
    }

    rotateOrder() {
        this.stopRecording();
        var seatOffset = (this.state.seatOffset - 1)
        if (seatOffset < 0) seatOffset = seating.length - 1;
        this.setState({ seatOffset, talkative: false }, () => this.playParts())
    }

    render() {
        const { user, parent, className, classes } = this.props;
        const seatOffset = this.state.seatOffset;
        function seat(i) {
            return seating[(seatOffset + i) % seating.length]
        }
        let humanSpeaking = false;

        var videoBox = (participant, i) => {
            if (participant === 'human' && seat(i) === 'speaking')
                humanSpeaking = true;
            return (
                <div className={cx(className, classes['box'], classes[seat(i)])} key={participant}>
                    <video className={cx(className, classes['participant'], classes[seat(i)])} ref={this[participant]} playsInline autoPlay muted></video>
                    <div>{'participant: ' + participant + ' seat: ' + seat(i)}</div>
                </div>
            )
        }

        return (
            <section id="syn-ask-webrtc">
                <div className={classes['outerBox']}>
                    {Object.keys(participants).map(videoBox)}
                </div>
                {this.state.requestPermission &&
                    <div>
                        <button onClick={this.requestPermission.bind(this)}>Begin</button>
                    </div>
                }
                <div>
                    <span>{this.state.errorMsg}</span>
                </div>
                <button onClick={this.rotateOrder.bind(this)}>Rotate</button>
                {humanSpeaking && <button className={cx(classes['finishButton'], this.state.talkative && classes['talkative'])} onClick={this.rotateOrder.bind(this)}>FinishedSpeaking</button>}
            </section>
        );
    }
}

export default injectSheet(styles)(AskWebRTC);



