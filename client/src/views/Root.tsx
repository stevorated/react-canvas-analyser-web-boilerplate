import React, { useRef, useEffect, useState } from 'react';

import { AudioHandler } from './components/AudioHandler';
import { Container } from './Container';

// should be created on upper level of app (once)
const handler = new AudioHandler();

const urls = [
    'http://localhost:3000/public/Is It Always Binary.mp3',
    'http://localhost:3000/public/2 Pieces Master.mp3',
    'http://localhost:3000/public/Actually Not Master.mp3',
    'http://localhost:3000/public/Fragments Master.mp3',
    'http://localhost:3000/public/How Come Master.mp3',
    'http://localhost:3000/public/Pick Me Up Master.mp3',
    'http://localhost:3000/public/Son of a Gun Master.mp3',
    'http://localhost:3000/public/War Master.mp3',
];

export function Root() {
    const [ready, setReady] = useState(false);
    const frequencyC = useRef<HTMLCanvasElement>(null);
    const sinewaveC = useRef<HTMLCanvasElement>(null);

    // canvas draw styles
    const styles = {
        fillStyleSinewave: 'rgba(200, 200, 200)',
        fillStyleFrequency: 'rgba(200, 200, 200)',
        strokeStyleSinewave: 'rgba(0, 0, 0)',
        // strokeStyleFrequency: 'rgba(0, 0,255)',
        lineWidth: 1.2,
        level: 100,
        fftSize: 256, // delization of bars from 1024 to 32768
    };

    // componentDidMount like..
    useEffect(() => {
        const canvas = {
            frequencyC: frequencyC.current,
            sinewaveC: sinewaveC.current,
        };

        // should be called i
        handler.loadFiles([urls[0]], canvas, styles).then(() => {
            // remove loader and slideIn player when ready
            setTimeout(() => {
                setReady(true);
            }, 20);
            console.log('ready for use with first load');
        });

        const restOfPaths = urls.filter((_, index) => index !== 0);

        // for smooth user experience should be called in separate from loadFiles
        // as lazy loader
        handler.addFiles(restOfPaths).then(() => {
            console.log('loaded some more paths/urls...');
        });
    }, []);

    return <Container ready={ready} handler={handler} frequencyC={frequencyC} sinewaveC={sinewaveC} />;
}
