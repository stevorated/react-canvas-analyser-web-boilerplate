import React, { ReactNode, CSSProperties, useState } from 'react';
import styled, { css } from 'styled-components';

type Props = {
    children: ReactNode;
    tooltipText: string;
    upper?: boolean;
    style?: CSSProperties;
    delay?: number;
    className?: string;
};

export function Tooltip({
    children,
    tooltipText,
    upper,
    style,
    delay,
    className,
}: Props) {
    const [tooltip, setTooltip] = useState(false);

    const setTooltipTimer = () => {
        setTimeout(() => {
            setTooltip(true);
        }, delay || 1000);
    };

    return (
        <ContainerDiv
            onMouseEnter={() => {
                setTooltipTimer();
            }}
            onMouseLeave={() => {
                setTooltip(false);
            }}
            hover={tooltip}
            style={{ ...style }}
            className={`tooltip ${className}`}
        >
            {children}
            <TootipText upper={upper} className="tooltiptext">
                {tooltipText}
            </TootipText>
        </ContainerDiv>
    );
}

type ContainerDivProps = {
    hover?: boolean;
};

const ContainerDiv = styled.div`
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
    ${({ hover }: ContainerDivProps) =>
        hover &&
        css`
            &:hover .tooltiptext {
                visibility: visible;
                opacity: 0.8;
            }
        `} /* 
    } */
`;

type TooltipTextProps = {
    upper?: boolean;
};

const TootipText = styled.span`
    visibility: hidden;
    width: 60px;
    background-color: #555;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    font-size: 12px;

    /* Position the tooltip text */
    position: absolute;
    z-index: 1;
    top: 125%;
    top: ${({ upper }: TooltipTextProps) => (upper ? '-150%' : '125%')};
    left: 50%;
    margin-left: -60px;

    /* Fade in tooltip */
    opacity: 0;
    transition: opacity 0.3s ease;

    &.tooltiptext::after {
        content: '';
        position: absolute;
        top: ${({ upper }: TooltipTextProps) => (upper ? '100%' : '-35%')};
        bottom: ${({ upper }: TooltipTextProps) =>
            upper ? '125%' : undefined};
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
        transform: ${({ upper }: TooltipTextProps) =>
            upper ? undefined : 'rotate(180deg)'};
    }
`;
