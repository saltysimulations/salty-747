import React, { useEffect, useRef, useState } from "react";
import { FC } from "react";
import styled, { css } from "styled-components";
import { v4 as uuid } from 'uuid';

type InputProps = {
    placeholder: string;
    onFocusOut?: (value: string) => void;
    onFocus?: () => void;
    onUpdateValue?: (value: string) => void;
    applyFilters?: (value: string) => void;
    style?: React.CSSProperties;
    centerPlaceholder?: boolean;
    hidePlaceholder?: boolean;
    placeholderAlign?: "left" | "right";
    textarea?: boolean;
    clearOnFocusOut?: boolean;
    autoFocus?: boolean;
    manualValue?: string;
};

export const Input: FC<InputProps> = ({
                                          placeholder,
                                          style,
                                          onFocusOut,
                                          onFocus,
                                          onUpdateValue,
                                          applyFilters,
                                          centerPlaceholder = true,
                                          hidePlaceholder = false,
                                          placeholderAlign = "left",
                                          textarea = false,
                                          clearOnFocusOut = false,
                                          autoFocus = false,
                                          manualValue,
                                      }) => {
    const [guid] = useState(uuid());
    const [focused, setFocused] = useState<boolean>(false);
    const [displayValue, setDisplayValue] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (focused) {
            Coherent.trigger('FOCUS_INPUT_FIELD', guid, '', '', '', false);
        } else {
            console.log("coherent")
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

        if (autoFocus) {
            inputRef.current && inputRef.current.focus();
            textareaRef.current && textareaRef.current.focus();
        }

        return () => window.removeEventListener("keypress", listener);
    }, [])

    const blurInputField = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
        if (textareaRef.current) {
            textareaRef.current.blur();
        }
    };

    const onFocusInput = () => {
        setFocused(true);

        displayValue && setDisplayValue("");

        onFocus && onFocus();
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.currentTarget.value;
        setFocused(false);

        onFocusOut?.(value);
        setDisplayValue(applyFilters?.(value) ?? value);

        clearOnFocusOut && setDisplayValue("");
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.currentTarget.value;

        setDisplayValue(value);

        onUpdateValue && onUpdateValue(value);
    };

    const props = {
        value: manualValue ? (applyFilters?.(manualValue) ?? manualValue) : displayValue,
        onFocus: onFocusInput,
        onBlur,
        onChange,
        placeholder,
        hidePlaceholder: focused || hidePlaceholder,
        centerPlaceholder,
        placeholderAlign,
        style,
    };

    return (
        textarea ? <StyledTextArea {...props} ref={textareaRef} /> : <StyledInput {...props} ref={inputRef} />
    );
};


type StyledInputProps = { hidePlaceholder?: boolean, centerPlaceholder?: boolean, placeholderAlign: "left" | "right" };

const inputStyle = css`
    display: block;
    position: relative;
    border-radius: 10px;
    border: none;
    border-bottom: 1px solid #b9b9bb;
    background: transparent;
    font-size: 24px;
    padding: 8px 15px;
    text-align: left;
    outline: none;
    color: ${(props) => props.theme.text};

    &::placeholder {
        color: #4f4f4f;
        text-align: ${(props: StyledInputProps) => props.centerPlaceholder ? "center" : props.placeholderAlign};
        visibility: ${(props: StyledInputProps) => props.hidePlaceholder ? "hidden" : "visible"};
    }
`;

const StyledInput = styled.input`
    ${inputStyle}
`;

const StyledTextArea = styled.textarea`
    ${inputStyle}
`;