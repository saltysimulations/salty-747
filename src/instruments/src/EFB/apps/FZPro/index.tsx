import React, { FC, useEffect } from "react";
import QRCode from "qrcode.react";

import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";

export const FZPro: FC = () => {
    const {signIn, authParams, user, initialized} = useNavigraphAuth();

    useEffect(() => {
        if (initialized && !user) {
            signIn().catch(e => console.log(e));
        }
    }, [initialized]);


    return (
        <div>
            {!initialized && <div>Loading</div>}

            {authParams?.verificationUriComplete && initialized && !user && (
                <>
                    <QRCode value={authParams.verificationUriComplete} size={250} />
                </>
            )}

            {user && <div>hi {user.displayName}</div>}
        </div>
    );
}
