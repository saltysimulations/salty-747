import React, { FC, useEffect } from "react";
import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import QRCode from "qrcode.react";
import shaker from "../../img/black-salty-shaker.png";
import styled from "styled-components";

export const SignInPrompt: FC = () => {
    const { signIn, authParams, user, initialized } = useNavigraphAuth();

    useEffect(() => {
        if (initialized && !user) {
            signIn().catch((e) => console.log(e));
        }
    }, [initialized]);

    const getCode = (uri: string): string => new URLSearchParams(uri.split("?")[1]).get("user_code")?.toString() ?? "";

    return (
        <>
            {authParams?.verificationUriComplete && (
                <StyledSignIn>
                    <QRCodeContainer>
                        <QRCode
                            value={authParams.verificationUriComplete}
                            size={375}
                            imageSettings={{
                                src: shaker,
                                height: 60,
                                width: 60,
                                excavate: true,
                            }}
                        />
                    </QRCodeContainer>
                    <SignInTitle>Scan the QR code and log into your Navigraph account to get started</SignInTitle>
                    <CodeContainer>
                        <div>
                            Or go to <NavigraphLink>https://navigraph.com/code</NavigraphLink>
                        </div>
                        <div>
                            and enter the code <Code>{getCode(authParams.verificationUriComplete)}</Code>
                        </div>
                    </CodeContainer>
                </StyledSignIn>
            )}
        </>
    );
};

const QRCodeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background: white;
`;

const CodeContainer = styled.div`
    * {
        margin: 3px;
    }
`;

const NavigraphLink = styled.span`
    color: #4fa0fc;
`;

const Code = styled.span`
    color: #ff4f4b;
`;

const SignInTitle = styled.div`
    font-size: 40px;
    font-weight: 300;
    margin: 50px;
`;

const StyledSignIn = styled.div`
    background: #22242d;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 28px;
    text-align: center;
`;
