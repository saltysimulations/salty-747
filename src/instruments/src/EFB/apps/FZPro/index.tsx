import React, { FC, useEffect } from "react";
import QRCode from "qrcode.react";

import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";

export const FZPro: FC = () => {
    const { signIn, authParams, user } = useNavigraphAuth();

    useEffect(() => {
        signIn().catch(e => console.log(e));
    }, []);

    return (
        <div>
            {!authParams && <div>Loading</div>}

            {authParams?.verificationUriComplete && !user && (
                <>
                    <QRCode value={authParams.verificationUriComplete} size={250} />
                </>
            )}
        </div>
    );
}
