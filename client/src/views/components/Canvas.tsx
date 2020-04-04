import React, { RefObject, CSSProperties } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
    frequencyC?: RefObject<HTMLCanvasElement>;
    sinewaveC?: RefObject<HTMLCanvasElement>;
    frequencyCanvasStyles?: CSSProperties;
    sinewaveCanvasStyles?: CSSProperties;
    width?: number;
    height?: number;
    display: Display;
    containerStyles?: CSSProperties;
};

type Display = 'both' | 'freq' | 'sine';

export function Canvas({
    frequencyC,
    sinewaveC,
    frequencyCanvasStyles,
    sinewaveCanvasStyles,
    width,
    height,
    display = 'both',
    containerStyles,
}: Props) {
    return (
        <ContainerDiv style={{ ...containerStyles }}>
            {display !== 'sine' && (
                <CanvasElement
                    ref={frequencyC}
                    width={width ? `${width}px` : '1024'}
                    height={height ? `${height}px` : '150'}
                    style={{ ...frequencyCanvasStyles }}
                />
            )}
            {display !== 'freq' && (
                <CanvasElement
                    ref={sinewaveC}
                    width={width ? `${width}px` : '1024'}
                    height={height ? `${height}px` : '150'}
                    style={{ ...sinewaveCanvasStyles }}
                />
            )}
        </ContainerDiv>
    );
}

const fadeIn = keyframes`
from {
    opacity: 0;
}
to {
    opacity: 1;
}

`;

const ContainerDiv = styled.div`
    animation-name: ${fadeIn};
    animation-duration: 8000ms;
`;

const CanvasElement = styled.canvas`
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border-radius: 10px;
`;
