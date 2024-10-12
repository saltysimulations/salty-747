import React, { FC } from "react";
import styled, { useTheme } from "styled-components";

import { BsPersonCircle } from "react-icons/bs";
import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import { useSetting } from "../../hooks/useSettings";

export const SignIn: FC<{ selected: boolean, onClick: () => void }> = ({ selected, onClick }) => {
    const { user: navigraphUser } = useNavigraphAuth();
    const [simbriefUsername] = useSetting("boeingMsfsSimbriefUsername");
    const theme = useTheme() as any;

    const userText = () => {
        if (navigraphUser) {
            return navigraphUser.preferred_username;
        } else if (simbriefUsername) {
            return simbriefUsername.toString().toLowerCase();
        } else return "Sign in to your saltPad";
    };

    return (
        <StyledSignIn selected={selected} onClick={onClick}>
            <BsPersonCircle size={90} color={theme.border} style={{ margin: "10px 24px" }} />
            <SignInText>
                <div>{userText()}</div>
                <div>Set up SimBrief and Navigraph</div>
            </SignInText>
        </StyledSignIn>
    );
};

const StyledSignIn = styled.div<{ selected: boolean }>`
    width: 100%;
    display: flex;
    background: ${(props) => (props.selected ? props.theme.select : props.theme.invert.primary)};
    color: ${(props) => (props.selected ? "white" : props.theme.select)};
    border-radius: 15px;
    margin-bottom: 35px;
`;

const SignInText = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 400;

    div {
        padding: 2px 0;
    }

    div:nth-child(1) {
        font-size: 26px;
    }

    div:nth-child(2) {
        font-size: 20px;
        color: ${(props) => props.theme.border};
    }
`;