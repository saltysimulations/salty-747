import pkce from "@navigraph/pkce";
import { SaltyDataStore } from "@shared/persistence";

export type DeviceAuthorizationParams = {
    deviceCode: string;
    verificationUriComplete: string;
}

type Tokens = {
    accessToken: string;
    refreshToken: string;
}

export type User = {
    displayName: string;
}

export class NavigraphAPI {
    private readonly host = "https://identity.api.navigraph.com";

    private readonly clientId = process.env.CLIENT_ID;
    private readonly clientSecret = process.env.CLIENT_SECRET;

    private deviceAuthorizationParams: DeviceAuthorizationParams | null = null;
    private tokens: Tokens | null = null;

    private readonly codeVerifier: string;
    private readonly codeChallenge: string;

    private initialized = false;

    constructor() {
        const pkceObject = pkce();

        this.codeVerifier = pkceObject.code_verifier;
        this.codeChallenge = pkceObject.code_challenge;

        const savedRefreshToken = SaltyDataStore.get("NAVIGRAPH_REFRESH_TOKEN", "");

        if (savedRefreshToken) {
            this.updateTokens(savedRefreshToken)
                .then(() => {
                    this.initialized = true;
                    this.dispatchAuthStateEvent();
                });
        } else {
            this.initialized = true;
        }
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

    private async fetchTokens(): Promise<Tokens> {
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
                        timeout += 5000;
                        setTimeout(request, timeout)
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

    private async updateTokens(refreshToken: string) {
        const res = await fetch(`${this.host}/connect/token`, {
            method: "POST",
            body: new URLSearchParams({
                grant_type: "refresh_token",
                client_id: this.clientId!,
                client_secret: this.clientSecret!,
                refresh_token: refreshToken
            })
        });

        const json = await res.json();

        this.saveTokens({
            accessToken: json.access_token,
            refreshToken: json.refresh_token,
        });

    }

    private saveTokens(tokens: Tokens) {
        this.tokens = tokens;

        SaltyDataStore.set("NAVIGRAPH_REFRESH_TOKEN", tokens.refreshToken);
    }


    public async signIn() {
        this.deviceAuthorizationParams = await this.verificationCodes();
        this.dispatchAuthStateEvent();

        this.saveTokens(await this.fetchTokens());
        this.dispatchAuthStateEvent();
    }

    public async getUser(): Promise<User | null> {
        if (this.tokens?.accessToken) {
            try {
                const res = await fetch(`${this.host}/connect/userinfo`, {
                    headers: {
                        "Authorization": `Bearer ${this.tokens.accessToken}`
                    }
                });

                if (!res.ok) {
                    await this.updateTokens(this.tokens.refreshToken);

                    return this.getUser();
                }

                const json = await res.json();

                return { displayName: json.preferred_username };
            } catch (e) {
                console.log("unable to get navigraph userinfo");
            }
        }

        return null;
    }

    public getDeviceAuthorizationParams(): DeviceAuthorizationParams | null {
        return this.deviceAuthorizationParams;
    }

    public onAuthStateChanged(callback: () => void): () => void {
        const listener = () => callback();

        window.addEventListener("auth-state-changed", listener);

        return () => window.removeEventListener("auth-state-changed", listener);
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    private dispatchAuthStateEvent() {
        window.dispatchEvent(new Event("auth-state-changed"));
    }
}

