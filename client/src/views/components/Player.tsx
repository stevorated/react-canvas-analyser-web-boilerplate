import React, { ChangeEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import dayjs from 'dayjs';
import { FaPlay, FaPause, FaStop, FaFastForward, FaFastBackward, FaSpinner } from 'react-icons/fa';

import { RangeInput } from './RangeInput';
import { Button } from './Button';

type Props = {
    play: () => void;
    stop: () => void;
    pause: () => void;
    nextsong: () => void;
    lastsong: () => void;
    handleChangeVolume: (e: ChangeEvent<HTMLInputElement>) => void;
    handleChangePosition: (e: ChangeEvent<HTMLInputElement>) => void;
    volume: number;
    duration: number;
    position: number;
    ready: boolean;
};

export function Player({
    ready,
    play,
    stop,
    pause,
    nextsong,
    lastsong,
    handleChangeVolume,
    handleChangePosition,
    volume,
    position,
    duration,
}: Props) {
    return ready ? (
        <ContainerDiv>
            <RangeInput
                name="volume"
                id="volume"
                max={100}
                min={0}
                value={volume}
                onChange={handleChangeVolume}
                width="70px"
            />

            <Button
                icon={
                    <FaFastBackward
                        color="rgba(255, 255, 255, 0.8)"
                        size="10px"
                        style={{ padding: '0', margin: '0' }}
                    />
                }
                onClick={() => lastsong()}
            />

            <Button
                icon={
                    <FaFastForward color="rgba(255, 255, 255, 0.8)" size="10px" style={{ padding: '0', margin: '0' }} />
                }
                onClick={() => nextsong()}
            />

            <Button
                icon={<FaPlay color="rgba(255, 255, 255, 0.8)" size="10px" style={{ padding: '0', margin: '0' }} />}
                onClick={() => play()}
            />

            <Button
                icon={<FaPause color="rgba(255, 255, 255, 0.8)" size="10px" style={{ padding: '0', margin: '0' }} />}
                onClick={pause}
            />

            <Button
                icon={<FaStop color="rgba(255, 255, 255, 0.8)" size="10px" style={{ padding: '0', margin: '0' }} />}
                onClick={stop}
            />

            <div style={{ margin: '0 20px' }}>
                <RangeInput
                    name="seek"
                    id="seek"
                    max={duration}
                    maxText={dayjs(duration * 1000).format('mm:ss')}
                    min={0}
                    minText={dayjs(position * 1000).format('mm:ss')}
                    value={position}
                    onChange={handleChangePosition}
                    width="250px"
                />
            </div>
        </ContainerDiv>
    ) : (
        <div style={{ position: 'relative', height: '30px' }}>
            <Spinner />
        </div>
    );
}

const slideIn = keyframes`
from {
    opacity: 0;
    transform: translateY(50px);
}
to {
    opacity: 1;
    transform: translateY(0px);
}

`;

const ContainerDiv = styled.div`
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    position: relative;
    display: flexbox;
    justify-content: center;
    align-items: center;
    padding: 8px;
    background: linear-gradient(
        to right,
        rgba(226, 226, 226, 1) 0%,
        rgba(219, 219, 219, 1) 25%,
        rgba(209, 209, 209, 1) 75%,
        rgba(219, 219, 219, 1) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e2e2e2', endColorstr='#fefefe', GradientType=1 );
    border-radius: 15px;

    animation-name: ${slideIn};
    animation-duration: 1500ms;
`;

const spin = keyframes`
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}

`;

const Spinner = styled(FaSpinner)`
    color: rgba(0, 0, 0, 0.6);
    position: absolute;
    z-index: 100000000;
    top: 50%;
    left: 50%;

    animation-name: ${spin};
    animation-duration: 1500ms;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(1, 0, 0, 1);
`;
