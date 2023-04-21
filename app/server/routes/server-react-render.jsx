'use strict';

import React from 'react'; // needed by render to string
import {renderToString} from 'react-dom/server';
import App from '../../components/app';
import { JssProvider, SheetsRegistry } from 'react-jss'
import publicConfig from '../../../public.json';
import path from 'path';

function serverReactRender(req, res, next) {
    try {
        const dev=this.app.get('env')==='development';

        if (dev) {
            let dir = path.resolve(__dirname, '../../dist');

            for (let cache in require.cache) {
                let _dir = cache.substr(0, dir.length);

                if (_dir === dir) {

                    let _dir2 = cache.substr(dir.length);

                    if (! /^\/((models))/.test(_dir2)) {
                        delete require.cache[cache];
                    }
                }
            }
        }

        let isIn = null;

        if (req.cookies && req.cookies.synuser) {
            isIn = req.cookies.synuser;

            if (typeof isIn === 'string') {
                isIn = JSON.parse(isIn);
            }
        }

        const props = {
            env: this.app.get('env'),
            path: req.path,
            panels: JSON.parse(JSON.stringify(req.panels || null)),
            user: isIn,
            notFound: req.notFound,
            error: res.locals.error,
            browserConfig: JSON.parse(JSON.stringify(this.browserConfig || null)),
            MechanicalTurkTask : req.MechanicalTurkTask || null
        };

        const sheets= new SheetsRegistry()

        const body = renderToString(
                <JssProvider registry={sheets}>
                    <App {...props}/>
                </JssProvider>
        )

        return res.send(
            `<!doctype html>
            <html>
                <head>
                    <meta charSet="UTF-8"/>
                    <title>Civil Pursuit | Solutions to what Divides Us</title>
                    <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
                    <meta name='viewport' content='width=device-width, maximum-scale=1.0, initial-scale=1.0' />
                    <script>{"if(navigator.userAgent.match(/iPhone|Android|Blackberry|Opera Mini|IEMobile/i)) {var e=document.getElementsByTagName('html')[0]; if(navigator.userAgent.match(/SM-N950U/)) e.style.fontSize='10px'; else e.style.fontSize='8px'}"}
                    </script>

                    <link rel='icon' type='image.png' href='/assets/images/favicon-16x16.png' sizes='16x16'/>
                    <link rel='icon' type='image/png' href='/assets/images/favicon-32x32.png' sizes='32x32'/>
                    <link rel="apple-touch-icon" sizes="180x180"  href="/assets/images/apple-touch-icon.png" />
                    <link rel="manifest"  href="/assets/images/manifest.json"/>
                    <link rel="mask-icon" href="/assets/images/safari-pinned-tab.svg" color="#3f038e"/>
                    <link rel="shortcut icon" href="/assets/images/favicon.ico" />
                    <meta name="msapplication-config" content="/assets/images/browserconfig.xml"/>
                    <meta name="theme-color" content="#ffffff"/>
                    
                    <link rel='stylesheet' href='/assets/css/react-perfect-scrollbar.css'/>"
                    ${dev && "<link rel='stylesheet' href='/assets/css/normalize.css'/>" || ''}
                    ${dev && "<link rel='stylesheet' href='/assets/css/index.css' />" || ''}
                    ${dev && "<link rel='stylesheet' href='/assets/css/bundle.css' />" || ''}                    
                    ${dev && "<link rel='stylesheet' href='/assets/bower_components/font-awesome/css/font-awesome.css' />" || ''}
                    ${dev && "<link rel='stylesheet' href='/assets/bower_components/c3/c3.css'/>" || ''}

                    ${!dev && "<link rel='stylesheet' href='/assets/css/assets.min.css' />" || ''}
                    ${!dev && "<link rel='stylesheet' href='/assets/css/index.min.css' />" || ''}
                    ${!dev && "<link rel='stylesheet' href='/assets/css/bundle.css' />" || ''}
                    ${!dev && "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' />" || ''}
                    <style type="text/css">
                        ${sheets.toString()}
                    </style>

                    <script>window.reactProps=${JSON.stringify(props)+''}</script>
                    <script>window.env="${props.env}"; window.synappEnv="${process.env.SYNAPP_ENV}"</script>

                </head>
                <body>
                    <div id="synapp">${body}</div>
                    ${ ( ( props.browserConfig ) && 
                        (
                            ( props.browserConfig.browser.name=="chrome" && props.browserConfig.browser.version[0] >= 54)
                        || ( props.browserConfig.browser.name=="safari" && props.browserConfig.browser.version[0] >= 11)
                        || ( props.browserConfig.browser.name=="opera" && props.browserConfig.browser.version[0] >= 41)
                        || ( props.browserConfig.browser.name=="firefox" && props.browserConfig.browser.version[0] >= 50)
                        || ( props.browserConfig.browser.name=="edge" && props.browserConfig.browser.version[0] >= 15)
                        )
                    ) ? (logger.info("index browser supports ES6"),`<script src='/assets/js/polyfill.min.js'></script>`)
                        : (logger.info("index browser does not support ES6"),`<script src='/assets/js/polyfill.min.js'></script>`)
                    }
                    <script src='/socket.io/socket.io.js' ></script>
                    ${dev ? `<script src='/assets/webpack/main.js' ></script>` : ''}
                    ${dev ? `<script src='/assets/js/socket.io-stream.js'></script>` : ''}
                    ${dev ? `<script src='/assets/bower_components/d3/d3.js'></script>` : ''}
                    ${dev ? `<script src='/assets/bower_components/c3/c3.js'></script>` : ''}
                    ${!dev ? `<script src='/assets/webpack/main.js' ></script>` : ''}
                    ${!dev ? `<script src='/assets/js/assets.min.js' ></script>` : ''}
                    ${!dev ? `<script>{(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', "${process.env.GOOGLE_ANALYTICS}", 'auto'); ga('send', 'pageview');}</script>`:''}
                    <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
                </body>
            </html>`
        );
    }
    catch (error) {
        logger.info("server-react-render failed", req.path);
        next(error);
    }
}

export default serverReactRender;
