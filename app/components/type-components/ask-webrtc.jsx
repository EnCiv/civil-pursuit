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
        'transition': 'all .5s linear',
        '$$speaking': {
        },
        '&$nextUp': {
            '--width': '20vw'
        },
        '&$seat2, &$seat3, &$seat4': {
            '--width': '15vw'
        },
        '&$finishUp' :{
            '--width': '1vw'
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
        left: 'calc(20vw + 7.5vw + 2.5vw)',
        top: '5vh'
    },
    'nextUp': {
        left: '7.5vw',
        top: 'calc( 5vw * 0.5625 + 5vh)',
    },
    'seat2': {
        left: '5vw',
        top: 'calc(25vw * 0.5625 + 10vh)',
    },
    'seat3': {
        left: '25vw',
        top: 'calc(25vw * 0.5625 + 10vh)',
    },
    'seat4': {
        left: '45vw',
        top: 'calc(25vw * 0.5625 + 10vh)',
    },
    'finishUp': {
        left: 'calc(75vw / 2)',
        top: 'calc(((25vw + 15vw) * 0.5625 + 15vh) / 2)',
    },
    'finishButton': {
        float: 'right'
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
        top: '5vh',
        left: 'calc(7.5vw + 20vw + 2.5vw + 25vw + 2.5vw)',
        height: 'calc(25vw * 0.5625)',
        'font-weight': '600',
        'font-size': '125%',
        width: '15vw',
        display: 'table',
        'transition': 'all .5s linear',
        '&$finishUp': {
            left: 'calc(75vw / 2)',
            top: 'calc(((25vw + 15vw) * 0.5625 + 15vh) / 2)',
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
    }

}


const participants = {
    moderator: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547245936/intro.webm','https://res.cloudinary.com/hu74r07kq/video/upload/v1547491227/moderator-polarization.webm'],
        speakingObjectURLs:[],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547185486/listening1.webm',
        listeningObjectURL: null,
        agenda: [['Who you are','Where you are','Your political party or belief'],['Should we do something about political polarization','Why or Why Not']]
    },
    audience1: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547439786/qian-intro.webm','https://res.cloudinary.com/hu74r07kq/video/upload/v1547439195/qian-polarization.webm'],
        speakingObjectURLs:[],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547439660/qian-silence.webm',
        listeningObjectURL: null
    },
    audience2: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm','https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm'],
        speakingObjectURLs:[],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening3.webm',
        listeningObjectURL: null
    },
    human: {},
    audience3: {
        speaking: ['https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening4.webm','https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening4.webm'],
        speakingObjectURLs:[],
        listening: 'https://res.cloudinary.com/hu74r07kq/video/upload/v1547241219/listening4.webm',
        listeningObjectURL: null
    }
}
const seating = ['speaking', 'nextUp', 'seat2', 'seat3', 'seat4']

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

    requestPermissionElements=[];
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
        Object.keys(participants).forEach(part => this.nextMediaState(part))
    }

    componentWillUnmount() {
        this.stopRecording();
        this.releaseCamera();
    }

    releaseCamera(){
        if(this.stream && this.stream.getTracks){
            var tracks=this.stream.getTracks();
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
        this.stream = stream;
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
        if(part==='human') return;
        // humans won't get here
        var {round}=this.state;

        let speaking= (this.seat(Object.keys(participants).indexOf(part)) === 'speaking')

        var objectURL,url;
        if(speaking){
            if(!(objectURL=participants[part].speakingObjectURLs[round]))
                url=participants[part].speaking[round] || participants[part].listening;
        } else {
            if(!(objectURL=participants[part].listeningObjectURL))
                url=participants[part].listening;
        }
        if(objectURL){
            this.playObjectURL(part,objectURL,speaking);
        } else
            return this.fetchObjectURLThenPlay(part,url,speaking)  
    }

    // fetchObjectURLThenPlay
    fetchObjectURLThenPlay(part, url, speaking) {
        console.info("fetchObjectURL", part, url, speaking)
        let {round}=this.state;
        fetch(url)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(async blob => {
                var objectURL = URL.createObjectURL(blob);
                if(speaking)
                    participants[part].speakingObjectURLs[round]=objectURL;
                else
                    participants[part].listeningObjectURL=objectURL;
                this.playObjectURL(part,objectURL,speaking);
            })
            .catch(err=>logger.error("AskWebRTC.startPlayback fetch caught error", url,err))
    }


    async playObjectURL(part,objectURL,speaking){
        let element=this[part].current;
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
            while(element=this.requestPermissionElements.shift())
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

    seat(i,seatOffset) {
        if(this.state.finishUp) return 'finishUp';
        if(typeof seatOffset ==='undefined') seatOffset=this.state.seatOffset;
        return seating[(seatOffset + i) % seating.length]
    }

    rotateOrder() {
        var {seatOffset, round}=this.state;
        if(this.recordTimeout) {
            clearTimeout(this.recordTimeout);
            this.recordTimeout=0;
        }
        if(this.talkativeTimeout){
            clearTimeout(this.talkativeTimeout);
            this.talkativeTimeout=0;
        }
        seatOffset-=1;
        var followup=[];
        if(seatOffset===0) round+=1; // back to the moderator, switch to the next round
        if (seatOffset < 0) {
            if(participants.moderator.speaking[round+1])
                seatOffset = seating.length - 1; // moderator just finished, he moves to the back of the order
            else {
                setTimeout(()=>{
                    this.releaseCamera();
                    this.setState({done: true});
                },1000);
                return this.setState({finishUp: true});
            }
        }
        Object.keys(participants).forEach((participant,i)=>{
            let oldChair=this.seat(i);
            let newChair=this.seat(i,seatOffset);
            var element=this[participant].current
            console.info("rotateOrder",participant,seatOffset,element.muted, element.loop)
            if(participant==='human'){
                if(newChair==='speaking') {
                    this.talkativeTimeout=setTimeout(()=>this.setState({talkative: true}),3*60*1000)
                    this.recordTimeout=setTimeout(()=>this.rotateOrder(),5*60*1000)
                    return this.startRecording();
                } else if(oldChair==='speaking')
                    return this.stopRecording();
            } else if(oldChair==='speaking' || newChair==='speaking'){ // will be speaking 
                followup.push(()=>this.nextMediaState(participant));
            } else {
                console.info("participant continue looping", participant, element.loop)
            }
        })
        this.setState({ seatOffset, round , talkative: false },()=>{let func; while(func=followup.shift()) func();})
    }


    render() {
        const { user, parent, className, classes } = this.props;
        const {finishUp, done} = this.state;

        if(done){
            return (
                <section id="syn-ask-webrtc">
                    <div className={classes['outerBox']}>
                        <div style={{width: '100%', height: '100%', display: 'table'}} >
                            <div style={{display: 'table-cell', verticalAlign: 'middle', textAlign: 'center'}} >
                                <span className={classes['thanks']}>Thank You</span>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }

        let humanSpeaking = false;

        var videoBox = (participant, i) => {
            let chair=this.seat(i);
            if (participant === 'human' && this.seat(i) === 'speaking')
                humanSpeaking = true;
            return (
                <div className={cx(className, classes['box'], classes[this.seat(i)])} key={participant}>
                    <video className={cx(className, classes['participant'], classes[this.seat(i)])} 
                        ref={this[participant]} 
                        playsInline 
                        autoPlay 
                        controls={false}
                        muted={participant==='human' || chair !== 'speaking'}
                        loop={participant!=='human' && chair!=='speaking' }
                        onEnded={this.rotateOrder.bind(this)}
                        key={participant+'-video'}></video>
                    <div className={classes['videoFoot']}><span>{!finishUp && this.seat(i)}</span></div>
                </div>
            )
        }

        var agenda = ()=>{return(
            <div className={cx(classes['agenda'], finishUp && classes['finishUp'])} key={'agenda'+this.state.round}>
                <div className={classes['innerAgenda']}>
                    <span>Questions</span>
                    <ol className={classes['agendaItem']}>
                        {participants.moderator.agenda[this.state.round] && participants.moderator.agenda[this.state.round].map((item,i)=><li key={item+i}>{item}</li>)}
                    </ol>
                </div>
            </div>
        )};

        return (
            <section id="syn-ask-webrtc">
                <div className={classes['outerBox']}>
                    {Object.keys(participants).map(videoBox)}
                    {agenda()}
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
                <button onClick={()=>{location.href="/"}}>Hang Up</button>
            </section>
        );
    }
}

export default injectSheet(styles)(AskWebRTC);



