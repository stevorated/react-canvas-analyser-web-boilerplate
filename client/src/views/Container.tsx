import React, { ChangeEvent, useState, RefObject, useEffect } from 'react';
import styled from 'styled-components';

import { AudioHandler, Player, Canvas } from './components';

type Props = {
    ready: boolean;
    handler: AudioHandler;
    frequencyC: RefObject<HTMLCanvasElement>;
    sinewaveC: RefObject<HTMLCanvasElement>;
};

export function Container({ ready, handler, frequencyC, sinewaveC }: Props) {
    const [volume, setVolume] = useState(0.5); // volume 0 to 1
    const [position, setPosition] = useState(0); // position in seconds
    const [duration, setDuration] = useState(0); // duration in seconds
    const [busy, setBusy] = useState(false); // busy start for seek bar (to prevent multiple play calls)
    const [temp, setTemp] = useState<number | null>(null); // temp value for dragging seek bar

    useEffect(() => {
        const onChangeSong = () => {
            setPosition(handler.getPosition());
        };

        window.addEventListener('changeposition', onChangeSong);
        return () => window.removeEventListener('changeposition', onChangeSong);
    }, [position]);

    useEffect(() => {
        const onSongEnd = () => {
            handler.getStatus() === 'PLAY' && handler.nextsong();
            setDuration(handler.getDuration());
        };

        window.addEventListener('onsongend', onSongEnd);
        return () => window.removeEventListener('onsongend', onSongEnd);
    }, []);

    useEffect(() => {
        const onCleanCartridge = () => {
            setDuration(0);
        };

        window.addEventListener('cleancartridge', onCleanCartridge);
        return () => window.removeEventListener('cleancartridge', onCleanCartridge);
    }, []);

    useEffect(() => {
        if (!ready) {
            return;
        }

        setDuration(handler.getDuration());
        setVolume(handler.getVolume() * 100);
    }, [ready]);

    const play = (): void => {
        handler.setVolume(volume / 100);
        handler.play();
    };

    const stop = () => {
        handler.stop();
    };

    const pause = () => {
        handler.pause();
    };

    const nextsong = () => {
        handler.nextsong();
        setDuration(handler.getDuration());
    };

    const lastsong = () => {
        handler.lastsong();
        setDuration(handler.getDuration());
    };

    const handleChangeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        setVolume(e.target.valueAsNumber);

        handler.setVolume(e.target.valueAsNumber / 100);
    };

    const handleChangePosition = (e: ChangeEvent<HTMLInputElement>) => {
        setBusy(true);
        setTemp(e.target.valueAsNumber);

        if (busy) {
            return;
        }

        temp && setPosition(temp);
        temp && handler.setPosition(temp);
        pause();

        setTimeout(() => {
            play();
            setBusy(false);
        }, 80);

        temp && setTemp(null);
    };

    return (
        <ContainerDiv>
            <Canvas
                display="both" // required: "sine" | "freq" | "both"
                frequencyC={frequencyC} // required: frequency canvas
                sinewaveC={sinewaveC} // required: sinewave canvas
                frequencyCanvasStyles={{
                    // frequency canvas styles
                    width: '100%',
                    height: '100px',
                    background: 'rgba(0, 0, 0, 0.1)',
                }}
                sinewaveCanvasStyles={{
                    // sinewave canvas styles
                    width: '100%',
                    height: '100px',
                    background: 'rgba(0, 0, 0, 0.1)',
                }}
                containerStyles={{
                    // canvas container style
                    width: '100%',
                }}
            />

            <Player
                ready={ready} // useState (used to show loader until all songs are loaded)
                duration={duration} // song duration from handler
                position={position} // position in current track from handler for seek bar
                handleChangePosition={handleChangePosition} // onChange for seek bar
                volume={volume} // volume bar value
                handleChangeVolume={handleChangeVolume} // onChange for volume bar
                play={play} // play method handler
                stop={stop} // stop method handler
                pause={pause} // pause method handler
                nextsong={nextsong} // nextsong method handler
                lastsong={lastsong} // lastsong method handler
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    background: rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    padding: 10px;
    min-height: 300px;
`;
