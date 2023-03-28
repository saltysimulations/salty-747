import React, { FC, useEffect } from "react";
import QRCode from "qrcode.react";

import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import { User } from "../../lib/navigraph";
import styled from "styled-components";

import shaker from "../../img/black-salty-shaker.png"

export const FZPro: FC = () => {
    const { user, initialized } = useNavigraphAuth();

    return (
        <AppRoot>
            {!initialized && <div>Loading</div>}

            {(initialized && !user) ? <SignInPrompt /> : (user && <App user={user} />)}
        </AppRoot>
    );
};

const App: FC<{ user: User }> = ({ user }) => {
    const { signOut } = useNavigraphAuth();

    return (
        <>
            <div>hi {user.displayName}</div>
            <div onClick={signOut}>sign out</div>
        </>

    )
}

const AppRoot = styled.div`
    width: 100%;
    height: 100%;
`

const SignInPrompt: FC = () => {
    const { signIn, authParams, user, initialized } = useNavigraphAuth();

    useEffect(() => {
        if (initialized && !user) {
            signIn().catch(e => console.log(e));
        }
    }, [initialized]);

    return (
        <StyledSignIn>
            {authParams?.verificationUriComplete && (
                <QRCode value={authParams.verificationUriComplete} size={350} imageSettings={{
                    src: shaker,
                    height: 60,
                    width: 60,
                    excavate: true,
                }} />
            )}

            <SignInTitle>Scan the QR code and log into your Navigraph account to get started</SignInTitle>
        </StyledSignIn>
    )
};

const SignInTitle = styled.div`
    font-size: 52px;
    font-weight: 300;
`

const StyledSignIn = styled.div`
    background: #22242D;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;

    * {
        margin: 50px;
    }
`