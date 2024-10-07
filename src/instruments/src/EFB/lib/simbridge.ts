// Copyright (c) 2024 FlyByWire Simulations, Salty Simulations
// SPDX-License-Identifier: GPL-3.0

export class SimBridge {
    private static URL = "http://localhost:8380";

    public static async getImage(filename: string): Promise<Blob> {
        if (!SimBridge.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        if (filename) {
            const response = await SimBridge.fetchWithTimeout(`${SimBridge.URL}/api/v1/utility/image?filename=${filename}`);
            if (response.ok) {
                return response.blob();
            }
            throw new Error(`SimBridge Error: ${response.status}`);
        }
        throw new Error("File name or page number missing");
    }

    public static async getImageList(): Promise<string[]> {
        if (!SimBridge.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        const response = await SimBridge.fetchWithTimeout(`${SimBridge.URL}/api/v1/utility/image/list`);
        if (response.ok) {
            return response.json();
        }
        throw new Error(`SimBridge Error: ${response.status}`);
    }

    public static async getPDFPage(filename: string, pageNumber: number): Promise<Blob> {
        if (!SimBridge.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        if (filename || pageNumber) {
            const response = await SimBridge.fetchWithTimeout(`${SimBridge.URL}/api/v1/utility/pdf?filename=${filename}&pagenumber=${pageNumber}`);
            if (response.ok) {
                return response.blob();
            }
            throw new Error(`SimBridge Error: ${response.status}`);
        }
        throw new Error("File name or page number missing");
    }

    public static async getPDFPageNum(filename: string): Promise<number> {
        if (!SimBridge.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        if (filename) {
            const response = await SimBridge.fetchWithTimeout(`${SimBridge.URL}/api/v1/utility/pdf/numpages?filename=${filename}`);
            if (response.ok) {
                return response.json();
            }
            throw new Error(`SimBridge Error: ${response.status}`);
        }
        throw new Error("File name or page number missing");
    }

    public static async getPDFList(): Promise<string[]> {
        if (!SimBridge.getHealth()) {
            throw new Error("SimBridge is not connected.");
        }
        const response = await SimBridge.fetchWithTimeout(`${SimBridge.URL}/api/v1/utility/pdf/list`);

        if (response.ok) {
            return response.json();
        }
        throw new Error(`SimBridge Error: ${response.status}`);
    }

    public static async getHealth(): Promise<boolean> {
        const response = await SimBridge.fetchWithTimeout(`${SimBridge.URL}/health`, undefined, 5000);

        if (!response.ok) {
            throw new Error(`SimBridge Error: ${response.status}`);
        }

        const healthJson = await response.json();

        if (healthJson.status === "ok") {
            return true;
        }

        return false;
    }

    public static fetchWithTimeout = (resource: RequestInfo, options?: object, timeout: number = 2000): Promise<Response> => {
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
