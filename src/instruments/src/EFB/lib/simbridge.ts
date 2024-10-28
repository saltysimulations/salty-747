// Copyright (c) 2024 FlyByWire Simulations, Salty Simulations
// SPDX-License-Identifier: GPL-3.0

export class SimBridge {
    private readonly host = "http://localhost";
    private readonly url;

    constructor(port: number) {
        this.url = `${this.host}:${port}`;
    }

    public async getImage(filename: string): Promise<Blob> {
        if (!this.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        if (filename) {
            const response = await this.fetchWithTimeout(`${this.url}/api/v1/utility/image?filename=${filename}`);
            if (response.ok) {
                return response.blob();
            }
            throw new Error(`SimBridge Error: ${response.status}`);
        }
        throw new Error("File name or page number missing");
    }

    public async getImageList(): Promise<string[]> {
        if (!this.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        const response = await this.fetchWithTimeout(`${this.url}/api/v1/utility/image/list`);
        if (response.ok) {
            return response.json();
        }
        throw new Error(`SimBridge Error: ${response.status}`);
    }

    public async getPDFPage(filename: string, pageNumber: number): Promise<Blob> {
        if (!this.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        if (filename || pageNumber) {
            const response = await this.fetchWithTimeout(`${this.url}/api/v1/utility/pdf?filename=${filename}&pagenumber=${pageNumber}`);
            if (response.ok) {
                return response.blob();
            }
            throw new Error(`SimBridge Error: ${response.status}`);
        }
        throw new Error("File name or page number missing");
    }

    public async getPDFPageNum(filename: string): Promise<number> {
        if (!this.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        if (filename) {
            const response = await this.fetchWithTimeout(`${this.url}/api/v1/utility/pdf/numpages?filename=${filename}`);
            if (response.ok) {
                return response.json();
            }
            throw new Error(`SimBridge Error: ${response.status}`);
        }
        throw new Error("File name or page number missing");
    }

    public async getPDFList(): Promise<string[]> {
        if (!this.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        const response = await this.fetchWithTimeout(`${this.url}/api/v1/utility/pdf/list`);

        if (response.ok) {
            return response.json();
        }
        throw new Error(`SimBridge Error: ${response.status}`);
    }

    public async getHealth(): Promise<boolean> {
        const response = await this.fetchWithTimeout(`${this.url}/health`, undefined, 5000);

        if (!response.ok) {
            throw new Error(`SimBridge Error: ${response.status}`);
        }

        const healthJson = await response.json();

        if (healthJson.status === "ok") {
            return true;
        }

        return false;
    }

    private fetchWithTimeout = (resource: RequestInfo, options?: object, timeout: number = 2000): Promise<Response> => {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timed out after ${timeout} ms`));
            }, timeout);

            fetch(resource, options)
                .then((value) => {
                    clearTimeout(timer);
                    resolve(value);
                })
                .catch((reason) => {
                    clearTimeout(timer);
                    reject(reason);
                });
        });
    };
}
