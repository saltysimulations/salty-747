import React, { FC } from "react";
import styled from "styled-components";

import { BsPersonCircle } from "react-icons/bs";

export const SignIn: FC = () => (
    <StyledSignIn>
        <BsPersonCircle size={90} color="#B9B9BB" style={{ margin: "10px 24px" }} />
        <SignInText>
            <div>Sign in to your saltPad</div>
            <div>Set up SimBrief and Navigraph</div>
        </SignInText>
    </StyledSignIn>
);

const StyledSignIn = styled.div`
    width: 100%;
    display: flex;
    background: white;
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
        padding: 4px 0;
    }

    div:nth-child(1) {
        font-size: 26px;
        color: #1476fb;
    }

    div:nth-child(2) {
        font-size: 20px;
        color: #b9b9bb;
    }
`;