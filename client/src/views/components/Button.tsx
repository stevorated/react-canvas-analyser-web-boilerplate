import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
    icon: ReactNode;
    disabled?: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function Button({ icon, disabled, onClick }: Props) {
    return (
        <ButtonStyle disabled={disabled} onClick={onClick}>
            {icon}
        </ButtonStyle>
    );
}

const ButtonStyle = styled.button`
    display: block;
    height: 30px;
    width: 30px;
    padding: 0;
    border-radius: 50%;
    margin: 0 6px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid grey;
    transition: all 0.1s linear;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

    &:hover {
        transform: translateY(-1px);
        background: rgba(0, 0, 0, 0.4);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        cursor: pointer;
    }

    &:active {
        transform: translateY(3px);
        background: rgba(0, 0, 0, 0.45);
    }

    &:focus {
        outline: none;
    }
`;
