import pkce from "@navigraph/pkce";

export type DeviceAuthorizationParams = {
    deviceCode: string;
    verificationUriComplete: string;
}

type Tokens = {
    accessToken: string;
    refreshToken: string;
}

export class NavigraphAPI {
    private readonly host = "https://identity.api.navigraph.com";

    private readonly clientId = process.env.CLIENT_ID;
    private readonly clientSecret = process.env.CLIENT_SECRET;

    private deviceAuthorizationParams: DeviceAuthorizationParams | null = null;

    private readonly codeVerifier: string;
    private readonly codeChallenge: string;

    constructor() {
        const pkceObject = pkce();

        this.codeVerifier = pkceObject.code_verifier;
        this.codeChallenge = pkceObject.code_challenge;
    }

    private async verificationCodes(): Promise<DeviceAuthorizationParams> {
        const res = await fetch(`${this.host}/connect/deviceauthorization`, {
            method: "POST",
            body: new URLSearchParams({
                client_id: this.clientId!,
                client_secret: this.clientSecret!,
                code_challenge: this.codeChallenge,
                code_challenge_method: "S256",
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const json = await res.json();

        return {
            deviceCode: json.device_code,
            verificationUriComplete: json.verification_uri_complete,
        }
    }

    private async accessTokens(): Promise<Tokens> {
        return new Promise(async (resolve, reject) => {
            if (!this.deviceAuthorizationParams) {
                reject("no authorization params");
            }

            const request = async () => {
                let timeout = 5000;

                const res = await fetch(`${this.host}/connect/token`, {
                    method: "POST",
                    body: new URLSearchParams({
                        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                        device_code: this.deviceAuthorizationParams!.deviceCode,
                        client_id: this.clientId!,
                        client_secret: this.clientSecret!,
                        scope: "openid offline_access charts",
                        code_verifier: this.codeVerifier,
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });

                const json = await res.json();

                if (!res.ok) {
                    console.log("error " + json.error);
                    if (json.error === "authorization_pending") {
                        setTimeout(request, timeout);
                    } else if (json.error === "slow_down") {
                        setTimeout(request, timeout + 5000)
                    } else if (json.error === "access_denied") {
                        reject("access denied by user");
                    } else {
                        reject("device code expired");
                    }
                } else {
                    resolve({
                        accessToken: json.access_token,
                        refreshToken: json.refresh_token,
                    });
                }
            }

            setTimeout(request, 5000);
        })
    }


    public async authorize() {
        this.deviceAuthorizationParams = await this.verificationCodes();
        this.dispatchAuthStateEvent();

        const accessTokens = await this.accessTokens();
        console.log(accessTokens);
    }

    public getDeviceAuthorizationParams(): DeviceAuthorizationParams | null {
        return this.deviceAuthorizationParams;
    }

    public onAuthStateChanged(callback: (user: null) => void): () => void {
        const listener = () => callback(null);

        window.addEventListener("auth-state-changed", listener);

        return () => window.removeEventListener("auth-state-changed", listener);
    }

    private dispatchAuthStateEvent() {
        window.dispatchEvent(new Event("auth-state-changed"));
    }
}

