import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

type Props = {
    value: number;
    max: number;
    min?: number;
    id?: string;
    name?: string;
    width?: string;
    maxText?: string;
    minText?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function RangeInput({ id, name, min, max, value, onChange, maxText, minText, width }: Props) {
    return (
        <ContainerDiv>
            <Span>{minText}</Span>
            <Range
                id={id}
                type="range"
                name={name}
                max={max}
                min={min ?? 0}
                value={value}
                onChange={onChange}
                width={width}
            />
            <Span>{maxText}</Span>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Span = styled.span`
    font-size: 14px;
    color: grey;
    margin: 0 4px;
`;

const Range = styled.input`
    margin: 0 2px;
    width: ${({ width }: { width?: string }) => width};
`;
