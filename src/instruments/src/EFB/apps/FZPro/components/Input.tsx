import React, { useEffect, useRef, useState } from "react";
import { FC } from "react";
import styled from "styled-components";
import { v4 as uuid } from 'uuid';

type InputProps = {
    placeholder: string;
    onFocusOut?: (value: string) => void;
    applyFilters?: (value: string) => void;
} & StyledInputProps;

export const Input: FC<InputProps> = ({ placeholder, width, margin, onFocusOut, applyFilters }) => {
    const [guid] = useState(uuid());
    const [focused, setFocused] = useState<boolean>(false);
    const [displayValue, setDisplayValue] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (focused) {
            Coherent.trigger('FOCUS_INPUT_FIELD', guid, '', '', '', false);
        } else {
            Coherent.trigger('UNFOCUS_INPUT_FIELD', guid);
        }
        return () => {
            Coherent.trigger('UNFOCUS_INPUT_FIELD', guid);
        };
    }, [focused]);

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.keyCode === 13) {
                blurInputField();
            }
        }

        window.addEventListener("keypress", listener);

        return window.removeEventListener("keypress", listener);
    }, []);

    const blurInputField = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const onFocus = () => {
        setFocused(true);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);

        onFocusOut?.(e.currentTarget.value);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;

        setDisplayValue(applyFilters?.(value) ?? value);
    };

    return (
        <StyledInput
            value={displayValue}
            ref={inputRef}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            width={width}
            placeholder={placeholder}
            margin={margin}
            hidePlaceholder={focused}
        />
    );
};

type StyledInputProps = { width: string, margin?: string, hidePlaceholder?: boolean };

const StyledInput = styled.input`
    width: ${(props: StyledInputProps) => props.width};
    margin: ${(props: StyledInputProps) => props.margin ?? "0"};
    border-radius: 10px;
    border: 1px solid #b9b9bb;
    background: white;
    font-size: 24px;
    padding: 8px 15px;
    text-align: left;

    &::placeholder {
        color: #4f4f4f;
        text-align: center;
        visibility: ${(props: StyledInputProps) => props.hidePlaceholder ? "hidden" : "visible"};
    }
`;
